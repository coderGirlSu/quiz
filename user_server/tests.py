from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test', password='test')
        self.token = Token.objects.create(user=self.user)

    def test_login(self):
        response = self.client.post("/user/login/", {"username": "test", "password": "test"})
        self.assertEqual(self.user.is_authenticated, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_logout(self):
        self.token = Token.objects.get(user__username='test')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post("/user/logout/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
