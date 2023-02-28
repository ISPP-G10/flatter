from graphene_django.types import DjangoObjectType
from authentication.models import FlatterUser, Role


class FlatterUserType(DjangoObjectType):
  class Meta:
    model = FlatterUser
    
class RoleType(DjangoObjectType):
  class Meta:
    model = Role