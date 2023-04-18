from django.db import models
from authentication.models import FlatterUser


class Group(models.Model):
    name = models.CharField(max_length=30, blank=False, null=True)
    individual = models.BooleanField(default=False)
    users = models.ManyToManyField(FlatterUser)

class Message(models.Model):
    text = models.CharField(max_length=140, blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True, null=False)
    user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    
class InappropiateLanguage(models.Model):
    word = models.CharField(max_length=140, blank=False, null=False, unique=True)
    
class Incident(models.Model):
    command = models.TextField()
    
class Request(models.Model):
    command = models.TextField()