from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import health, login, logout, CustomerViewSet

router = DefaultRouter()
router.register(r"customers", CustomerViewSet, basename="customer")

urlpatterns = [
    path("health/", health, name="Health"),
    path("auth/login/", login, name="Login"),
    path("auth/logout/", logout, name="Logout"),
    path("", include(router.urls)),
]
