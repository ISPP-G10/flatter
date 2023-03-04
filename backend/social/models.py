from django.db import models
from authentication.models import FlatterUser
# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=30)
    users = models.ManyToManyField(FlatterUser)

class Message(models.Model):
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Chat(models.Model):
    name = models.CharField(max_length=30)
    messages = models.ManyToManyField(Message)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
