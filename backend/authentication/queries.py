import graphene
from .types import FlatterUserType, RoleType
from .models import FlatterUser, Role
from django.db.models import Q

class AuthenticationQuery(object):
  
  get_user_by_username = graphene.Field(FlatterUserType, username=graphene.String())
  get_roles = graphene.List(RoleType)
  get_filtered_users_by_tag_and_review = graphene.List(FlatterUserType, username=graphene.String(), tag = graphene.String(), owner = graphene.Boolean())

  def resolve_get_user_by_username(self, info, username):
    return FlatterUser.objects.get(username=username)
  
  def resolve_get_filtered_users_by_tag_and_review(self,info,username,tag=None,owner=None):

    username = username.strip()
    
    if not FlatterUser.objects.filter(username=username).exists():
      raise ValueError("User does not exist")

    q = Q()

    if tag:    
      q &= Q(tags__name__icontains = tag)
      
    if owner is not None and owner:
      q &= Q(roles__in = [Role.objects.get(role="OWNER").pk])
    elif owner is not None:
      q &= Q(roles__in = [Role.objects.get(role="RENTER").pk])
    
    return FlatterUser.objects.filter(q).exclude(username__exact = username)
  
  def resolve_get_roles(self, info):
    return Role.objects.all()