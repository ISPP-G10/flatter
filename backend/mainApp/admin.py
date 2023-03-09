from django.contrib import admin
from .models import Property, Image, Review, Type, Application

admin.site.register(Property)
admin.site.register(Image)
admin.site.register(Review)
admin.site.register(Type)
admin.site.register(Application)