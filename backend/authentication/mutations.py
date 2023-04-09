import datetime
import graphene, graphql_jwt, json, base64, os
from graphql import GraphQLError
from .models import FlatterUser, Plan, Role, Contract
from .types import ContractType, FlatterUserType, PlanType
from django.utils.translation import gettext_lazy as _
from django.core.files.storage import default_storage
from datetime import datetime, timedelta
from graphql_jwt.decorators import login_required

class ChangeContract(graphene.Mutation):
  class Input:
    userName = graphene.String(required=True)
    planType = graphene.String(required=True)
    token = graphene.String(required=True)
    numDaysSelected = graphene.Int(required=True)
  contract = graphene.Field(ContractType)
  user = graphene.Field(FlatterUserType)

  @staticmethod
  #@login_required
  def mutate(self, info, userName, planType, token, numDaysSelected):
    user = FlatterUser.objects.get(username=userName)
    current_contract = Contract.objects.filter(user=user, obsolete=False).first()
    current_plan_type = current_contract.plan.plan_type

    try:
      new_plan = Plan.objects.get(plan_type=planType)

    except Plan.DoesNotExist:
      raise Exception("El plan seleccionado no existe")
        
    if user.flatter_coins < new_plan.flatter_coins:
      raise Exception('No tiene suficientes Flatter Coins en su cuenta')

    if planType == current_plan_type:
      raise Exception("Este plan es su plan actual")
    
    choices_values = [x[0] for x in Contract.choices_days]
    if numDaysSelected not in choices_values:
      raise Exception("El número de días seleccionado no es válido")

    current_contract.end_date = datetime.now()
    current_contract.obsolete=True
    current_contract.save()

    last_contract = Contract.objects.latest('id')
    new_contract_id = last_contract.pk + 1 if last_contract else 1

    new_contract = Contract.objects.create(
      id=new_contract_id,
      initial_date=datetime.now(),
      end_date = datetime.now() + timedelta(days=numDaysSelected),
      choices = numDaysSelected,
      plan=new_plan,
      user=user,
    )
    user.flatter_coins -= new_plan.flatter_coins
    user.save()
      
    return ChangeContract(contract=new_contract)
  
class EditPlan(graphene.Mutation):
  class Input:
    userName = graphene.String(required=True)
    token = graphene.String(required=True)
    planType = graphene.String(required=True)
    flatterCoins = graphene.Int(required=False)
    visitsNumber = graphene.Int(required=False)
    tagsNumber = graphene.Int(required=False)
    advertisement = graphene.Boolean(required=False)
    chatCreation = graphene.Boolean(required=False)
    premiumSupport = graphene.Boolean(required=False)
    viewOpinionProfiles = graphene.Boolean(required=False)

  plan = graphene.Field(PlanType)
  user = graphene.Field(FlatterUserType)

  @staticmethod
  #@login_required
  def mutate(self, info, userName, planType, token, flatterCoins, visitsNumber, tagsNumber, advertisement, chatCreation, premiumSupport, viewOpinionProfiles):
    user = FlatterUser.objects.get(username=userName) #Hará falta para los permisos de edición
    current_plan = Plan.objects.filter(plan_type=planType, obsolete=False).first()
    contracts = Contract.objects.filter(plan=current_plan)

    #Descomentar y editar para dar permisos de usuario:
    '''if not user.is_superuser and not user.is_staff:
      raise GraphQLError('No tienes permisos para realizar esta acción.')'''
    
    choices_values = [x[0] for x in Plan.choices_type]
    if planType not in choices_values:
      raise Exception("El plan seleccionado no existe")

    if flatterCoins < 0:
      raise Exception("No puede introducir una cantidad negativa")
    
    if Plan.objects.filter(flatter_coins=flatterCoins,
                        visits_number=visitsNumber,
                        tags_number=tagsNumber,
                        advertisement=advertisement,
                        chat_creation=chatCreation,
                        premium_support=premiumSupport,
                        view_opinion_profiles=viewOpinionProfiles,
                        plan_type=planType).exists():
      raise Exception("Ya existe un plan con estos valores")

    last_plan = Plan.objects.latest('id')
    new_plan_id = last_plan.pk + 1 if last_plan else 1

    new_plan = Plan.objects.create(
      id=new_plan_id,
      flatter_coins=flatterCoins,
      visits_number=visitsNumber,
      tags_number=tagsNumber,
      advertisement=advertisement,
      chat_creation=chatCreation,
      premium_support=premiumSupport,
      view_opinion_profiles=viewOpinionProfiles,
      plan_type=planType
    )

    if current_plan:
      current_plan.obsolete = True
      current_plan.end_date = datetime.now()
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
    phone = graphene.String(required=False)
    genre = graphene.String(required=True)
    roles = graphene.String(required=True)

  user = graphene.Field(FlatterUserType)

  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    password = kwargs.get("password", '').strip()
    first_name = kwargs.get("first_name", "").strip()
    last_name = kwargs.get("last_name", "").strip()
    email = kwargs.get("email", "").strip()
    phone = kwargs.get("phone", "").strip()
    genre = kwargs.get("genre", "").strip()
    roles = kwargs.get("roles", [])
    
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
    
    if phone and len(phone) < 9:
      raise ValueError(_("El número de teléfono no es válido"))
    
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

    obj = FlatterUser.objects.create_user(username=username, 
                                          password=password, 
                                          first_name=first_name, 
                                          last_name=last_name, 
                                          email=email, 
                                          phone_number=phone, 
                                          profile_picture="users/images/default.jpg",
                                          flatter_coins=0,
                                          genre=genre,
                                          )
        
    obj.roles.add(*roles)
        
    return CreateUserMutation(user=obj)

class DeleteUserMutation(graphene.Mutation):

  class Input:
    username = graphene.String(required=True)

  user = graphene.Field(FlatterUserType)

  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    
    selected_user = FlatterUser.objects.get(username=username)

    selected_user.delete()
    
    return DeleteUserMutation(user=selected_user)
  
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(FlatterUserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)



class AuthenticationMutation(graphene.ObjectType):
  token_auth = ObtainJSONWebToken.Field()
  verify_token = graphql_jwt.Verify.Field()
  refresh_token = graphql_jwt.Refresh.Field()
  create_user = CreateUserMutation.Field()
  delete_user = DeleteUserMutation.Field()
  change_contract = ChangeContract.Field()
  edit_plan = EditPlan.Field()

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
