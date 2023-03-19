import graphene
from authentication.models import Tag, FlatterUser
from .types import PropertyType, ProvinceType
from authentication.types import TagType
from .models import Property, Province, Municipality
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from django.utils import timezone


class MainAppQuery(object):
    get_all_tags = graphene.List(TagType)
    get_property_tags = graphene.List(TagType, property=graphene.Int())
    get_property_by_title = graphene.Field(PropertyType, title=graphene.String())
    get_property_by_id = graphene.Field(PropertyType, id=graphene.Int())
    get_properties = graphene.List(PropertyType)
    get_filtered_properties_by_price_and_city = graphene.List(PropertyType, min_price=graphene.Float(),
                                                              max_price=graphene.Float(), city=graphene.String(),
                                                              location=graphene.String(), province=graphene.String())
    get_filtered_properties_by_province_municipality_location = graphene.List(PropertyType, province=graphene.String(),
                                                                              municipality=graphene.String(),
                                                                              location=graphene.String())
    get_properties_by_owner = graphene.List(PropertyType, username=graphene.String())
    get_outstanding_properties = graphene.List(PropertyType)
    get_provinces_municipalities = graphene.List(ProvinceType, name=graphene.String(required=False))

    def resolve_get_property_by_title(self, info, title):
        return Property.objects.get(title=title)

    def resolve_get_property_by_id(self, info, id):
        return Property.objects.get(id=id)

    def resolve_get_properties(self, info):
        return Property.objects.all()

    def resolve_get_all_tags(self, info):
        return Tag.objects.filter(entity='P')

    def resolve_get_property_tags(self, info, property):
        property = Property.objects.get(id=property)
        return property.tags.all()

    def resolve_get_filtered_properties_by_price_and_city(self, info, max_price=None, min_price=None, city=None,
                                                          location=None, province=None):
        q = Q()
        if min_price and max_price and max_price < min_price:
            raise ValueError(_("El precio máximo introducido es menor al mínimo"))
        if max_price:
            q &= Q(price__lte=max_price)
        if min_price:
            q &= Q(price__gte=min_price)
        if city:

            if Municipality.objects.filter(name=city).exists():
                municipality = Municipality.objects.get(name=city)
                q &= Q(municipality=municipality)
            else:
                raise ValueError(_("El municipio introducido no existe"))

        if province:

            if Province.objects.filter(name=province).exists():
                province = Province.objects.get(name=province)
                q &= Q(municipality__province=province)
            else:
                raise ValueError(_("La provincia introducida no existe"))

        if location:
            q &= Q(location__icontains=location)

        properties = Property.objects.filter(q)

        return properties

    def resolve_get_filtered_properties_by_province_municipality_location(self, info, province=None,
                                                                          municipality=None, location=None):
        q = Q()
        if province and not Province.objects.filter(name=province).exists():
            raise ValueError(_("La provincia introducida no existe"))
        elif province:
            province = Province.objects.get(name=province)
            q &= Q(municipality__province=province)

        if municipality and not Municipality.objects.filter(name=municipality).exists():
            raise ValueError(_("El municipio introducido no existe"))
        elif municipality:
            municipality = Municipality.objects.get(name=municipality)
            q &= Q(municipality=municipality)

        if province and municipality and not Municipality.objects.filter(name=municipality.name, province=province).exists():
            raise ValueError(_("El municipio introducido no pertenece a la provincia introducida"))

        if location:
            q &= Q(location__icontains=location)

        properties = Property.objects.filter(q)

        return properties

    def resolve_get_properties_by_owner(self, info, username):
        user = FlatterUser.objects.get(username=username)
        if user.roles.filter(role="OWNER").exists:
            properties = Property.objects.filter(owner=user)
            if len(properties) > 0:
                return properties
            else:
                raise ValueError(_("El propietario no tiene ningún inmueble registrado"))
        else:
            raise ValueError(_("El usuario no tiene el rol de propietario"))

    def resolve_get_outstanding_properties(self, info):

        outstanding_properties = Property.objects.filter(is_outstanding=True)

        for property in outstanding_properties:
            if (timezone.now() - property.outstanding_start_date).days > 7:
                property.is_outstanding = False
                property.save()

        return Property.objects.filter(is_outstanding=True)

    def resolve_get_provinces_municipalities(self, info, name=None):

        if name:
            return Province.objects.filter(name__icontains=name)

        return Province.objects.all()
