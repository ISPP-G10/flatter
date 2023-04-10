from graphene_django.types import DjangoObjectType
from mainApp.models import Review
from .models import Group, Message, InappropiateLanguage
import graphene

class ReviewType(DjangoObjectType):
    class Meta:
        model = Review

class GroupType(DjangoObjectType):
    class Meta:
        model = Group

class MessageType(DjangoObjectType):
    class Meta:
        model = Message

class InappropiateLanguageType(DjangoObjectType):
    class Meta:
        model = InappropiateLanguage
        
class GroupedMessagesType(graphene.ObjectType):
    key = graphene.DateTime()
    value = graphene.Field(graphene.List(graphene.List(MessageType)))
    
class GroupAndLastMessageType(graphene.ObjectType):
    group = graphene.Field(GroupType)
    last_message = graphene.Field(MessageType)