from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase


class HealthTests(APITestCase):
    def test_health(self):
        url = reverse('Health')  # Make sure the URL is named
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Server is up!"})


class AuthAndCustomerFlowTests(APITestCase):
    def setUp(self):
        self.username = "tester"
        self.password = "strongpassword"
        User.objects.create_user(username=self.username, password=self.password)

    def test_auth_and_customer_crud(self):
        # Login
        login_url = reverse("Login")
        res = self.client.post(login_url, {"username": self.username, "password": self.password}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get("is_authenticated"))

        # Create customer
        create_url = reverse("customer-list")
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "555-1234",
            "address": "123 Street",
        }
        res = self.client.post(create_url, payload, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        cid = res.data["id"]

        # List customers (should be publicly readable too)
        res = self.client.get(create_url)
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.data), 1)

        # Retrieve
        detail_url = reverse("customer-detail", args=[cid])
        res = self.client.get(detail_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["email"], "john@example.com")

        # Update
        res = self.client.patch(detail_url, {"phone": "555-0000"}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["phone"], "555-0000")

        # Logout
        logout_url = reverse("Logout")
        res = self.client.post(logout_url)
        self.assertEqual(res.status_code, 200)

        # After logout, creating should fail (auth required)
        res = self.client.post(create_url, payload, format="json")
        self.assertIn(res.status_code, [401, 403])
