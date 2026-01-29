from rest_framework import serializers

from .models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "color", "note_count"]


class NoteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "body", "category", "category_id", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def validate_category_id(self, value):
        if value.user != self.context["request"].user:
            raise serializers.ValidationError("You cannot create a note in a category that does not belong to you.")
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)
