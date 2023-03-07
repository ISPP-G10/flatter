from graphene_django.types import DjangoObjectType

from authentication.models import Tag
from mainApp.models import Review



class ReviewType(DjangoObjectType):
    class Meta:
        model = Review

class TagType(DjangoObjectType):
    class Meta:
        model = Tag

