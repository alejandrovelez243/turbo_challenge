---
name: Django Backend Development
description: Best practices and workflows for developing the Django backend.
---

# Django Backend Skill

## capabilities
- Create new Django Apps.
- Define Models and Migrations.
- Create Serializers and Generic Views.
- Ensure strict linting standards.

## instructions

### 1. Creating a New App
When asked to create a new feature (e.g., "Notes"):
1.  Run `python manage.py startapp <app_name>` inside the `backend` container or directory.
2.  Add the app to `INSTALLED_APPS` in `core/settings.py`.

### 2. Defining Models
- Inherit from `models.Model`.
- Use descriptive field names.
- Always include `created_at` and `updated_at` timestamps (use a base model if possible).
- Run `python manage.py makemigrations` and `migrate`.

### 3. Creating APIs
**Strict Rule**: Use Generic Views.

**Example View (`views.py`):**
```python
from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer

class NoteListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
```

**Example URL (`urls.py`):**
```python
from django.urls import path
from .views import NoteListCreateView, NoteDetailView

urlpatterns = [
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
```

### 4. Code Quality
After any modification, ALWAYS run:
```bash
ruff check . --fix
ruff format .
```
Ensure no unused imports remain.
