#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run collectstatic if in production
if [ "$DEBUG" = "False" ] || [ "$DEBUG" = "false" ]; then
    echo "Collecting static files..."
    uv run python manage.py collectstatic --noinput
fi

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
