import graphene
from .types import FlatterUserType, FlatterUserPageType, RoleType, PlanType, ContractType, get_user_rating
from .models import Contract, FlatterUser, Plan, Role
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class AuthenticationQuery(object):
  
  get_user_by_username = graphene.Field(FlatterUserType, username=graphene.String())
  get_roles = graphene.List(RoleType)
  get_filtered_users_by_tag_and_review = graphene.Field(FlatterUserPageType, username=graphene.String(required=True), tag = graphene.String(), owner = graphene.Boolean(), min_rating = graphene.Int(), max_rating = graphene.Int(), page_size = graphene.Int(), page_number = graphene.Int())
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
  
  def resolve_get_filtered_users_by_tag_and_review(self,info, page_number=1, page_size=5, username=None, tag=None, owner=None, min_rating=0, max_rating=5):

    username = username.strip()
    
    if min_rating and max_rating and max_rating < min_rating:
      raise ValueError(_("El precio máximo introducido es menor al mínimo"))
    
    if not FlatterUser.objects.filter(username=username).exists():
      raise ValueError("User does not exist")

    q = Q()

    if tag:    
      q &= Q(tags__name__icontains = tag)
     
    if owner is not None and owner:
      q &= Q(roles__in = [Role.objects.get(role="OWNER").pk])
    elif owner is not None:
      q &= Q(roles__in = [Role.objects.get(role="RENTER").pk])
      
    users = FlatterUser.objects.filter(q).exclude(username__exact = username)
    final_users = []
    
    for user in users:
      user_average_rating = get_user_rating(user.username)
      if min_rating and max_rating:
        if user_average_rating >= min_rating and user_average_rating <= max_rating:
          final_users.append(user)
      elif min_rating and user_average_rating >= min_rating:
          final_users.append(user)
      elif max_rating and user_average_rating <= max_rating:
          final_users.append(user)
         
    total_count = len(final_users)
    
    min_pagination_index = page_size * (page_number - 1)
    max_pagination_index = page_size * page_number

    if len(final_users) == 0:
        raise ValueError(_("No se han encontrado usuarios con los filtros introducidos"))
    elif len(final_users) < max_pagination_index and len(final_users) > min_pagination_index:
        final_users = final_users[min_pagination_index:]
    elif len(final_users) < max_pagination_index:
        
        new_min_pagination_index = len(final_users)-page_size
        
        if new_min_pagination_index <= 0:
            new_min_pagination_index = 0
        
        final_users = final_users[new_min_pagination_index:]
    else:
        final_users = final_users[min_pagination_index:max_pagination_index]
    
    return FlatterUserPageType(
            users = final_users,
            total_count = total_count,)
      
     
  
  def resolve_get_roles(self, info):
    return Role.objects.all()
  
  def resolve_get_plans(self, info):
    return Plan.objects.filter(end_date=None).order_by('flatter_coins')

  def resolve_get_contract_by_username(self, info, username):
    user = FlatterUser.objects.get(username=username)
    return Contract.objects.filter(user=user, obsolete=False).first()