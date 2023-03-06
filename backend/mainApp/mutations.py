<<<<<<< Updated upstream
import graphene, graphql_jwt

from authentication.models import FlatterUser

from .models import Property
from .types import PropertyType
from django.utils.translation import gettext_lazy as _


class CreatePropertyMutation(graphene.Mutation):

  class Input:
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    bedrooms_number = graphene.Int(required=False)
    bathrooms_number = graphene.Int(required=True)
    price = graphene.Float(required=True)
    location = graphene.String(required=True)
    province = graphene.String(required=True)
    dimensions = graphene.Int(required=True)
    ownerId = graphene.Int(required=True)

  property = graphene.Field(PropertyType)

  @staticmethod
  def mutate(root, info, **kwargs):
    title = kwargs.get('title', '').strip()
    description = kwargs.get('description', '').strip()
    bedrooms_number = kwargs.get("bedrooms_number", "")
    bathrooms_number = kwargs.get("bathrooms_number", "")
    price = kwargs.get("price", "")
    location = kwargs.get("location", "").strip()
    province = kwargs.get("province", "").strip()
    dimensions = kwargs.get("dimensions", "")
    ownerId = kwargs.get("ownerId", "")
    
    if not title or len(title) < 6 or len(title) > 25:
      raise ValueError(_("El título debe tener entre 6 y 24 caracteres"))
    
    if not description or len(description) < 9 or len(description) > 256:
      raise ValueError(_("La descripción debe tener al menos 10 caracteres y 255 caracteres"))
    
    if not bedrooms_number or bedrooms_number > 8:
      raise ValueError(_("El número de dormitorios no debe ser mayor a 7"))
    
    if not bathrooms_number or bathrooms_number > 4:
      raise ValueError(_("El número de cuartos de baño no debe ser mayor a 3"))
    
    if not price or price < 1 or price > 1000:
      raise ValueError(_("El precio debe estar entre 1 y 999€"))
    
    if not location or len(location) < 9 or len(location) > 16:
      raise ValueError(_("La localización debe tener entre 6 y 15 caracteres"))
    
    if len(province) and len(province) > 10:
      raise ValueError(_("La provincia debe tener máximo 10 caracteres"))
    
    if dimensions and dimensions > 200:
      raise ValueError(_("Las dimensiones deben ser máximo de 200 metros cuadrados"))
    
    if _exists_property(title):
      raise ValueError(_("Este nombre de usuario ya está registrado. Por favor, elige otro."))
    
    owner = FlatterUser.objects.get(pk=ownerId)

    #if owner.roles.contains(RoleType.owner) == False:
    #raise ValueError(_("El usuario debe ser propietario."))

    obj = Property.objects.create(
      title=title, 
      description=description, 
      bedrooms_number=bedrooms_number, 
      bathrooms_number=bathrooms_number, 
      price=price, 
      location=location, 
      province=province,
      dimensions=dimensions,
      owner=owner
    )
        
    return CreatePropertyMutation(property=obj)
=======
import graphene, graphql_jwt, json
from django.utils.translation import gettext_lazy as _

from .types import PropertyType
from .models import Property


>>>>>>> Stashed changes


class DeleteInmuebleMutation(graphene.Mutation):
  class Input:
    property_id = graphene.Int(required=True)
  
  property = graphene.Field(PropertyType)
  
  @staticmethod
  def mutate(root, info, property_id):
    property = Property.objects.get(pk=property_id)
    property.delete()
    return DeleteInmuebleMutation(property=property)
<<<<<<< Updated upstream
  
class UpdatePropertyMutation(graphene.Mutation):
      class Input:
          propertyId = graphene.Int(required=True)
          title = graphene.String(required=False)
          description = graphene.String(required=False)
          bedrooms_number = graphene.Int(required=False)
          bathrooms_number = graphene.Int(required=False)
          price = graphene.Float(required=False)
          location = graphene.String(required=False)
          province = graphene.String(required=False)
          dimensions = graphene.Int(required=False)

      property = graphene.Field(PropertyType)

      @staticmethod
      def mutate(root, info, **kwargs):
        title = kwargs.get('title', '').strip()
        description = kwargs.get('description', '').strip()
        bedrooms_number = kwargs.get("bedrooms_number", "")
        bathrooms_number = kwargs.get("bathrooms_number", "")
        price = kwargs.get("price", "")
        location = kwargs.get("location", "").strip()
        province = kwargs.get("province", "").strip()
        dimensions = kwargs.get("dimensions", "")
        propertyId = kwargs.get("propertyId", "")

        #ToDo FALTARÍA SABER QUIÉN ESTA INICIADA LA SESIÓN (SI ES OWNER O ADMIN)
      
        if not title or len(title) < 6 or len(title) > 25:
          raise ValueError(_("El título debe tener entre 6 y 24 caracteres"))
        
        if not description or len(description) < 9 or len(description) > 256:
          raise ValueError(_("La descripción debe tener al menos 10 caracteres y 255 caracteres"))
        
        if not bedrooms_number or bedrooms_number > 8:
          raise ValueError(_("El número de dormitorios no debe ser mayor a 7"))
        
        if not bathrooms_number or bathrooms_number > 4:
          raise ValueError(_("El número de cuartos de baño no debe ser mayor a 3"))
        
        if not price or price < 1 or price > 1000:
          raise ValueError(_("El precio debe estar entre 1 y 999€"))
        
        if not location or len(location) < 9 or len(location) > 16:
          raise ValueError(_("La localización debe tener entre 6 y 15 caracteres"))
        
        if len(province) and len(province) > 10:
          raise ValueError(_("La provincia debe tener máximo 10 caracteres"))
        
        if dimensions and dimensions > 200:
          raise ValueError(_("Las dimensiones deben ser máximo de 200 metros cuadrados"))
        
        property_edit = Property.objects.get(pk=propertyId)

        property_edit.title = title
        property_edit.description = description
        property_edit.bedrooms_number = bedrooms_number
        property_edit.bathrooms_number = bathrooms_number
        property_edit.price = price
        property_edit.location = location
        property_edit.province = province
        property_edit.dimensions = dimensions

        property_edit.save()

        # Devolver la propiedad actualizada
        return UpdatePropertyMutation(property=property_edit)


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    property = graphene.Field(PropertyType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(property=info.context.property)

class PropertyMutation(graphene.ObjectType):
  token_auth = ObtainJSONWebToken.Field()
  verify_token = graphql_jwt.Verify.Field()
  refresh_token = graphql_jwt.Refresh.Field()
  create_property = CreatePropertyMutation.Field()
  update_property = UpdatePropertyMutation.Field()
  delete_property = DeleteInmuebleMutation.Field()

# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_property(title):
    return Property.objects.filter(title=title).exists()
=======



class MainAppMutation(graphene.ObjectType):
  delete_property = DeleteInmuebleMutation.Field()
  
  
>>>>>>> Stashed changes
