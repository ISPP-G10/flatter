from graphene_django.types import DjangoObjectType
from authentication.models import Tag
from .models import Property

class PropertyType(DjangoObjectType):
    class Meta:
        model = Property
    
class TagType(DjangoObjectType):
    class Meta:
        model = Tag


