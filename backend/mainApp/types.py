from graphene_django.types import DjangoObjectType
from .models import Property, Image, Province, Municipality


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
