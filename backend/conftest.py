import os

# Override DATABASE_URL to use SQLite in-memory for tests if not provided
if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
