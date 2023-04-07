import channels_graphql_ws
import graphene
from .models import Group
from .types import MessageType, GroupAndLastMessageType
from authentication.models import FlatterUser
from django.utils.translation import gettext as _

class MessageSubscription(channels_graphql_ws.Subscription):
    message = graphene.Field(MessageType)

    class Arguments:
        username = graphene.String(required=True)
        group_id = graphene.Int(required=False)

    @staticmethod
    def subscribe(root, info, p=None, **kwargs):
        """Called when user subscribes."""

        # Return the list of subscription group names.
        
        username = kwargs.get('username').strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)

        groups_ids = Group.objects.filter(users=user).values_list('id', flat=True)

        return [f'group_{str(group_id)}' for group_id in groups_ids]

    @staticmethod
    def publish(payload, info, **kwargs):
        """Called to notify the client."""

        # Here `payload` contains the `payload` from the `broadcast()`
        # invocation (see below). You can return `MySubscription.SKIP`
        # if you wish to suppress the notification to a particular
        # client. For example, this allows to avoid notifications for
        # the actions made by this particular client.
        
        message = payload.get('message')
        group_id = kwargs.get('group_id')
        
        if message.group.id != group_id:
            return MessageSubscription.SKIP

        return MessageSubscription(message=message)

class GroupSubscription(channels_graphql_ws.Subscription):
    group_and_last_message = graphene.Field(GroupAndLastMessageType)
    
    class Arguments:
        username = graphene.String(required=True)

    @staticmethod
    def subscribe(root, info, p=None, **kwargs):
        username = kwargs.get('username').strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)

        groups_ids = Group.objects.filter(users=user).values_list('id', flat=True)

        return [f'group_{str(group_id)}' for group_id in groups_ids]
    
    @staticmethod
    def publish(payload, info, **kwargs):
        group = payload.get('group_and_last_message')
        
        return GroupSubscription(group_and_last_message=GroupAndLastMessageType(group=group['group'], last_message=group['last_message']))

class SocialSubscription(graphene.ObjectType):
    message_subscription = MessageSubscription.Field()
    group_subscription = GroupSubscription.Field()
