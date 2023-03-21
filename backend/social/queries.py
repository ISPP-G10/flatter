import graphene
from django.utils.translation import ugettext_lazy as _
from authentication.models import Tag
from authentication.types import TagType
from .types import GroupType, MessageType, GroupedMessagesType
from .models import Group, Message
from authentication.models import FlatterUser

class SocialQueries(object):

    get_all_tag = graphene.List(TagType, tag=graphene.String())
    get_groups = graphene.List(GroupType)
    get_my_groups = graphene.Field(graphene.List(GroupType), username=graphene.String())
    get_my_messages = graphene.Field(graphene.List(MessageType), username=graphene.String())
    get_messages_by_group = graphene.Field(graphene.List(GroupedMessagesType), username=graphene.String(), group_id=graphene.Int())
    get_messages = graphene.List(MessageType)

    def resolve_get_all_tag(self, info):
        return Tag.objects.all()
    
    def resolve_get_groups(self, info):
        return Group.objects.all()
  
    def resolve_get_my_groups(self, info, username):
        username = username.strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)
        
        return Group.objects.filter(users__in=[user])
    
    def resolve_get_my_messages(self, info, username):
        username = username.strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)
        
        if not Message.objects.filter(group__users=user).exists():
            return None
                
        return Message.objects.filter(group__users=user).order_by('-timestamp')
    
    def resolve_get_messages_by_group(self, info, username, group_id):
        username = username.strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        if not Group.objects.filter(id=group_id).exists():
            raise ValueError(_('El grupo no existe'))
        
        user = FlatterUser.objects.get(username=username)
        group = Group.objects.get(id=group_id)

        if not group.users.filter(id=user.id).exists():
            raise ValueError(_('El usuario no pertenece al grupo'))
        
        messages = Message.objects.filter(group=group).order_by('timestamp')
        
        grouped_messages = {}
        
        for message in messages:
            day = message.timestamp.replace(hour=0, minute=0, second=0, microsecond=0)
            if day in grouped_messages:
                if grouped_messages[day][-1][0].user == message.user:
                    grouped_messages[day][-1].append(message)
                else:
                    grouped_messages[day].append([message])
            else:
                grouped_messages[day] = [[message]]
                
        result = [GroupedMessagesType(key=f"{key.day}/{key.month}/{key.year}", value=value) for key, value in grouped_messages.items()]
        
        return result

    def resolve_get_messages(self, info):
        return Message.objects.all()
