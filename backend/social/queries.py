import graphene
from django.utils.translation import ugettext_lazy as _
from authentication.models import Tag
from authentication.types import TagType
from .types import GroupType, MessageType
from .models import Group, Message
from authentication.models import FlatterUser

class SocialQueries(object):

    get_all_tag = graphene.List(TagType, tag=graphene.String())
    get_groups = graphene.List(GroupType)
    get_my_groups = graphene.Field(graphene.List(GroupType), username=graphene.String())
    get_my_messages = graphene.Field(graphene.List(MessageType), username=graphene.String())
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
        print(Group.objects.filter(users__in=[user]))
        return Group.objects.filter(users__in=[user])
    
    def resolve_get_my_messages(self, info, username):
        username = username.strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)
        
        if not Message.objects.filter(group__users=user).exists():
            return None
                
        return Message.objects.filter(group__users=user).order_by('-timestamp')

    def resolve_get_messages(self, info):
        return Message.objects.all()
