import graphene, graphql_jwt, json
from .models import FlatterUser, Property
from .models import Tag
from .types import PropertyType
from django.utils.translation import gettext_lazy as _


class StandOutProperty(graphene.Mutation):
    class Input:
        id_property=graphene.Int(required=True)
        is_outstanding=graphene.Boolean(required=False)
        owner_id=graphene.Int(required=True)
    
    property=graphene.Field(PropertyType)    
    
    @staticmethod
    def mutate(root, info, **kwargs):
        id_property = kwargs.get('id_property', '')
        is_outstanding = kwargs.get('is_outstanding', '').strip()
        owner_id = kwargs.get("owner_id", "")
    
        owner=FlatterUser.objects.get(pk=owner_id)
        property=Property.objects.get(pk=id_property)
        
        #if owner.roles.contains(RoleType.owner) El usuario debe ser OWNER para poder destacar un inmueble
        if property.is_outstanding==False and owner.flatter_coins>0:  
            property.is_outstanding=True
            property.save()
        return StandOutProperty(property=property)
        
        
class PropertyMutation(graphene.ObjectType):
  
    standOut_property= StandOutProperty.Field()