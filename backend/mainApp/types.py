from graphene_django.types import DjangoObjectType
from .models import Property
from authentication.models import Tag


class PropertyType(DjangoObjectType):
  class Meta:
    model = Property


class TagType(DjangoObjectType):
    class Meta:
        model = Tag


