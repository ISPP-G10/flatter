from graphene_django.types import DjangoObjectType
from .models import Property

class PropertyType(DjangoObjectType):
  class Meta:
    model = Property
