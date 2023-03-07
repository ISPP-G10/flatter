import graphene
from .models import Tag, Property
from .types import PropertyType
from django.utils.translation import gettext_lazy as _


class AddTagToProperty(graphene.Mutation):
  
  class Input:
    id = graphene.Int(required=True)
    tag = graphene.String(required=True)

  property = graphene.Field(PropertyType)
  
  @staticmethod
  def mutate(root, info, **kwargs):
    id = kwargs.get('id', '')
    tag = kwargs.get('tag', '').strip()
    
    selected_property = Property.objects.get(id=id)
    tag = Tag.objects.get_or_create(name=tag, entity='P')
    
    selected_property_tags = selected_property.tags.all()
    if len(selected_property_tags)<8:
      selected_property.tags.add(tag[0])
    else:
      raise ValueError(_("Este inmueble ya tiene el máximo número de tags posibles"))
    
    return AddTagToProperty(property=selected_property)

class MainAppMutation(graphene.ObjectType):
  #verify_token = graphql_jwt.Verify.Field()
  #refresh_token = graphql_jwt.Refresh.Field()
  add_tag_to_property = AddTagToProperty.Field()