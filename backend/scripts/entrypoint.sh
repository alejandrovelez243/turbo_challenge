#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run migrations
echo "Applying database migrations..."
uv run python manage.py migrate --noinput

# Create superuser if environment variables are set
if [ "$DJANGO_SUPERUSER_USERNAME" ]; then
    echo "Creating superuser..."
    uv run python manage.py createsuperuser \
        --no-input \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL" || true
fi

# Execute the main command
exec "$@"
