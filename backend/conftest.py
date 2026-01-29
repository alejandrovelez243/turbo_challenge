import os

# Override DATABASE_URL to use SQLite in-memory for tests
os.environ["DATABASE_URL"] = "sqlite://:memory:"

import pytest


@pytest.fixture(scope="session")
def django_db_setup():
    """Override database setup to use SQLite in-memory."""
    from django.conf import settings

    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "ATOMIC_REQUESTS": False,
    }
