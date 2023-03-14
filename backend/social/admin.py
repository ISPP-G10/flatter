from django.contrib import admin
from .models import Group, Message, Chat, Incident, Request

admin.site.register(Group)
admin.site.register(Message)
admin.site.register(Chat)
admin.site.register(Incident)
admin.site.register(Request)