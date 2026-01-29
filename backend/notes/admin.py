from django.contrib import admin

from .models import Category, Note


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "color", "note_count")
    list_filter = ("user",)
    search_fields = ("name", "user__username")
    readonly_fields = ("note_count",)

    def note_count(self, obj):
        return obj.notes.count()

    note_count.short_description = "Number of Notes"


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "user", "created_at", "updated_at")
    list_filter = ("category", "user", "created_at")
    search_fields = ("title", "body", "user__username", "category__name")
    date_hierarchy = "created_at"
