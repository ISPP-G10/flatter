from graphene_django.types import DjangoObjectType
from mainApp.models import Review
from .models import Group, Message
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
        
class GroupedMessagesType(graphene.ObjectType):
    key = graphene.String()
    value = graphene.Field(graphene.List(graphene.List(MessageType)))