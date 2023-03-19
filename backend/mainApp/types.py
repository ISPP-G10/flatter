from graphene_django.types import DjangoObjectType
from .models import Property, Image,Petition
from .models import Property, Image, Petition
import graphene, os, base64
class PropertyType(DjangoObjectType):
  class Meta:
    model = Property
        
class ImageType(DjangoObjectType):
    class Meta:
        model = Image

class PetitionType(DjangoObjectType):
  class Meta:
    model = Petition 