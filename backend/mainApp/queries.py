import graphene
from .models import Property
from .types import PropertyType
from django.db.models import Q

class MainAppQuery(object):
    get_filtered_properties_by_price_and_city = graphene.List(PropertyType, min_price = graphene.Float(), max_price = graphene.Float(), city = graphene.String())
   

    def resolve_get_filtered_properties_by_price_and_city(self,info,max_price,min_price,city):
        q = Q()
        if max_price:
            q &= Q(price__lte = max_price)
        if min_price:
            q &= Q(price__gte = min_price )
        if city:
            q&= Q(location__icontains = city)
        properties = Property.objects.filter(q)
        return properties
    



    
    
