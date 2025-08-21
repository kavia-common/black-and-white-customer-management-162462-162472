from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Customer
from .serializers import LoginSerializer, CustomerSerializer


# PUBLIC_INTERFACE
@swagger_auto_schema(
    method="get",
    operation_id="health_check",
    operation_summary="Health check",
    operation_description="Returns a static message to confirm the server is running.",
    responses={200: openapi.Response(description="OK", examples={"application/json": {"message": "Server is up!"}})},
    tags=["system"],
)
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health(request):
    """Health check endpoint returning a static message."""
    return Response({"message": "Server is up!"})


# PUBLIC_INTERFACE
@swagger_auto_schema(
    method="post",
    operation_id="user_login",
    operation_summary="Login",
    operation_description="Authenticate a user using session-based authentication. Sends back basic user info.",
    request_body=LoginSerializer,
    responses={
        200: openapi.Response(description="Logged in"),
        400: "Invalid credentials",
    },
    tags=["auth"],
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    """Authenticate user credentials and establish a session."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        django_login(request, user)
        return Response({"username": user.username, "is_authenticated": True})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# PUBLIC_INTERFACE
@swagger_auto_schema(
    method="post",
    operation_id="user_logout",
    operation_summary="Logout",
    operation_description="Logs out the current user by clearing the session.",
    responses={200: openapi.Response(description="Logged out")},
    tags=["auth"],
)
@api_view(["POST"])
def logout(request):
    """Logout the currently authenticated user."""
    django_logout(request)
    return Response({"detail": "Logged out"})


class IsAuthenticatedOrReadOnlyForList(permissions.BasePermission):
    """
    Allow unauthenticated users to read the customer list (GET list),
    but require authentication for other actions.
    """

    def has_permission(self, request, view) -> bool:
        if view.action in ["list", "retrieve"] and request.method == "GET":
            return True
        return request.user and request.user.is_authenticated


# PUBLIC_INTERFACE
class CustomerViewSet(viewsets.ModelViewSet):
    """REST API for managing customers."""
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyForList]

    @swagger_auto_schema(
        operation_id="customers_list",
        operation_summary="List customers",
        operation_description="Retrieve a list of customers. Publicly readable.",
        tags=["customers"],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_id="customers_create",
        operation_summary="Create customer",
        operation_description="Create a new customer. Requires authentication.",
        tags=["customers"],
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_id="customers_retrieve",
        operation_summary="Retrieve customer",
        operation_description="Retrieve a customer by ID. Publicly readable.",
        tags=["customers"],
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_id="customers_update",
        operation_summary="Update customer",
        operation_description="Update a customer by ID. Requires authentication.",
        tags=["customers"],
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_id="customers_partial_update",
        operation_summary="Partially update customer",
        operation_description="Partially update a customer by ID. Requires authentication.",
        tags=["customers"],
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_id="customers_delete",
        operation_summary="Delete customer",
        operation_description="Delete a customer by ID. Requires authentication.",
        tags=["customers"],
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
