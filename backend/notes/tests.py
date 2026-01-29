from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Category, Note


class CategoryTestCase(APITestCase):
    """Tests for category endpoints."""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="categorytest@example.com", email="categorytest@example.com", password="password123"
        )

    def setUp(self):
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        # Clean categories before each test
        Category.objects.filter(user=self.user).delete()
        self.category = Category.objects.create(name="Work", color="#FF5733", user=self.user)

    def tearDown(self):
        Token.objects.filter(user=self.user).delete()

    def test_list_categories(self):
        """Authenticated user can list their categories."""
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Work")

    def test_create_category(self):
        """Authenticated user can create a category."""
        response = self.client.post("/api/categories/", {"name": "Personal", "color": "#00FF00"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Personal")
        self.assertTrue(Category.objects.filter(name="Personal", user=self.user).exists())

    def test_category_user_isolation(self):
        """User cannot see categories from other users."""
        other_user = User.objects.create_user(
            username="otherc@example.com", email="otherc@example.com", password="password"
        )
        Category.objects.create(name="OtherCategory", color="#000000", user=other_user)

        response = self.client.get("/api/categories/")
        # Should only see the one category created in setUp
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_access(self):
        """Unauthenticated users cannot access categories."""
        self.client.credentials()  # Remove auth
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class NoteTestCase(APITestCase):
    """Tests for note endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="notes@example.com", email="notes@example.com", password="password123"
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.category = Category.objects.create(name="Ideas", color="#FFCC00", user=self.user)
        self.note = Note.objects.create(
            title="Test Note", body="This is a test note body.", category=self.category, user=self.user
        )

    def test_list_notes(self):
        """Authenticated user can list their notes."""
        response = self.client.get("/api/notes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Note")

    def test_create_note(self):
        """Authenticated user can create a note."""
        response = self.client.post(
            "/api/notes/", {"title": "New Note", "body": "New note content.", "category_id": self.category.id}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Note")

    def test_update_note(self):
        """User can update their own note."""
        response = self.client.put(
            f"/api/notes/{self.note.id}/",
            {"title": "Updated Title", "body": "Updated body.", "category_id": self.category.id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_delete_note(self):
        """User can delete their own note."""
        response = self.client.delete(f"/api/notes/{self.note.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=self.note.id).exists())

    def test_note_user_isolation(self):
        """User cannot access notes from other users."""
        other_user = User.objects.create_user(
            username="other@example.com", email="other@example.com", password="password"
        )
        other_category = Category.objects.create(name="Other", color="#000", user=other_user)
        other_note = Note.objects.create(
            title="Other Note", body="Should not be visible.", category=other_category, user=other_user
        )

        response = self.client.get("/api/notes/")
        self.assertEqual(len(response.data), 1)  # Only sees own note

        # Cannot access other user's note directly
        response = self.client.get(f"/api/notes/{other_note.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class NoteFilterTestCase(APITestCase):
    """Tests for note filtering and search."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="filter@example.com", email="filter@example.com", password="password123"
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.category1 = Category.objects.create(name="FilterWork", color="#FF0000", user=self.user)
        self.category2 = Category.objects.create(name="FilterPersonal", color="#00FF00", user=self.user)

        Note.objects.create(title="Work Meeting", body="Discuss project.", category=self.category1, user=self.user)
        Note.objects.create(title="Grocery List", body="Milk, eggs, bread.", category=self.category2, user=self.user)
        Note.objects.create(title="Work Report", body="Q4 results.", category=self.category1, user=self.user)

    def test_filter_by_category(self):
        """Can filter notes by category name."""
        response = self.client.get("/api/notes/?category=FilterWork")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_category_case_insensitive(self):
        """Category filter is case-insensitive."""
        response = self.client.get("/api/notes/?category=filterwork")
        self.assertEqual(len(response.data), 2)

    def test_search_in_title(self):
        """Search finds notes by title."""
        response = self.client.get("/api/notes/?search=grocery")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Grocery List")

    def test_search_in_body(self):
        """Search finds notes by body content."""
        response = self.client.get("/api/notes/?search=milk")
        self.assertEqual(len(response.data), 1)

    def test_search_case_insensitive(self):
        """Search is case-insensitive."""
        response = self.client.get("/api/notes/?search=GROCERY")
        self.assertEqual(len(response.data), 1)

    def test_combined_filters(self):
        """Can combine category filter with search."""
        response = self.client.get("/api/notes/?category=FilterWork&search=report")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Work Report")
