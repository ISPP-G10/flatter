import graphene
from .types import FlatterUserType, RoleType
from .models import FlatterUser, Role

class AuthenticationQuery(object):
  
  get_user_by_username = graphene.Field(FlatterUserType, username=graphene.String())
  get_roles = graphene.List(RoleType)

  def resolve_get_user_by_username(self, info, username):
    return FlatterUser.objects.get(username=username)
  
  def resolve_get_roles(self, info):
    return Role.objects.all()