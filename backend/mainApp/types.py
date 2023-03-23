from graphene_django.types import DjangoObjectType
from .models import Property, Image, Petition, Province, Municipality
import graphene, os, base64

class PropertyType(DjangoObjectType):
    class Meta:
        model = Property


class ImageType(DjangoObjectType):
    class Meta:
        model = Image

class ProvinceType(DjangoObjectType):
    class Meta:
        model = Province


class MunicipalityType(DjangoObjectType):
    class Meta:
        model = Municipality

class PetitionType(DjangoObjectType):
  class Meta:
    model = Petition 

