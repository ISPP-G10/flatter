import graphene
from .types import FlatterUserType, RoleType, PlanType, ContractType
from .models import Contract, FlatterUser, Plan, Role
from django.db.models import Q
from django.utils import timezone

class AuthenticationQuery(object):
  
  get_user_by_username = graphene.Field(FlatterUserType, username=graphene.String())
  get_roles = graphene.List(RoleType)
  get_filtered_users_by_tag_and_review = graphene.List(FlatterUserType, username=graphene.String(), tag = graphene.String(), owner = graphene.Boolean())
  get_plans = graphene.List(PlanType)
  get_contract_by_username = graphene.Field(ContractType, username=graphene.String())

  def resolve_get_user_by_username(self, info, username):
    
    user = FlatterUser.objects.get(username=username)
    current_contract = Contract.objects.filter(user=user, obsolete=False).first()
    
    if current_contract.end_date and timezone.now().date() > current_contract.end_date:
      if user.flatter_coins > current_contract.plan.flatter_coins * current_contract.choices:
        user.flatter_coins -= current_contract.plan.flatter_coins * current_contract.choices
        user.save()
        current_contract.end_date = current_contract.end_date + timezone.timedelta(days=current_contract.choices)
        current_contract.save()
      else:
        current_contract.obsolete = True
        current_contract.save()
        Contract.objects.create(user=user, 
                                plan=Plan.objects.get(plan_type='B'), 
                                choices=None, 
                                initial_date=timezone.now(), 
                                end_date=None,
                                obsolete=False)
    
    return FlatterUser.objects.get(username=username)
  
  def resolve_get_filtered_users_by_tag_and_review(self,info,username,tag=None,owner=False):

    username = username.strip()
    
    if not FlatterUser.objects.filter(username=username).exists():
      raise ValueError("User does not exist")

    q = Q()

    if tag:    
      q &= Q(tags__icontains = tag)
      
    if owner is not None and owner:
      q &= Q(roles__in = [Role.objects.get(role="OWNER").pk])
    elif owner is not None:
      q &= Q(roles__in = [Role.objects.get(role="RENTER").pk])
    
    return FlatterUser.objects.filter(q).exclude(username__exact = username)
  
  def resolve_get_roles(self, info):
    return Role.objects.all()
  
  def resolve_get_plans(self, info):
    return Plan.objects.all()

  def resolve_get_contract_by_username(self, info, username):
    user = FlatterUser.objects.get(username=username)
    return Contract.objects.filter(user=user, obsolete=False).first()