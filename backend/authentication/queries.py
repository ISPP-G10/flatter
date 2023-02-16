import graphene
from .types import FlatterUserType
from .models import FlatterUser

class AuthenticationQuery(object):
  
  get_user_by_username = graphene.Field(FlatterUserType, username=graphene.String())

  def resolve_get_user_by_username(self, info, username):
    return FlatterUser.objects.get(username=username)