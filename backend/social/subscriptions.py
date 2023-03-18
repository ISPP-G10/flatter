import channels_graphql_ws
import graphene
from .models import Group
from .types import MessageType


class MessageSubscription(channels_graphql_ws.Subscription):
    message = graphene.Field(MessageType)

    class Arguments:
        user_id = graphene.Int(required=True)

    @staticmethod
    def subscribe(root, info, p=None, **kwargs):
        """Called when user subscribes."""

        # Return the list of subscription group names.

        groups_ids = Group.objects.filter(users__id=kwargs.get('user_id')).values_list('id', flat=True)

        return [f'group_{str(group_id)}' for group_id in groups_ids]

    @staticmethod
    def publish(payload, info, **kwargs):
        """Called to notify the client."""

        # Here `payload` contains the `payload` from the `broadcast()`
        # invocation (see below). You can return `MySubscription.SKIP`
        # if you wish to suppress the notification to a particular
        # client. For example, this allows to avoid notifications for
        # the actions made by this particular client.

        return MessageSubscription(message=payload.get('message'))


class SocialSubscription(graphene.ObjectType):
    message_subscription = MessageSubscription.Field()
