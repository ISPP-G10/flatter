import graphene
from authentication.models import Tag, FlatterUser
from .types import PropertyType, PetitionType
from authentication.types import TagType
from .models import Property,Petition
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from datetime import datetime, timezone

class MainAppQuery(object):
    get_all_tags = graphene.List(TagType)
    get_property_tags = graphene.List(TagType, property = graphene.Int())
    get_property_by_title = graphene.Field(PropertyType, title=graphene.String())
    get_property_by_id = graphene.Field(PropertyType, id=graphene.Int())
    get_properties = graphene.List(PropertyType)
    get_filtered_properties_by_price_and_city_and_tags = graphene.List(PropertyType, min_price = graphene.Float(), max_price = graphene.Float(), city = graphene.String(), tag = graphene.String())
    get_properties_by_owner = graphene.List(PropertyType, username = graphene.String())
    get_outstanding_properties = graphene.List(PropertyType)
    get_petitions_by_status_and_username_and_dates = graphene.List(PetitionType, username = graphene.String(required = True), status = graphene.String(required = False),end_date = graphene.String(required = False),start_date = graphene.String(required = False))
    get_petitions_by_requester_and_status_and_dates = graphene.List(PetitionType, username = graphene.String(required=True),status = graphene.String(required = False),end_date = graphene.String(required = False),start_date = graphene.String(required = False))

    

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

    def resolve_get_filtered_properties_by_price_and_city_and_tags(self,info,max_price=None,min_price=None,city=None, tag=None):
            q = Q()
            if min_price and max_price and max_price<min_price:
                raise ValueError(_("El precio máximo introducido es menor al mínimo"))
            if max_price:
                q &= Q(price__lte = max_price)
            if min_price:
                q &= Q(price__gte = min_price )
            if city:
                q &= Q(province__icontains = city)
            if tag:
                try:
                    tag = Tag.objects.get(name = tag)
                except Tag.DoesNotExist:
                        raise ValueError(_(f"No se ha podido completar la solicitud debido a que el tag {tag} no existe"))
                q &= Q(tags = tag)
            properties = Property.objects.filter(q)
                
            return properties
    
    def resolve_get_properties_by_owner(self,info,username):
        user = FlatterUser.objects.get(username = username)
        if user.roles.filter(role="OWNER").exists:
            properties = Property.objects.filter(owner = user)
            if len(properties)>0:
                return properties
            else:
                raise ValueError(_("El propietario no tiene ningún inmueble registrado"))
        else:
            raise ValueError(_("El usuario no tiene el rol de propietario"))
        
    def resolve_get_outstanding_properties(self, info):
        
        outstanding_properties = Property.objects.filter(is_outstanding = True)
        
        for property in outstanding_properties:
            if (timezone.now() - property.outstanding_start_date).days > 7:
                property.is_outstanding = False
                property.save()
        return Property.objects.filter(is_outstanding = True)
    def resolve_get_petitions_by_status_and_username_and_dates(self, info, username,status=None, start_date=None, end_date =None):
        q = Q()
        owner = FlatterUser.objects.get(username = username)
        properties = Property.objects.filter(owner = owner)
        if status:
            q &= Q(status = status)
        if start_date:
            start_date = datetime.strptime(start_date,"%Y-%m-%d")
            start_date_with_tz = start_date.replace(tzinfo=timezone.utc)
            q &= Q(creation_at__gte = start_date_with_tz)
        if end_date:
            end_date = datetime.strptime(end_date,"%Y-%m-%d")
            end_date_with_tz = end_date.replace(tzinfo=timezone.utc)
            q &= Q(creation_at__lte = end_date_with_tz)
        q &= Q(property__in =properties)
        petitions = Petition.objects.filter(q)
        return petitions
    
    def resolve_get_petitions_by_requester_and_status_and_dates(self,info,username,status=None, start_date=None, end_date =None):
        q = Q()
        requester = FlatterUser.objects.get(username = username)
        if status:
            q &= Q(status = status)
        if start_date:
            start_date = datetime.strptime(start_date,"%Y-%m-%d")
            start_date_with_tz = start_date.replace(tzinfo=timezone.utc)
            q &= Q(creation_at__gte = start_date_with_tz)  
        if end_date:
            end_date = datetime.strptime(end_date,"%Y-%m-%d")
            end_date_with_tz = end_date.replace(tzinfo=timezone.utc)
            q &= Q(creation_at__lte = end_date_with_tz)
        q &= Q(requester = requester)
        petitions = Petition.objects.filter(q)
        return petitions

