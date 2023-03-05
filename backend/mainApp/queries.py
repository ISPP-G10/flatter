import graphene
from .types import TagType, PropertyType
from .models import Property
from authentication.models import Tag


class MainAppQuery(object):
    get_all_tags = graphene.List(TagType)
    get_property_tags = graphene.List(TagType, property = graphene.Int())

    def resolve_get_all_tags(self,info):
        return Tag.objects.filter(entity = 'P')

    def resolve_get_property_tags(self,info,property):
        property = Property.objects.get(id = property)
        return property.tags.all()