import graphene, graphql_jwt, json
from authentication.models import FlatterUser
from .types import FlatterUserType
from django.utils.translation import gettext_lazy as _

class CreateUserMutation(graphene.Mutation):

  class Input:
    username = graphene.String(required=True)
    password = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String(required=False)

  user = graphene.Field(FlatterUserType)

  @staticmethod
  def mutate(root, info, **kwargs):
    username = kwargs.get('username', '').strip()
    password = kwargs.get("password", '').strip()
    first_name = kwargs.get("first_name", "").strip()
    last_name = kwargs.get("last_name", "").strip()
    email = kwargs.get("email", "").strip()
    phone = kwargs.get("phone", "").strip()
    
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

    obj = FlatterUser.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=email, phone_number=phone, profile_picture="/assets/user-images/default.png")
        
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
  
# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_user(username):
    return FlatterUser.objects.filter(username=username).exists()

def _exists_email(email):
    return FlatterUser.objects.filter(email=email).exists()