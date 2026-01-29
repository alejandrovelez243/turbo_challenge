# Build stage
FROM python:3.13-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency files from backend directory
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies (no dev groups)
RUN uv sync --frozen --no-dev

# Final stage
FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /bin/uv /bin/uv

# Copy project files from backend directory
COPY backend/ .

# Path setup for uv
ENV PATH="/app/.venv/bin:$PATH"

# Make entrypoint executable
RUN chmod +x scripts/entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/app/scripts/entrypoint.sh"]

# Run with Gunicorn and Uvicorn workers for async support
CMD ["uv", "run", "gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "core.asgi:application"]
