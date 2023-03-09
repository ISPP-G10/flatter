from graphene_django.types import DjangoObjectType
from authentication.models import FlatterUser, Role, Tag, UserPreferences, Plan


class FlatterUserType(DjangoObjectType):
  class Meta:
    model = FlatterUser
    exclude = ('password', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'user_permissions')
    
class RoleType(DjangoObjectType):
  class Meta:
    model = Role
    
class TagType(DjangoObjectType):
  class Meta:
    model = Tag
    
class UserPreferencesType(DjangoObjectType):
  
  class Meta:
    model = UserPreferences
    
class PlanType(DjangoObjectType):
  
  class Meta:
    model = Plan