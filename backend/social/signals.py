from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, pre_delete, m2m_changed
from django.dispatch import receiver
from .models import Message, Group
from .types import GroupAndLastMessageType

@receiver(post_save, sender=Message)
def add_message(sender, instance, created, **kwargs):
    from social.subscriptions import MessageSubscription, GroupSubscription
    if created:
        for user in instance.group.users.all():
            MessageSubscription.broadcast(payload={'message': instance}, group=f'group_{user.username}')
            GroupSubscription.broadcast(payload={'group_and_last_message': {'group': instance.group, 'last_message': instance}}, group=f'group_{user.username}')

@receiver(m2m_changed, sender=Group.users.through)
def add_group(sender, instance, **kwargs):
    from social.subscriptions import GroupSubscription
    for user in instance.users.all():
        GroupSubscription.broadcast(payload={'group_and_last_message': {'group': instance, 'last_message': None}}, group=f'group_{user.username}')
    

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









