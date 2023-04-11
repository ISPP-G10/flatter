import graphene
from django.utils.translation import ugettext_lazy as _
from authentication.models import Tag
from authentication.types import TagType, FlatterUserType
from mainApp.models import Property
from .recommendations import recommend_similar_users, build_similarity_matrix
from .types import GroupType, MessageType, GroupedMessagesType, GroupAndLastMessageType
from .models import Group, Message
from authentication.models import FlatterUser

class SocialQueries(object):

    get_all_tag = graphene.List(TagType, tag=graphene.String())
    get_tags_by_type = graphene.List(TagType, tag_type=graphene.String())
    get_groups = graphene.List(GroupType)
    get_my_groups = graphene.Field(graphene.List(GroupAndLastMessageType), username=graphene.String())
    get_messages_by_group = graphene.Field(graphene.List(GroupedMessagesType), username=graphene.String(), group_id=graphene.Int())
    get_messages = graphene.List(MessageType)
    get_relationships_between_users = graphene.List(graphene.String, user_login=graphene.String(), user_valued=graphene.String())
    get_users_recommendations = graphene.List(FlatterUserType, username=graphene.String())
    def resolve_get_all_tag(self, info):
        return Tag.objects.all()
    
    def resolve_get_groups(self, info):
        return Group.objects.all()
  
    def resolve_get_my_groups(self, info, username):
        username = username.strip()
        
        if not username or not FlatterUser.objects.filter(username=username).exists():
            raise ValueError(_('El usuario no es válido'))
        
        user = FlatterUser.objects.get(username=username)
        
        groups = Group.objects.filter(users__in=[user])
        
        result = []
        
        for group in groups:
            if Message.objects.filter(group=group).exists():
                last_message = Message.objects.filter(group=group).order_by('-timestamp').first()
            else:
                last_message = None
            result.append(GroupAndLastMessageType(group=group, last_message=last_message))
        
        return result
    
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
                
        result = [GroupedMessagesType(key=key, value=value) for key, value in grouped_messages.items()]
        
        return result

    def resolve_get_messages(self, info):
        return Message.objects.all()

    def resolve_get_tags_by_type(self, info, tag_type=None):
        
        if tag_type=="U":
            return Tag.objects.filter(entity="U")
        elif tag_type=="P":
            return Tag.objects.filter(entity="P")
        else:
            raise ValueError(_('El tipo de etiqueta no es válido'))

    def resolve_get_relationships_between_users(self, info, user_login, user_valued):
        relationships = []
        user_login = FlatterUser.objects.get(username=user_login)
        user_valued = FlatterUser.objects.get(username=user_valued)

        if user_login == user_valued:
            raise ValueError(_('No puedes tener una relación contigo mismo'))



        if user_login.roles.filter(role='OWNER').exists() and user_valued.roles.filter(role='RENTER').exists():
            properties = Property.objects.filter(owner=user_login).filter(flatmates__in=[user_valued])
            if properties.exists():
                relationships.append('Propietario')

        if user_login.roles.filter(role='RENTER').exists() and user_valued.roles.filter(role='OWNER').exists():
            properties = Property.objects.filter(owner=user_valued).filter(flatmates__in=[user_login])
            if properties.exists():
                relationships.append('Inquilino')

        if user_login.roles.filter(role='RENTER').exists() and user_valued.roles.filter(role='RENTER').exists():
            properties = Property.objects.filter(flatmates__in=[user_login]).filter(flatmates__in=[user_valued])
            if properties.exists():
                relationships.append('Compañero')

        if len(relationships) == 0:
            relationships = ['Amigo', 'Excompañero']



        return relationships


    def resolve_get_users_recommendations(self, info, username):
        try:
            user = FlatterUser.objects.get(username=username)
        except FlatterUser.DoesNotExist:
            raise ValueError(_('El usuario no existe'))
        users = FlatterUser.objects.all().exclude(id=user.id)
        if len(users) == 0:
            raise ValueError(_('No hay usuarios para recomendar'))
        matrix = build_similarity_matrix(users, user)
        return recommend_similar_users(matrix)


