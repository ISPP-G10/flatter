from datetime import datetime

import graphene
from graphene import ObjectType, List, Int
from graphene_django.types import DjangoObjectType
from authentication.models import FlatterUser, Role, Tag, UserPreferences, Plan, Contract, Promotion, ReferralProgram, ReferralProgramController
from mainApp.models import Review


class FlatterUserType(DjangoObjectType):
  class Meta:
    model = FlatterUser
    exclude = ('password', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'user_permissions', 'last_login')
  
  average_rating = graphene.Float()
  age = graphene.Int()
  
  @staticmethod
  def resolve_average_rating(root, info, **kwargs):
    username = root.username
    return get_user_rating(username)

  @staticmethod
  def resolve_age(root, info, **kwargs):
    if root.birthday:
      birthdate = root.birthday
    else:
      return None

    today = datetime.now()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

class FlatterUserPageType(ObjectType):
    users = List(FlatterUserType)
    total_count = Int()
    
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

class ContractType(DjangoObjectType):
  class Meta:
    model = Contract
    
class PromotionType(DjangoObjectType):
  class Meta:
    model = Promotion
    exclude = ('code', 'users_used')
  
class ReferralProgramType(DjangoObjectType):
  class Meta:
    model = ReferralProgram
    exclude = ['users_referred']

class ReferralProgramControllerType(DjangoObjectType):
  class Meta:
    model = ReferralProgramController

def get_user_rating(username):
  reviews = Review.objects.filter(valued_user__username=username)
  if not reviews:
    return 0
  
  final_rating = 0
  total_rating = 0
  for review in reviews:
    
    if not review.rating:
      continue
    
    rating = review.rating
    max_rating = 1

    if review.relationship == 'P' or review.relationship == 'C':
      rating *= 0.5
      max_rating = 0.5
    elif review.relationship == 'A':
      rating *= 0.25
      max_rating = 0.25
    
    final_rating += rating
    total_rating += max_rating
  
  if total_rating == 0:
    return 0
  
  return final_rating / total_rating