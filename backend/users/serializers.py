
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        required=False,
        default="job_seeker",
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "role",
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def create(self, validated_data):
        role = validated_data.pop("role", "job_seeker")

        user = User.objects.create_user(**validated_data)

        UserProfile.objects.create(
            user=user,
            role=role
        )

        return user
