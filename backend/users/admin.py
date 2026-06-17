from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')
    search_fields = ('email', 'name')
    ordering = ('email',)

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('name', 'role')}),
    )