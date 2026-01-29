from django.contrib.auth import authenticate
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, SignUpSerializer, UserSerializer


class SignUpView(generics.CreateAPIView):
    """
    Register a new user.

    Creates a new user account using Email as the primary identifier.
    """

    serializer_class = SignUpSerializer
    permission_classes = []

    @extend_schema(
        summary="Sign Up",
        description="Register a new user with email and password.",
        responses={
            201: OpenApiResponse(response=UserSerializer, description="User created successfully"),
            400: OpenApiResponse(description="Bad request (invalid data)"),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    Authenticate a user.

    Returns an authentication token and user details given valid email and password.
    """

    permission_classes = []
    serializer_class = LoginSerializer

    @extend_schema(
        summary="Login",
        description="Obtain an authentication token using email and password.",
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(description="Login successful, returns token"),
            400: OpenApiResponse(description="Invalid credentials"),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})
