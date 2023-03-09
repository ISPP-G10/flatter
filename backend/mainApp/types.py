from graphene_django.types import DjangoObjectType
from .models import Property
from authentication.models import Tag
from .models import Image


class PropertyType(DjangoObjectType):
  class Meta:
    model = Property

class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        
class ImageType(DjangoObjectType):
    class Meta:
        model = Image

