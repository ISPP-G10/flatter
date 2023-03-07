import graphene
from authentication.models import Tag,FlatterUser
from .types import PropertyType,TagType
from .models import Property
from django.utils.translation import gettext_lazy as _

class MainAppQuery(object):
    get_all_tags = graphene.List(TagType)
    get_property_tags = graphene.List(TagType, property = graphene.Int())
    get_property_by_title = graphene.Field(PropertyType, title=graphene.String())
    get_property_by_id = graphene.Field(PropertyType, id=graphene.Int())
    get_properties = graphene.List(PropertyType)
    get_filtered_properties_by_price_and_city = graphene.List(PropertyType, min_price = graphene.Float(), max_price = graphene.Float(), city = graphene.String())
    get_properties_by_owner = graphene.List(PropertyType, username = graphene.String())

    def resolve_get_property_by_title(self, info, title):
        return Property.objects.get(title=title)

    def resolve_get_property_by_id(self, info, id):
        return Property.objects.get(id=id)

    def resolve_get_properties(self, info):
        return Property.objects.all()
        
    def resolve_get_all_tags(self,info):
        return Tag.objects.filter(entity = 'P')

    def resolve_get_property_tags(self,info,property):
        property = Property.objects.get(id = property)
        return property.tags.all()

    def resolve_get_filtered_properties_by_price_and_city(self,info,max_price,min_price,city):
            q = Q()
            if max_price:
                q &= Q(price__lte = max_price)
            if min_price:
                q &= Q(price__gte = min_price )
            if city:
                q&= Q(province__icontains = city)
            properties = Property.objects.filter(q)
            return properties
    
    def resolve_get_properties_by_owner(self,info,username):
        user = FlatterUser.objects.get(username = username)
        if user.roles.filter(role="OWNER").exists :
            properties = Property.objects.filter(owner = user)
            if len(properties)>0:
                return properties
            else:
                raise ValueError(_("El propietario no tiene ningún inmueble registrado"))
        else:
            raise ValueError(_("El usuario no tiene el rol de propietario"))


        
  


