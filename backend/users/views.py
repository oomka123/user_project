# from django.shortcuts import render
# from django.http import JsonResponse
# from django.http import HttpResponse

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdminRole

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetailView(APIView):
    permission_classes = [IsAdminRole]

    def delete(self, request, pk):
        try:
            user_to_delete = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if user_to_delete.role == 'admin':
            return Response({"detail": "Cannot delete an admin user."}, status=status.HTTP_403_FORBIDDEN)

        user_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)