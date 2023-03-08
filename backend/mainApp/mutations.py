from .models import Tag, Property
import graphene, graphql_jwt
from authentication.models import FlatterUser

from .models import Property
from .types import PropertyType
from django.utils.translation import gettext_lazy as _



class AddTagToProperty(graphene.Mutation):
  
  class Input:
    id = graphene.Int(required=True)
    tag = graphene.String(required=True)

  property = graphene.Field(PropertyType)
  
  @staticmethod
  def mutate(root, info, **kwargs):
    id = kwargs.get('id', '')
    tag = kwargs.get('tag', '').strip()
    
    selected_property = Property.objects.get(id=id)
    tag = Tag.objects.get_or_create(name=tag, entity='P')
    
    selected_property_tags = selected_property.tags.all()
    if len(selected_property_tags)<8:
      selected_property.tags.add(tag[0])
    else:
      raise ValueError(_("Este inmueble ya tiene el máximo número de tags posibles"))
    
    return AddTagToProperty(property=selected_property)

class CreatePropertyMutation(graphene.Mutation):

  class Input:
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    bedrooms_number = graphene.Int(required=True)
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
    
    if not title or len(title) < 4 or len(title) > 25:
      raise ValueError(_("El título debe tener entre 4 y 25 caracteres"))
    
    if not description or len(description) > 256:
      raise ValueError(_("La descripción no puede tener más de 256 caracteres"))
    
    if not bedrooms_number or bedrooms_number < 1:
      raise ValueError(_("El número de dormitorios no debe ser inferior a 1"))
    
    if not bathrooms_number or bathrooms_number < 1:
      raise ValueError(_("El número de cuartos de baño no debe ser inferior a 1"))
    
    if not price or price < 1:
      raise ValueError(_("El precio debe tener un valor positivo"))
    
    if not location or len(location) < 4 or len(location) > 16:
      raise ValueError(_("La localización debe tener entre 4 y 16 caracteres"))
    
    if not province or len(province) > 15:
      raise ValueError(_("La provincia debe tener máximo 15 caracteres"))
    
    if not dimensions or dimensions < 1:
      raise ValueError(_("Las dimensiones deben poseer un valor positivo"))
    
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


class DeleteInmuebleMutation(graphene.Mutation):
  class Input:
    property_id = graphene.Int(required=True)
  
  property = graphene.Field(PropertyType)
  
  @staticmethod
  def mutate(root, info, property_id):
    property = Property.objects.get(pk=property_id)
    property.delete()
    return DeleteInmuebleMutation(property=property)

  
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
        title = kwargs.get('title', '').strip() if 'title' in kwargs else None
        description = kwargs.get('description', '').strip() if 'description' in kwargs else None
        bedrooms_number = kwargs.get("bedrooms_number", "") if 'bedrooms_number' in kwargs else None
        bathrooms_number = kwargs.get("bathrooms_number", "") if 'bathrooms_number' in kwargs else None
        price = kwargs.get("price", "") if 'price' in kwargs else None
        location = kwargs.get("location", "").strip() if 'location' in kwargs else None
        province = kwargs.get("province", "").strip() if 'province' in kwargs else None
        dimensions = kwargs.get("dimensions", "") if 'dimensions' in kwargs else None
        propertyId = kwargs.get("propertyId", "") if 'propertyId' in kwargs else None

        #ToDo FALTARÍA SABER QUIÉN ESTA INICIADA LA SESIÓN (SI ES OWNER O ADMIN)
      
        if  title and (len(title) < 4 or len(title) > 25):
          raise ValueError(_("El título debe tener entre 4 y 25 caracteres"))
        
        if description and len(description) > 256:
          raise ValueError(_("La descripción no puede tener más de 256 caracteres"))
        
        if bedrooms_number and bedrooms_number < 1:
          raise ValueError(_("El número de dormitorios no debe ser inferior a 1"))
        
        if bathrooms_number and bathrooms_number < 1:
          raise ValueError(_("El número de cuartos de baño no debe ser inferior a 1"))
        
        if price and price < 1:
          raise ValueError(_("El precio debe tener un valor positivo"))
        
        if location and (len(location) < 4 or len(location) > 16):
          raise ValueError(_("La localización debe tener entre 4 y 16 caracteres"))
        
        if province and len(province) > 16:
          raise ValueError(_("La provincia debe tener máximo 16 caracteres"))
        
        if dimensions and dimensions < 1:
          raise ValueError(_("Las dimensiones deben poseer un valor positivo"))
        
        property_edit = Property.objects.get(pk=propertyId)

        if title:
          property_edit.title = title
        
        if description:
          property_edit.description = description

        if bedrooms_number:
          property_edit.bedrooms_number = bedrooms_number  
        
        if bathrooms_number:
          property_edit.bathrooms_number = bathrooms_number

        if price:
          property_edit.price = price

        if location:
          property_edit.location = location

        if province:
          property_edit.province = province

        if dimensions:  
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
  add_tag_to_property = AddTagToProperty.Field()


# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_property(title):
    return Property.objects.filter(title=title).exists()





  


