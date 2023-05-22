import datetime
import graphene, graphql_jwt
from .models import FlatterUser, Plan, Role, Contract, UserPreferences, Promotion, ReferralProgram
from social.models import Group
from mainApp.models import Property, Application, Petition, Review
from .types import ContractType, FlatterUserType, PlanType, PromotionType
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import datetime, timedelta
from social.mutations import check_token

class ChangeContract(graphene.Mutation):
  class Input:
    username = graphene.String(required=True)
    plan_type = graphene.String(required=True)
    token = graphene.String(required=True)
    num_days_selected = graphene.Int(required=True)
    
  contract = graphene.Field(ContractType)
  user = graphene.Field(FlatterUserType)

  @staticmethod
  def mutate(self, info, **kwargs):
    
    username = kwargs.get('username', '').strip()
    token = kwargs.get("token", "").strip()
    plan_type = kwargs.get("plan_type", '').strip()
    num_days_selected = kwargs.get("num_days_selected", None)
    
    try:
      user = FlatterUser.objects.get(username=username)
      check_token(token, user)
    except FlatterUser.DoesNotExist:
      raise FlatterUser.DoesNotExist("El usuario no existe")
    
    current_contract = Contract.objects.filter(user=user, obsolete=False).first()
    current_plan_type = current_contract.plan.plan_type

    try:
      new_plan = Plan.objects.get(plan_type=plan_type, end_date=None)
    except Plan.DoesNotExist:
      raise Plan.DoesNotExist("El plan seleccionado no existe")
        
    if user.flatter_coins < new_plan.flatter_coins * num_days_selected:
      raise ValueError('No tiene suficientes Flatter Coins en su cuenta')

    if plan_type == current_plan_type:
      raise ValueError("Este plan es su plan actual")
    
    choices_values = [x[0] for x in Contract.choices_days]
    if num_days_selected not in choices_values:
      raise ValueError("El número de días seleccionado no es válido")

    current_contract.end_date = datetime.now()
    current_contract.obsolete=True
    current_contract.save()

    if plan_type == 'B':
      new_contract_end_date = None
      new_contract_choices = None
    else:
      new_contract_end_date = timezone.now() + timedelta(days=num_days_selected)
      new_contract_choices = num_days_selected
      
    
    new_contract = Contract.objects.create(
      initial_date=timezone.now(),
      end_date = new_contract_end_date,
      choices = new_contract_choices,
      plan=new_plan,
      user=user,
    )
    
    if num_days_selected >= 7 and num_days_selected < 30:
      user.flatter_coins -= new_plan.flatter_coins * num_days_selected * 0.9
    elif num_days_selected >= 30:
      user.flatter_coins -= new_plan.flatter_coins * num_days_selected * 0.8
    else:
      user.flatter_coins -= new_plan.flatter_coins * num_days_selected
    user.save()
      
    return ChangeContract(contract=new_contract)
  
class EditPlan(graphene.Mutation):
  class Input:
    username = graphene.String(required=True)
    token = graphene.String(required=True)
    plan_type = graphene.String(required=True)
    flatter_coins = graphene.Int(required=False)
    visits_number = graphene.Int(required=False)
    tags_number = graphene.Int(required=False)
    advertisement = graphene.Boolean(required=False)
    chat_creation = graphene.Boolean(required=False)
    standard_support = graphene.Boolean(required=False)
    premium_support = graphene.Boolean(required=False)
    view_self_profile_opinions = graphene.Boolean(required=False)

  plan = graphene.Field(PlanType)

  @staticmethod
  #@login_required
  def mutate(self, info, **kwargs):
    
    username = kwargs.get('username', '').strip()
    token = kwargs.get("token", "").strip()
    plan_type = kwargs.get("plan_type", '').strip()
    flatter_coins = kwargs.get("flatter_coins", None)
    visits_number = kwargs.get("visits_number", None)
    tags_number = kwargs.get("tags_number", None)
    advertisement = kwargs.get("advertisement", None)
    chat_creation = kwargs.get("chat_creation", None)
    standard_support = kwargs.get("standard_support", None)
    premium_support = kwargs.get("premium_support", None)
    view_self_profile_opinions = kwargs.get("view_self_profile_opinions", None)
    
    user = FlatterUser.objects.get(username=username) #Hará falta para los permisos de edición

    check_token(token, user)

    current_plan = Plan.objects.filter(plan_type=plan_type, end_date=None).first()
    contracts = Contract.objects.filter(plan=current_plan)

    #Descomentar y editar para dar permisos de usuario:
    '''if not user.is_superuser and not user.is_staff:
      raise GraphQLError('No tienes permisos para realizar esta acción.')'''
    
    choices_values = [x[0] for x in Plan.choices_type]
    if plan_type not in choices_values:
      raise ValueError("El plan seleccionado no existe")

    if flatter_coins and flatter_coins < 0:
      raise ValueError("No puede introducir una cantidad negativa")
    
    if Plan.objects.filter(flatter_coins=flatter_coins if flatter_coins is not None else current_plan.flatter_coins,
                            visits_number=visits_number if visits_number is not None else current_plan.visits_number,
                            tags_number=tags_number if tags_number is not None else current_plan.tags_number,
                            advertisement=advertisement if advertisement is not None else current_plan.advertisement,
                            chat_creation=chat_creation if chat_creation is not None else current_plan.chat_creation,
                            standard_support=standard_support if standard_support is not None else current_plan.standard_support,
                            premium_support=premium_support if premium_support is not None else current_plan.premium_support,
                            view_self_profile_opinions=view_self_profile_opinions if view_self_profile_opinions is not None else current_plan.view_self_profile_opinions,
                            plan_type=plan_type,
                            end_date=None).exists():
      
      raise ValueError("Ya existe un plan con estos valores")

    new_plan = Plan.objects.create(
      flatter_coins=flatter_coins if flatter_coins is not None else current_plan.flatter_coins,
      visits_number=visits_number if visits_number is not None else current_plan.visits_number,
      tags_number=tags_number if tags_number is not None else current_plan.tags_number,
      advertisement=advertisement if advertisement is not None else current_plan.advertisement,
      chat_creation=chat_creation if chat_creation is not None else current_plan.chat_creation,
      standard_support=standard_support if standard_support is not None else current_plan.standard_support,
      premium_support=premium_support if premium_support is not None else current_plan.premium_support,
      view_self_profile_opinions=view_self_profile_opinions if view_self_profile_opinions is not None else current_plan.view_self_profile_opinions,
      plan_type=plan_type
    )

    if current_plan:
      current_plan.end_date = timezone.now()
      current_plan.save()

      for contract in contracts:
        if contract.obsolete == False:
          contract.plan = new_plan
          contract.save()

    return EditPlan(plan=new_plan)
    

class CreateUserMutation(graphene.Mutation):

  class Input:
    username = graphene.String(required=True)
    password = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    genre = graphene.String(required=True)
    roles = graphene.String(required=True)
    code = graphene.String(required=False)

  user = graphene.Field(FlatterUserType)
  contract = graphene.Field(ContractType)

  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    password = kwargs.get("password", '').strip()
    first_name = kwargs.get("first_name", "").strip()
    last_name = kwargs.get("last_name", "").strip()
    email = kwargs.get("email", "").strip()
    genre = kwargs.get("genre", "").strip()
    roles = kwargs.get("roles", [])
    code = kwargs.get("code", '').strip()
      
    if not code:
      code = None
    
    if not username or len(username) < 6 or len(username) > 25:
      raise ValueError(_("El usuario debe tener entre 6 y 24 caracteres"))
    
    if not username or len(password) < 6:
      raise ValueError(_("La contraseña debe tener al menos 6 caracteres"))
    
    if not first_name or len(first_name) < 3 or len(first_name) >= 50:
      raise ValueError(_("El nombre debe tener entre 3 y 50 caracteres"))
    
    if not last_name or len(last_name) < 3 or len(last_name) >= 50:
      raise ValueError(_("Los apellidos deben tener entre 3 y 50 caracteres"))
    
    if not email or ("@" not in email) or ("." not in email):
      raise ValueError(_("El email no es válido"))
    
    if _exists_user(username):
      raise ValueError(_("Este nombre de usuario ya está registrado. Por favor, elige otro."))
    
    if _exists_email(email):
      raise ValueError(_("Este email ya está registrado. Por favor, elige otro."))
    
    if not valid_genre(genre):
      raise ValueError(_("El género no es válido"))
    
    if not valid_roles(roles):
      raise ValueError(_("Los roles no son válidos"))

    genre = parse_genre(genre)
    roles = parse_roles(roles)
    
    coins = 0
    
    obj = FlatterUser.objects.create_user(username=username, 
                                          password=password, 
                                          first_name=first_name, 
                                          last_name=last_name, 
                                          email=email, 
                                          profile_picture="users/images/default.jpg",
                                          flatter_coins=coins,
                                          genre=genre,
                                          )
    
    if code:
      today = timezone.now()
      if not ReferralProgram.objects.filter(code=code, is_disabled=False, end_date__gte=today, times_to_be_used__gte=1).exists():
        try:
          promotion = Promotion.objects.get(code=code, is_welcome_promotion=True, is_disabled=False, max_date__gte=today)
          if not promotion.can_be_used_always and promotion.times_to_be_used <= 0:
            raise ValueError(_("El código de promoción no es válido"))
          coins = promotion.quantity
          if promotion.times_to_be_used is not None:
            promotion.times_to_be_used -= 1
            if promotion.times_to_be_used == 0:
              promotion.is_disabled = True
            promotion.save()
        except Promotion.DoesNotExist:
          raise ValueError(_("El código de promoción no es válido"))
      else:
        promotion = ReferralProgram.objects.get(code=code, is_disabled=False, end_date__gte=today, times_to_be_used__gte=1)
        coins = promotion.user_referred_quantity
        user_referral = FlatterUser.objects.get(pk=promotion.user.pk)
        user_referral.flatter_coins += promotion.user_quantity
        user_referral.save()
        promotion.users_referred.add(obj)
        promotion.times_to_be_used -= 1
        if promotion.times_to_be_used == 0:
          promotion.is_disabled = True
        promotion.save()
      
      obj.flatter_coins += coins
      obj.save()
        
    obj.roles.add(*roles)
    
    # Create user contract
    
    new_user_contract = Contract.objects.create(
      initial_date=datetime.now(),
      end_date = None,
      choices = None,
      plan=Plan.objects.get(plan_type=Plan.choices_type[0][0], end_date=None),
      user=obj,
    )
        
    return CreateUserMutation(user=obj, contract=new_user_contract)

class EditUserFlatterCoins(graphene.Mutation):
  
  class Input:
    username = graphene.String(required=True)
    token = graphene.String(required=False)
    flatter_coins = graphene.Int(required=True)
    
  user = graphene.Field(FlatterUserType)
  
  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    token = kwargs.get('token', '').strip()
    flatter_coins = kwargs.get('flatter_coins', 0)
    
    selected_user = FlatterUser.objects.get(username=username)

    check_token(token, selected_user)

    selected_user.flatter_coins = selected_user.flatter_coins + flatter_coins
    
    selected_user.save()
    
    return EditUserFlatterCoins(user=selected_user)
  
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(FlatterUserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)
      
class DeleteUser(graphene.Mutation):
  class Input:
    username = graphene.String(required=True)
    token = graphene.String(required=True)
    
  user = graphene.Field(FlatterUserType)
  
  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    token = kwargs.get('token', '').strip()
    
    if not username:
      raise ValueError(_("El nombre de usuario no puede estar vacío"))
    
    if not token:
      raise ValueError(_("El token no puede estar vacío"))
    
    try:  
      selected_user = FlatterUser.objects.get(username=username)
    except FlatterUser.DoesNotExist:
      raise ValueError(_("El usuario no existe"))

    check_token(token, selected_user)
    
    Property.objects.filter(owner=selected_user).delete()
    for property in Property.objects.filter(flatmates=selected_user):
      property.flatmates.remove(selected_user)
      property.save()
    Review.objects.filter(valued_user=selected_user).delete()
    Review.objects.filter(evaluator_user=selected_user).delete()
    Application.objects.filter(user=selected_user).delete()
    Petition.objects.filter(requester=selected_user).delete()
    Group.objects.filter(users=selected_user).delete()
    UserPreferences.objects.filter(user=selected_user).delete()
    
    selected_user.is_active = False
    selected_user.last_login = datetime.now()
    selected_user.save()
    
    return DeleteUser(user=selected_user)

class RedeemPromotion(graphene.Mutation):
  class Input:
    username = graphene.String(required=True)
    token = graphene.String(required=True)
    code = graphene.String(required=True)
    
  promotion = graphene.Field(PromotionType)
  
  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    token = kwargs.get('token', '').strip()
    code = kwargs.get('code', '').strip()
    
    if not username:
      raise ValueError(_("El nombre de usuario no puede estar vacío"))
    
    if not token:
      raise ValueError(_("El token no puede estar vacío"))
    
    if not code:
      raise ValueError(_("El código no puede estar vacío"))
    
    try:
      user = FlatterUser.objects.get(username=username)
    except FlatterUser.DoesNotExist:
      raise ValueError(_("El usuario no existe"))
    
    check_token(token, user)
    
    try:
      promotion = Promotion.objects.get(code=code, is_welcome_promotion=False)
    except Promotion.DoesNotExist:
      raise ValueError(_("El código introducido no existe"))
    
    if promotion.is_disabled:
      raise ValueError(_("El código ya no está activo"))
    
    if promotion.max_date < datetime.now():
      raise ValueError(_("El código ya no está activo"))
    
    if promotion.users_used.filter(username=username).exists():
      raise ValueError(_("Ya has canjeado el código"))
    
    if not promotion.times_to_be_used:
      raise ValueError(_("El código ya no está activo"))
    
    if not promotion.is_discount:
      user.flatter_coins += promotion.quantity
      user.save()
    
    if not promotion.can_be_used_always and promotion.times_to_be_used is None:
      promotion.users_used.add(user)
      if promotion.times_to_be_used:
        promotion.times_to_be_used -= 1
        if promotion.times_to_be_used == 0:
          promotion.is_disabled = True
      promotion.save()
    
    return RedeemPromotion(promotion=promotion) 

class AuthenticationMutation(graphene.ObjectType):
  token_auth = ObtainJSONWebToken.Field()
  verify_token = graphql_jwt.Verify.Field()
  refresh_token = graphql_jwt.Refresh.Field()
  create_user = CreateUserMutation.Field()
  change_contract = ChangeContract.Field()
  edit_plan = EditPlan.Field()
  edit_user_flatter_coins = EditUserFlatterCoins.Field()
  delete_user = DeleteUser.Field()
  redeem_promotion = RedeemPromotion.Field()

# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_user(username):
    return FlatterUser.objects.filter(username=username).exists()

def _exists_email(email):
    return FlatterUser.objects.filter(email=email).exists()
  
def valid_genre(genre):
    return genre in ['Hombre', 'Mujer', 'No Binario', 'Otro']
  
def valid_roles(roles):

  for role in roles:
    if role not in ['Propietario', 'Inquilino', 'Ambos']:
      return True
    
  return False
  
def parse_genre(genre):
  
  if genre == 'Hombre':
    return 'H'
  elif genre == 'Mujer':
    return 'M'
  elif genre == 'No Binario':
    return 'NB'
  elif genre == 'Otro':
    return 'O'
  else:
    return 'X'
  
def parse_roles(roles):
  
  if roles == 'Propietario':
    return [Role.objects.get(role='OWNER')]
  elif roles == 'Inquilino':
    return [Role.objects.get(role='RENTER')]
  else:
    return list(Role.objects.all())
