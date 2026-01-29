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

## 🧠 Process & AI Tools

This project was developed using a cutting-edge **AI-First workflow**, leveraging advanced agentic tools to achieve high velocity and technical excellence.

### 🤖 AI Tools Used
- **Antigravity (Google DeepMind)**: The primary agentic AI coding assistant used for the entire development lifecycle. It handled everything from initial scaffolding and refactoring to complex troubleshooting of Docker/Railway deployments.
- **Pencil.dev (Pencil MCP)**: Used to achieve **pixel-perfect UI**. Pencil allowed for direct interaction with the design system, ensuring that the React/Tailwind components matched the intended "aesthetic" vision with high precision.
- **Railway MCP**: Integrated directly into the workflow to manage environments and monitor deployments.

### 🛣️ Development Process
1.  **Iterative Planning**: Used Antigravity to draft implementation plans and architecture before writing code.
2.  **Design-to-Code**: Leveraged Pencil.dev to translate design tokens into reusable UI components.
3.  **Robust Backend**: Built a Django API from scratch, focusing on secure authentication and clean data models.
4.  **Full-Stack Sync**: Continuous integration between the backend API and Next.js frontend, verified by automated E2E tests.
5.  **DevOps Excellence**: Configured Docker for consistent local development and a optimized multi-stage build for Railway.

---

## 🛠️ Technical Decisions

- **Dependency Management**: We chose **`uv`** for the backend to ensure nearly instantaneous installs and deterministic builds.
- **Production Server**: Configured **Gunicorn** with **Uvicorn workers**. This hybrid setup provides the stability of Gunicorn with the asynchronous performance of Uvicorn, ideal for Django's ASGI features.
- **Static Assets**: Implemented **WhiteNoise** for static file serving. This removes the need for a separate Nginx container on Railway, simplifying the architecture without sacrificing performance.
- **CI/CD**: A "Quality First" approach with GitHub Actions that blocks deployments if lints, unit tests, or visual regression tests fail.

---

## 📝 Features
- **Email-based Auth**: Secure login and signup.
- **Smart Categories**: Default categories created automatically for new users ("Random Thoughts", "School", "Personal").
- **Aesthetic UI**: Premium design with responsive note components.
- **Search & Filter**: Filter notes by category or search term.
