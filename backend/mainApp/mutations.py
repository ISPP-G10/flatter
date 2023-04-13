from .models import Tag, Property, Province, Municipality, Petition
from graphql import GraphQLError
from authentication.types import FlatterUserType
from authentication.models import FlatterUser, Role
from mainApp.models import Image
from .models import Property
from .types import PropertyType, PetitionType
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import base64, random, string, os, graphene, jwt
from datetime import datetime
from social.mutations import check_token


class DeleteImageFromProperty(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        image = graphene.String(required=True)
        # TODO: comprobar usuario
        
    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(self, info, **kwargs):

        property_id = kwargs.get('property_id', '').strip()
        image = kwargs.get('image', '')

        os.remove(f"media/{image}")

        property = Property.objects.get(pk=property_id)
        user = property.owner

        image = Image.objects.get(image=image)
        property.images.remove(image)

        return DeleteImageFromProperty(property=property)


class AddTagToProperty(graphene.Mutation):

    class Input:
        id = graphene.Int(required=True)
        tag = graphene.String(required=True)
        # TODO: comprobar usuario

    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(root, info, **kwargs):
        id = kwargs.get('id', '')
        tag = kwargs.get('tag', '').strip()

        try:
            selected_property = Property.objects.get(id=id)
        except Property.DoesNotExist:
            raise ValueError(_("El inmueble seleccionado no existe"))
        
        tag = Tag.objects.get_or_create(name=tag, entity='P')

        selected_property_tags = selected_property.tags.all()
        if len(selected_property_tags) < 8:
            selected_property.tags.add(tag[0])
        else:
            raise ValueError(
                _("Este inmueble ya tiene el máximo número de tags posibles"))

        return AddTagToProperty(property=selected_property)


class CreatePropertyMutation(graphene.Mutation):

    class Input:
        title = graphene.String(required=True)
        description = graphene.String(required=False)
        bedrooms_number = graphene.Int(required=True)
        bathrooms_number = graphene.Int(required=True)
        price = graphene.Float(required=True)
        location = graphene.String(required=False)
        province = graphene.String(required=True)
        municipality = graphene.String(required=True)
        dimensions = graphene.Int(required=True)
        owner_username = graphene.String(required=True)
        images = graphene.List(graphene.String, required=False)
        max_capacity = graphene.Int(required=True)
        tags = graphene.List(graphene.String, required=True)
        user_token = graphene.String(required=True)

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
        municipality = kwargs.get("municipality", "").strip()
        dimensions = kwargs.get("dimensions", "")
        owner_username = kwargs.get("owner_username", "")
        max_capacity = kwargs.get("max_capacity", "")
        tags = kwargs.get("tags", [])
        user_token = kwargs.get("user_token", "")
       

        if not title or len(title) < 4 or len(title) > 50:
            raise ValueError(_("El título debe tener entre 4 y 50 caracteres"))

        if not description or len(description) > 1000:
            raise ValueError(
                _("La descripción no puede tener más de 1000 caracteres"))

        if not bedrooms_number or bedrooms_number < 1 or bedrooms_number>50:
            raise ValueError(
                _("El número de dormitorios debe estar entre 1 y 50"))

        if not bathrooms_number or bathrooms_number < 1 or bathrooms_number>50:
            raise ValueError(
                _("El número de cuartos de baño debe estar entre 1 y 50"))

        if not price or price < 1 or price>500000:
            raise ValueError(_("El precio introducido no es válido. Debe estar entre 1 y 500k"))
        
        if dimensions>50000 or dimensions<1:
            raise ValueError(_("El valor de dimensiones introducido no es correcto. Debe estar entre 1 y 50k"))
        
        if not max_capacity or max_capacity<1 or max_capacity>20:
            raise ValueError(_("La capacidad máxima no es válida"))
        
        if not location or len(location) < 1 or len(location) > 30:
            raise ValueError(
                _("La localización debe tener entre 1 y 30 caracteres"))

        if not province or not Province.objects.filter(name=province).exists():
            raise ValueError("No existe la provincia indicada")

        province = Province.objects.get(name=province)

        if not municipality or not Municipality.objects.filter(name=municipality).exists():
            raise ValueError(_("No existe el municipio indicado"))

        municipality = Municipality.objects.get(name=municipality)

        if municipality.province != province:
            raise ValueError(_("El municipio no pertenece a la provincia indicada"))

        owner = FlatterUser.objects.get(username=owner_username)

        check_token(user_token, owner)

        if not owner.roles.filter(role="OWNER").exists():
            raise ValueError(_("El usuario debe ser propietario"))

        if len(tags)>8:
            raise ValueError(_("No se pueden añadir más de 8 tags"))

        user_tags = []
        for tag in tags:
            if not _exists_tag(tag):
                raise ValueError(_(f"La etiqueta {tag} no existe"))
            user_tags.append(Tag.objects.get(name=tag, entity='P'))


        obj = Property.objects.create(
            title=title,
            description=description,
            bedrooms_number=bedrooms_number,
            bathrooms_number=bathrooms_number,
            price=price,
            location=location,
            province=province,
            municipality=municipality,
            dimensions=dimensions,
            owner=owner,
            max_capacity=max_capacity,
            visits_counter = 0
        )

        images = kwargs.get('images', [])
        images_to_add = []

        if images:
            for image in images:
                imgdata = base64.b64decode(image + "===")
                name = random_string(title) + '.png'
                filename = os.path.join('media', 'properties', 'images', name)
                with open(filename, 'wb') as f:
                    f.write(imgdata)

                image = Image.objects.create(image="properties/images/" + name)
                images_to_add.append(image)

            obj.images.add(*images_to_add)

        else:
            image = Image.objects.get(image="properties/images/default.png")
            obj.images.add(image)

        obj.tags.set(user_tags)

        obj.save()

        return CreatePropertyMutation(property=obj)


class DeletePropertyMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        # TODO: comprobar usuario
        
    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(root, info, **kwargs):
        property_id = kwargs.get("property_id","")
        try:
            selected_property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("El inmueble seleccionado no existe"))
        selected_property.delete()
        return DeletePropertyMutation(property=selected_property)

class CreatePetitionMutation(graphene.Mutation):
    class Input:
        message = graphene.String(required=False)
        property_id = graphene.Int(required=True)
        requester_username= graphene.String(required=True)
        user_token = graphene.String(required=True)

    petition = graphene.Field(PetitionType)

    @staticmethod
    def mutate(root, info, **kwargs):
        message = kwargs.get('message', '').strip()
        property_id = kwargs.get('property_id', '')
        requester_username = kwargs.get("requester_username", "").strip()
        user_token = kwargs.get("user_token", "")
        
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("No se ha podido completar la solicitud debido a que el inmueble no existe"))
        
        requester = FlatterUser.objects.get(username = requester_username)

        check_token(user_token, requester)

        if Petition.objects.filter(property = property, requester = requester).exclude(status = 'D').exists():
            raise ValueError(_("Ya has realizado una solicitud a este inmueble."))
           
        obj = Petition.objects.create(
            message=message,
            property=property,
            requester=requester,
            status='P',
        )
        obj.save()
        return CreatePetitionMutation(petition=obj)
         
class UpdatePetitionStatus(graphene.Mutation):
    class Input:
        petition_id = graphene.Int(required=True)
        status_petition = graphene.String(required=True)
        # TODO: comprobar usuario

    petition = graphene.Field(PetitionType)

    @staticmethod
    def mutate(root, info, **kwargs):
        petition_id = kwargs.get('petition_id', '')
        status_petition = kwargs.get('status_petition', '')
        
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            raise GraphQLError(f"Solicitud con ID {petition_id} no existe")

        user = petition.property.owner
        
        if (petition.status == "D" or petition.status == "I") :
            raise GraphQLError(f"No se puede actualizar una solicitud que denegada o ya pagada")

        if status_petition == "A":
            petition.status = "A"
            petition.date_of_petition_acepted = datetime.now()
        elif status_petition == "D":
            petition.status = "D"
        elif status_petition == "I":
            petition.status = "I"
        petition.save()
        return UpdatePetitionStatus(petition=petition)

class DeletePetition(graphene.Mutation):
    class Input:
        petition_id = graphene.Int(required=True)
        # TODO: comprobar usuario

    petition = graphene.Field(PetitionType)
    
    @staticmethod
    def mutate(root, info, **kwargs):
        petition_id = kwargs.get('petition_id', '')
        
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            raise GraphQLError(f"Solicitud con ID {petition_id} no existe")
        
        if petition.status == "A" or petition.status == "I":
            raise GraphQLError(f"No se puede puede eliminar una petición ya aceptada o pagada")
        petition.delete()
        return DeletePetition(petition=petition)

class UpdatePropertyMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        bedrooms_number = graphene.Int(required=False)
        bathrooms_number = graphene.Int(required=False)
        price = graphene.Float(required=False)
        location = graphene.String(required=False)
        province = graphene.String(required=False)
        municipality = graphene.String(required=False)
        dimensions = graphene.Int(required=False)
        images = graphene.List(graphene.String, required=False)
        max_capacity = graphene.Int(required=False)
        tags = graphene.List(graphene.String, required=True)
        # TODO: comprobar usuario

    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(root, info, **kwargs):
        title = kwargs.get('title', '').strip()
        description = kwargs.get('description', '').strip()
        bedrooms_number = kwargs.get("bedrooms_number", '')
        bathrooms_number = kwargs.get("bathrooms_number", "")
        price = kwargs.get("price", "")
        location = kwargs.get("location", "").strip()
        province = kwargs.get("province", "").strip()
        municipality = kwargs.get("municipality", "").strip()
        dimensions = kwargs.get("dimensions", "")
        property_id = kwargs.get("property_id", 0)
        images = kwargs.get('images', [])
        max_capacity = kwargs.get("max_capacity", "")
        tags = kwargs.get("tags", [])

        if title and (len(title) < 4 or len(title) > 50):
            raise ValueError(_("El título debe tener entre 4 y 50 caracteres"))

        if description and len(description) > 1000:
            raise ValueError(
                _("La descripción no puede tener más de 1000 caracteres"))

        if bedrooms_number and (bedrooms_number < 1 or bedrooms_number>50):
            raise ValueError(
                _("El número de dormitorios no es válido. Debe ser un número entre 1 y 50"))

        if bathrooms_number and (bathrooms_number < 1 or bathrooms_number>50):
            raise ValueError(
                _("El número de cuartos de baño no es válido. Debe ser un número entre 1 y 50"))

        if price and (price < 1 or price>500000):
            raise ValueError(_("El precio introducido no es válido. Debe ser un número entre 1 y 500k"))

        if location and len(location) > 50:
            raise ValueError(
                _("La localización debe más de 50 caracteres"))

        if dimensions and (dimensions < 1 or dimensions>50000):
            raise ValueError(
                _("Las dimensiones introducidas no son válidas. Debe estar entre 1 y 50k"))
        
        if max_capacity and (max_capacity < 1 or max_capacity>20):
            raise ValueError("La capacidad máxima no es válida. Debe estar entre 1 y 20")
        
        property_edit = Property.objects.get(pk=property_id)

        if province and not Province.objects.filter(name=province).exists():
            raise ValueError("No existe la provincia indicada")
        elif province:
            province = Province.objects.get(name=province)
        else:
            province = property_edit.province

        if municipality and not Municipality.objects.filter(name=municipality).exists():
            raise ValueError(_("No existe el municipio indicado"))
        elif municipality:
            municipality = Municipality.objects.get(name=municipality)
        else:
            municipality = property_edit.municipality

        if municipality and municipality.province != province:
            raise ValueError(_("El municipio no pertenece a la provincia indicada"))

        if title and title != property_edit.title:
            property_edit.title = title

        if description and description != property_edit.description:
            property_edit.description = description

        if bedrooms_number and bedrooms_number != property_edit.bedrooms_number:
            property_edit.bedrooms_number = bedrooms_number

        if bathrooms_number and bathrooms_number != property_edit.bathrooms_number:
            property_edit.bathrooms_number = bathrooms_number

        if price and price != property_edit.price:
            property_edit.price = price

        if location and location != property_edit.location:
            property_edit.location = location

        if province and province != property_edit.province:
            property_edit.province = province

        if municipality and municipality != property_edit.municipality:
            property_edit.municipality = municipality

        if dimensions and dimensions != property_edit.dimensions:
            property_edit.dimensions = dimensions
            
        if max_capacity and max_capacity != property_edit.max_capacity:
            property_edit.max_capacity = max_capacity
            
        property_edit.save()

        if images:
            
            images_to_add = []
            
            property_edit.images.clear()
            
            for image in images:
                imgdata = base64.b64decode(image + "===")
                name = random_string(property_edit.title) + '.png'
                filename = os.path.join('media', 'properties', 'images', name)
                with open(filename, 'wb') as f:
                    f.write(imgdata)

                image = Image.objects.create(image="properties/images/" + name)
                images_to_add.append(image)

            property_edit.images.add(*images_to_add)

        if len(tags) > 8:
            raise ValueError(_("No se pueden añadir más de 8 tags"))

        user_tags = []
        for tag in tags:
            if not _exists_tag(tag):
                raise ValueError(_(f"La etiqueta {tag} no existe"))
            user_tags.append(Tag.objects.get(name=tag, entity='P'))

        property_edit.tags.set(user_tags)

        property_edit.save()

        return UpdatePropertyMutation(property=property_edit)


class MakePropertyOutstandingMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        # TODO: comprobar usuario

    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(root, info, **kwargs):
        property_id = kwargs.get('property_id', 0)

        try:
            selected_property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("El inmueble seleccionado no existe"))

        if selected_property.is_outstanding:
            raise ValueError(_("El inmueble ya es destacado"))
        
        outstanding_properties = Property.objects.filter(is_outstanding=True)
        
        if outstanding_properties.count() >= 5:
            raise ValueError(_("Ya hay el máximo de inmuebles destacados, prueba otro día o contacta con nuestro equipo de marketing."))

        if selected_property.owner.flatter_coins < 1000:
            raise ValueError(_("No tienes suficientes flattercoins para destacar este inmueble"))
        
        selected_property.owner.flatter_coins -= 1000
        selected_property.owner.save()
        
        selected_property.is_outstanding = True
        selected_property.outstanding_start_date = timezone.now()
        selected_property.save()

        return MakePropertyOutstandingMutation(property=selected_property)
class AddUsersToFavouritePropertyMutation(graphene.Mutation):

  class Input:
    property_id = graphene.Int(required=True)
    username = graphene.String(required=True)
    user_token = graphene.String(required=True)

  user = graphene.Field(FlatterUserType)
  property = graphene.Field(PropertyType)

  @staticmethod
  def mutate(self, info, **kwargs):
    
    property_id = kwargs.get('property_id',0)
    username=kwargs.get('username',0)
    user_token=kwargs.get('user_token','')

    try:
        user = FlatterUser.objects.get(username=username)
        check_token(user_token, user)
    except FlatterUser.DoesNotExist:
        raise ValueError(_(f"El usuario con nombre de usuario {username} no existe"))
    
    try:
        property = Property.objects.get(id=property_id)
    except Property.DoesNotExist:
        raise ValueError(_("El inmueble seleccionado no existe"))
    
    if property.owner.username == username:
        raise ValueError(_("No puedes marcar tu propio inmueble como favorito"))
    
    if user in property.interested_users.all():
        raise ValueError(_("Ya has marcado este piso como favorito"))
    else:
        # Agregar el usuario a la lista de interesados en la propiedad
        property.interested_users.add(user)
        property.save()
    return AddUsersToFavouritePropertyMutation(user=user, property=property)
  
class DeleteUsersToFavouritePropertyMutation(graphene.Mutation):

    class Input:
        property_id = graphene.Int(required=True)
        username = graphene.String(required=True)
        user_token = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)
    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(self, info, **kwargs):
        property_id = kwargs.get('property_id', 0)
        username=kwargs.get('username')
        user_token=kwargs.get('user_token','')
        
        try:
            user = FlatterUser.objects.get(username=username)
            check_token(user_token, user)
        except FlatterUser.DoesNotExist:
            raise ValueError(_(f"El usuario con nombre de usuario {username} no existe"))
    
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("El inmueble seleccionado no existe"))

        # Agregar el usuario a la lista de interesados en la propiedad
        if user in property.interested_users.all():
            property.interested_users.remove(user)
            property.save()
        else:
            raise ValueError(_("Ya has eliminado este usuario"))
        return DeleteUsersToFavouritePropertyMutation(user=user, property=property)

class AddUserToPropertyMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        username = graphene.String(required=True)
        # TODO: comprobar usuario

    user = graphene.Field(FlatterUserType)
    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(self, info, **kwargs):
        property_id = kwargs.get('property_id', 0)
        username=kwargs.get('username')
        user_token=kwargs.get('user_token','')
        
        try:
            user = FlatterUser.objects.get(username=username)
        except FlatterUser.DoesNotExist:
            raise ValueError(_(f"El usuario con nombre de usuario {username} no existe"))
    
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("El inmueble seleccionado no existe"))
        if not FlatterUser.objects.filter(username=username,roles__in = [Role.objects.get(role="RENTER").pk]).exists():
            raise ValueError(_(f"El usuario {username} no tiene el rol de renter"))
        if user in property.flatmates.all():
            raise ValueError(_(f"El usuario {username} ya se encuentra asociado a este piso"))
        
        if len(property.flatmates.all()) < property.max_capacity:
            property.flatmates.add(user)
            property.save()
        else:
            raise ValueError(_(f"La propiedad con id {property.id} ya tiene asociados el numero máximo de inquilinos {property.max_capacity}"))
        return AddUserToPropertyMutation(user=user, property=property)
class PropertyMutation(graphene.ObjectType):
    create_property = CreatePropertyMutation.Field()
    update_property = UpdatePropertyMutation.Field()
    delete_property = DeletePropertyMutation.Field()
    add_tag_to_property = AddTagToProperty.Field()
    delete_image_to_property = DeleteImageFromProperty.Field()
    delete_property = DeletePropertyMutation.Field()
    make_property_outstanding = MakePropertyOutstandingMutation.Field()
    create_petition = CreatePetitionMutation.Field()
    update_status_petition = UpdatePetitionStatus.Field()
    delete_petition = DeletePetition.Field()
    add_users_to_favourite_property=AddUsersToFavouritePropertyMutation.Field()
    delete_users_to_favourite_property=DeleteUsersToFavouritePropertyMutation.Field()
    add_user_to_property= AddUserToPropertyMutation.Field()


# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def random_string(atributo):
    # Obtenemos las primeras tres letras del atributo
    prefijo = atributo[:3].lower()
    # Generamos una cadena aleatoria de cuatro caracteres
    sufijo = ''.join(random.choices(string.ascii_lowercase, k=4))
    # Combinamos el prefijo y el sufijo para formar el nombre
    random_string = prefijo + sufijo

    return random_string


def _exists_tag(tag):
    return Tag.objects.filter(name=tag, entity='P').exists()
