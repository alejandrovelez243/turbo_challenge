from django.db.models import Count
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics, permissions

from .filters import NoteFilter
from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer


@extend_schema(
    summary="List & Create Categories",
    description="Retrieve a list of categories for the authenticated user, including note counts. POST to create a new category.",
)
class CategoryListView(generics.ListCreateAPIView):
    """
    List and Create user categories.
    """

    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).annotate(note_count=Count("notes"))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    queryset = Category.objects.all()


@extend_schema(
    summary="List & Create Notes",
    description="Retrieve a list of notes for the authenticated user. Supports filtering by category and text search.",
    parameters=[
        OpenApiParameter(name="category", description="Filter by Category Name", required=False, type=str),
        OpenApiParameter(name="search", description="Search in title and body", required=False, type=str),
    ],
)
class NoteListCreateView(generics.ListCreateAPIView):
    """
    List and Create Notes with search and filter support.
    """

    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = NoteFilter
    search_fields = ["title", "body"]
    queryset = Note.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema(summary="Retrieve, Update, Delete Note", description="Get, update, or delete a specific note by ID.")
class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update, and Destroy Notes.
    """

    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Note.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
