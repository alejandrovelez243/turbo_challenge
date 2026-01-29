import django_filters

from .models import Note


class NoteFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__name", lookup_expr="iexact")

    class Meta:
        model = Note
        fields = ["category"]
