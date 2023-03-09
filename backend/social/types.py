from graphene_django.types import DjangoObjectType
from mainApp.models import Review



class ReviewType(DjangoObjectType):
    class Meta:
        model = Review
