# Project Rules

## Core Principles
1.  **Simplicity**: Avoid over-engineering. Keep functions small and focused.
2.  **Standardization**: Follow community standards (PEP8 for Python, Airbnb/standard for JS/TS).
3.  **Single Responsibility**: Each component, function, or class should do one thing well.

## Backend (Django) Rules
- **Structure**: Follow the standard `django-admin startproject` and `startapp` structure.
- **Views**:
    - **ALWAYS** use `rest_framework.generics` (e.g., `ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`) for CRUD.
    - **AVOID** `APIView` unless the logic is complex and doesn't fit standard CRUD.
    - **NEVER** use function-based views for APIs unless absolutely necessary (e.g., simple health checks).
- **Serializers**:
    - Use `ModelSerializer` for all model interactions.
    - Define serializers in `serializers.py`.
- **Linting**:
    - Code must pass `ruff check .` with defaults (which includes flake8, isort, black).
    - Line length limit: **100 characters**.
    - Remove unused imports automatically (`ruff check --fix`).

## Frontend (Next.js/React) Rules
- **Structure**: Next.js App Router.
- **API Integration**:
    - **Centralized**: All API calls must originate from `src/services/api/`.
    - **Typed**: Every API response must be cast to a strict TypeScript interface `src/types/`.
    - **Hooks**: Use `TanStack Query` (React Query) for data fetching to ensure caching and single execution.
- **Styling**:
    - Use Vanilla CSS or CSS Modules.
    - **Avoid** inline styles.
    - **Avoid** component libraries (MUI, Bootstrap) unless specified; build custom aesthetic components. (Unless user specified Tailwind, but sticking to prompt defaults for now).

## Documentation
- **Comments**: Explain *why*, not *what*.
- **Docstrings**: Required for all public modules, classes, and methods.
