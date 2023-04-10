from django.contrib import admin
from .models import Group, Message, InappropiateLanguage, Incident, Request

admin.site.register(Group)
admin.site.register(Message)
admin.site.register(Incident)
admin.site.register(Request)
admin.site.register(InappropiateLanguage)