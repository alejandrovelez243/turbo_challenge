# Aesthetic Note Taking App

A modern, high-conversion note-taking application built with **Django (Backend)** and **Next.js (Frontend)**.

## 🚀 Quick Start with Docker

The easiest way to run the entire project is using Docker Compose.

1. **Environment Config**:
   Copy the example environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Run the app**:
   ```bash
   docker compose up --build
   ```

The applications will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **API Docs (Swagger)**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Health Check**: [http://localhost:8000/health/](http://localhost:8000/health/)

---

## 🔧 Backend Development (Django)

The backend uses `uv` for dependency management and `Ruff` for linting.

### Setup
```bash
cd backend
uv sync
```

### Run Tests
```bash
uv run pytest
```

---

## 💻 Frontend Development (Next.js)

The frontend is a Next.js application using TypeScript and Tailwind CSS (or Vanilla CSS as configured).

### Setup
```bash
cd frontend
npm install
```

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests (Playwright)
```bash
# First install browsers
npx playwright install

# Run functional tests
npm run test:e2e

# Run visual regression tests
npm run test:visual
```

---

## 🧪 CI/CD Pipeline

The project includes a robust GitHub Actions pipeline:
1. **Pre-commit**: Runs Linting (Ruff, ESLint) and Type checking.
2. **Backend**: Dispatches pytest after pre-commit passes.
3. **Frontend**: Dispatches Vitest and Playwright after pre-commit passes.

---

## 🛠 Quality Control & Pre-commit

To ensure code quality and avoid CI failures, this project uses `pre-commit` hooks.

### Installation
You should install the hooks locally so they run automatically before every commit:
```bash
# In the root directory
pip install pre-commit  # or brew install pre-commit
pre-commit install
```

### Manual Execution
If you want to run the checks manually on all files:
```bash
pre-commit run --all-files
```

The hooks include:
- **Ruff**: For Python linting and formatting.
- **ESLint**: For Next.js/React linting.
- **TypeScript**: For static type checking in the frontend.
- **General**: Extra checks for JSON/YAML syntax, trailing whitespaces, and large files.

---

## 📝 Features
- **Email-based Auth**: Secure login and signup.
- **Smart Categories**: Default categories created automatically for new users ("Random Thoughts", "School", "Personal").
- **Aesthetic UI**: Premium design with responsive note components.
- **Search & Filter**: Filter notes by category or search term.
