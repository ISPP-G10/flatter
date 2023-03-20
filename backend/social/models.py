from django.db import models
from authentication.models import FlatterUser
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, pre_delete, m2m_changed
from django.dispatch import receiver

class Group(models.Model):
    name = models.CharField(max_length=30, blank=False, null=True)
    individual = models.BooleanField(default=False)
    users = models.ManyToManyField(FlatterUser)

class Message(models.Model):
    text = models.TextField(max_length=500, blank=False, null=False)
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
        raise ValidationError('User not in group')


# Comrpobar que un grupo individual solo tenga dos usuarios
@receiver(m2m_changed, sender=Group.users.through)
def check_individual_group(sender, instance, action, **kwargs):
    if instance.individual and action == 'post_add' and instance.users.count() != 2:
        raise ValidationError('Individual group can only have two users')

# No eliminar un grupos no individuales si tienen más de tres usuarios
@receiver(pre_delete, sender=Group)
def check_group(sender, instance, **kwargs):
    if not instance.individual and instance.users.count() > 2:
        raise ValidationError('Group can not be deleted')

@receiver(pre_save, sender=Group)
def check_name(sender, instance, **kwargs):
    if instance.name and instance.individual:
        instance.name = None
        
    if not instance.name and not instance.individual:
        raise ValidationError('Group must have a name')

#No permitir la creación de grupos no individuales con menos de 3 usuarios.
@receiver(m2m_changed, sender=Group.users.through)
def check_group(sender, instance, action, **kwargs):
    if not instance.individual and action == 'post_add':
        if instance.users.count() < 3:
            raise ValidationError('Group must have at least 3 users')


#Eliminar automáticamente los chats individuales
@receiver(m2m_changed, sender=Group.users.through)
def check_groups(sender, instance, action, **kwargs):
    if instance.individual and instance.users.count() < 2 and action == 'post_remove':
        instance.delete()
    if not instance.individual and instance.users.count() < 3 and action == 'post_remove':
        instance.delete()









