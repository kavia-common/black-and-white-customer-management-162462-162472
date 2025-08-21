from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Customer


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField(help_text="Username for login")
    password = serializers.CharField(write_only=True, help_text="Password for login")

    def validate(self, attrs: dict) -> dict:
        user = authenticate(username=attrs.get("username"), password=attrs.get("password"))
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        attrs["user"] = user
        return attrs


class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for Customer model.
    """

    class Meta:
        model = Customer
        fields = ["id", "first_name", "last_name", "email", "phone", "address", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
