import graphene
from .types import PropertyType
from .models import Property

class MainAppQuery(object):
  
  get_property_by_title = graphene.Field(PropertyType, title=graphene.String())
  get_property_by_id = graphene.Field(PropertyType, id=graphene.Int())
  get_properties = graphene.List(PropertyType)

  def resolve_get_property_by_title(self, info, title):
    return Property.objects.get(title=title)
  
  def resolve_get_property_by_id(self, info, id):
    return Property.objects.get(id=id)
  
  def resolve_get_properties(self, info):
    return Property.objects.all()
  
