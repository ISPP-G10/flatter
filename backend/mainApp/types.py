from graphene_django.types import DjangoObjectType
from .models import Property, Image,  Request
import graphene, os, base64
class PropertyType(DjangoObjectType):
  class Meta:
    model = Property
        
class ImageType(DjangoObjectType):
    class Meta:
        model = Image
        

class RequestType(DjangoObjectType):
  class Meta:
    model = Request 