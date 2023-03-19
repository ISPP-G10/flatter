from django.db import models
from authentication.models import FlatterUser
from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver

class Group(models.Model):
    name = models.CharField(max_length=30, blank=False, null=True)
    individual = models.BooleanField(default=False)
    users = models.ManyToManyField(FlatterUser)


class Message(models.Model):
    text = models.TextField(max_length=500, blank=False, null=True)
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

#Comprobar que un usuario no invie un mensaje a un grupo al que no pertenece
@receiver(pre_save, sender=Message)
def check_user_in_group(sender, instance, **kwargs):
    if instance.user not in instance.group.users.all():
        raise Exception('User not in group')


# Comrpobar que un grupo individual solo tenga un usuario
@receiver(pre_save, sender=Group)
def check_individual_group(sender, instance, **kwargs):
    if instance.individual:
        if instance.users.count() > 1:
            raise Exception('Individual group can only have one user')

# No eliminar un grupos no individuales si tienen más de tres usuarios
@receiver(pre_delete, sender=Group)
def check_group(sender, instance, **kwargs):
    if not instance.individual and instance.users.count() > 3:
        raise Exception('Group can not be deleted')






