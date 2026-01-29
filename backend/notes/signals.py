from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Category


@receiver(post_save, sender=User)
def create_default_categories(sender, instance, created, **kwargs):
    if created:
        default_categories = [
            ("Random Thoughts", "#FFCCB6"),  # Soft Orange/Peach
            ("School", "#FDFD96"),  # Soft Yellow
            ("Personal", "#B8E0D2"),  # Soft Green
        ]
        for category_name, color in default_categories:
            Category.objects.create(user=instance, name=category_name, color=color)
