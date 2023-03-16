from django.db import models
from authentication.models import FlatterUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class Group(models.Model):
    name = models.CharField(max_length=30, blank=False, null=True)
    individual = models.BooleanField(default=False)
    users = models.ManyToManyField(FlatterUser)


class Message(models.Model):
    text = models.TextField(blank=False, null=False)
    timestamp = models.DateTimeField(auto_now_add=True, null=False)
    user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
  
    
class Incident(models.Model):
    command = models.TextField()
    
class Request(models.Model):
    command = models.TextField()

@receiver(post_save, sender=Message)
def add_message(sender, instance, created, **kwargs):
    from social.subscriptions import MessageSubscription
    if created:
        MessageSubscription.broadcast(payload={'message': instance}, group=f'group_{instance.group.id}')
