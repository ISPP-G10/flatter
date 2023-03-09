from graphene_django.types import DjangoObjectType
from .models import Property, Image
from authentication.models import Tag


class PropertyType(DjangoObjectType):
  class Meta:
    model = Property
        
class ImageType(DjangoObjectType):
    class Meta:
        model = Image
