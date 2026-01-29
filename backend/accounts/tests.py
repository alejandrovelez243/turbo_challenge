from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class SignUpTestCase(APITestCase):
    """Tests for user registration endpoint."""

    def test_signup_success(self):
        """User can register with valid email and password."""
        response = self.client.post("/api/auth/signup/", {"email": "test@example.com", "password": "securepassword123"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["email"], "test@example.com")
        # Verify user was created with email as username
        self.assertTrue(User.objects.filter(username="test@example.com").exists())

    def test_signup_duplicate_email(self):
        """Cannot register with an email that already exists."""
        User.objects.create_user(username="existing@example.com", email="existing@example.com", password="password")
        response = self.client.post(
            "/api/auth/signup/", {"email": "existing@example.com", "password": "anotherpassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_invalid_email(self):
        """Cannot register with an invalid email format."""
        response = self.client.post("/api/auth/signup/", {"email": "notanemail", "password": "securepassword123"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_missing_password(self):
        """Cannot register without a password."""
        response = self.client.post("/api/auth/signup/", {"email": "test@example.com"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTestCase(APITestCase):
    """Tests for user login endpoint."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="login@example.com", email="login@example.com", password="testpassword123"
        )

    def test_login_success(self):
        """User can login with valid credentials."""
        response = self.client.post("/api/auth/login/", {"email": "login@example.com", "password": "testpassword123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["email"], "login@example.com")

    def test_login_invalid_password(self):
        """Cannot login with wrong password."""
        response = self.client.post("/api/auth/login/", {"email": "login@example.com", "password": "wrongpassword"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        """Cannot login with non-existent email."""
        response = self.client.post(
            "/api/auth/login/", {"email": "doesnotexist@example.com", "password": "anypassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
