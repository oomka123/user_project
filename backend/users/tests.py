from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class UserFlowTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Обычный пользователь
        self.user = User.objects.create_user(
            username='user@test.com',
            email='user@test.com',
            name='Test User',
            password='testpass123',
            role='user',
        )

        # Админ
        self.admin = User.objects.create_user(
            username='admin@test.com',
            email='admin@test.com',
            name='Admin User',
            password='adminpass123',
            role='admin',
            is_staff=True,
        )

    def test_registration(self):
        data = {
            'name': 'New User',
            'email': 'new@test.com',
            'password': 'newpass123',
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], 'new@test.com')

    def test_login(self):
        data = {
            'email': 'user@test.com',
            'password': 'testpass123',
        }
        response = self.client.post('/api/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_me_authenticated(self):
        # Логинимся и получаем токен
        login_response = self.client.post('/api/login/', {
            'email': 'user@test.com',
            'password': 'testpass123',
        })
        token = login_response.data['access']

        # Делаем запрос с токеном
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'user@test.com')

    def test_user_list_admin_only(self):
        # Обычный user не должен получить список
        login_response = self.client.post('/api/login/', {
            'email': 'user@test.com',
            'password': 'testpass123',
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Админ должен получить список
        admin_login = self.client.post('/api/login/', {
            'email': 'admin@test.com',
            'password': 'adminpass123',
        })
        admin_token = admin_login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)