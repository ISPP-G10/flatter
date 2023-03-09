from django.contrib import admin
from .models import FlatterUser, Role, Tag, UserPreferences, Plan

admin.site.register(FlatterUser)
admin.site.register(Role)
admin.site.register(Tag)
admin.site.register(UserPreferences)
admin.site.register(Plan)
