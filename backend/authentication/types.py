from graphene_django.types import DjangoObjectType
from authentication.models import FlatterUser


class FlatterUserType(DjangoObjectType):
  class Meta:
    model = FlatterUser