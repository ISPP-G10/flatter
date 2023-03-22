from graphql import GraphQLError
from .models import Petition, Tag, Property
from authentication.models import FlatterUser, Role
from mainApp.models import Image
from .models import Property
from .types import PropertyType, PetitionType
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import base64, random, string, os, graphene


class DeleteImageFromProperty(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)
        image = graphene.String(required=True)

    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(self, info, **kwargs):

        property_id = kwargs.get('property_id', '').strip()
        image = kwargs.get('image', '')

        os.remove(f"media/{image}")

        property = Property.objects.get(pk=property_id)
        image = Image.objects.get(image=image)
        property.images.remove(image)

        return DeleteImageFromProperty(property=property)


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
        location = graphene.String(required=True)
        province = graphene.String(required=True)
        dimensions = graphene.Int(required=True)
        owner_username = graphene.String(required=True)
        images = graphene.List(graphene.String, required=False)
        max_capacity = graphene.Int(required=True)

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
        owner_username = kwargs.get("owner_username", "")
        max_capacity = kwargs.get("max_capacity", "")

        if not title or len(title) < 4 or len(title) > 25:
            raise ValueError(_("El título debe tener entre 4 y 25 caracteres"))

        if not description or len(description) > 512:
            raise ValueError(
                _("La descripción no puede tener más de 512 caracteres"))

        if not bedrooms_number or bedrooms_number < 1:
            raise ValueError(
                _("El número de dormitorios no debe ser inferior a 1"))

        if not bathrooms_number or bathrooms_number < 1:
            raise ValueError(
                _("El número de cuartos de baño no debe ser inferior a 1"))

        if not price or price < 1:
            raise ValueError(_("El precio debe tener un valor positivo"))

        # if not location or len(location) < 4 or len(location) > 16:
        #     raise ValueError(
        #         _("La localización debe tener entre 4 y 16 caracteres"))

        if not province or len(province) > 15:
            raise ValueError(_("La provincia debe tener máximo 15 caracteres"))

        if not dimensions or dimensions < 1:
            raise ValueError(
                _("Las dimensiones deben poseer un valor positivo"))

        if not max_capacity or max_capacity < 1:
            raise ValueError("La capacidad máxima debe ser positiva")

        owner = FlatterUser.objects.get(username=owner_username)

        if not owner.roles.contains(Role.objects.get(role="OWNER")):
            raise ValueError(_("El usuario debe ser propietario"))

        obj = Property.objects.create(
            title=title,
            description=description,
            bedrooms_number=bedrooms_number,
            bathrooms_number=bathrooms_number,
            price=price,
            location=location,
            province=province,
            dimensions=dimensions,
            owner=owner,
            max_capacity=max_capacity,
        )

        images = kwargs.get('images', [])
        print(len(images))
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

        return CreatePropertyMutation(property=obj)


class DeletePropertyMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)

    property = graphene.Field(PropertyType)

    @staticmethod
    def mutate(root, info, property_id):
        property = Property.objects.get(pk=property_id)
        property.delete()
        return DeletePropertyMutation(property=property)
    


class CreatePetitionMutation(graphene.Mutation):
    class Input:
        message = graphene.String(required=False)
        property_id = graphene.Int(required=True)
        requester_username= graphene.String(required=True)
        

    petition = graphene.Field(PetitionType)

    @staticmethod
    def mutate(root, info, **kwargs):
        message = kwargs.get('message', '').strip()
        property_id = kwargs.get('property_id', '')
        requester_username = kwargs.get("requester_username", "").strip()
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise ValueError(_("No se ha podido completar la solicitud debido a que el inmueble no existe"))
        
        requester = FlatterUser.objects.get(username = requester_username)
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
        status_petition = graphene.Boolean(required=True)

    petition = graphene.Field(PetitionType)

    @staticmethod
    def mutate(root, info, **kwargs):
        petition_id = kwargs.get('petition_id', '')
        status_petition = kwargs.get('status_petition', False)
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            raise GraphQLError(f"Solicitud con ID {petition_id} no existe")

        if petition.status != "P":
            raise GraphQLError(f"No se puede actualizar una solicitud que no esté pendiente")

        if status_petition:
            petition.status = "A"
        else:
            petition.status = "D"
        petition.save()
        return UpdatePetitionStatus(petition=petition)

class DeletePetition(graphene.Mutation):
    class Input:
        petition_id = graphene.Int(required=True)
    
    petition = graphene.Field(PetitionType)
    
    @staticmethod
    def mutate(root, info, **kwargs):
        petition_id = kwargs.get('petition_id', '')
        
        try:
            petition = Petition.objects.get(id=petition_id)
        except Petition.DoesNotExist:
            raise GraphQLError(f"Solicitud con ID {petition_id} no existe")

        if petition.status == "A":
            raise GraphQLError(f"No se puede puede eliminar una petición ya aceptada")
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
        dimensions = graphene.Int(required=False)
        images = graphene.List(graphene.String, required=False)
        max_capacity = graphene.Int(required=False)

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
        dimensions = kwargs.get("dimensions", "")
        property_id = kwargs.get("property_id", 0)
        images = kwargs.get('images', [])
        max_capacity = kwargs.get("max_capacity", "")

        if title and (len(title) < 4 or len(title) > 25):
            raise ValueError(_("El título debe tener entre 4 y 25 caracteres"))

        if description and len(description) > 512:
            raise ValueError(
                _("La descripción no puede tener más de 512 caracteres"))

        if bedrooms_number and bedrooms_number < 1:
            raise ValueError(
                _("El número de dormitorios no debe ser inferior a 1"))

        if bathrooms_number and bathrooms_number < 1:
            raise ValueError(
                _("El número de cuartos de baño no debe ser inferior a 1"))

        if price and price < 1:
            raise ValueError(_("El precio debe tener un valor positivo"))

        if location and (len(location) < 4 or len(location) > 16):
            raise ValueError(
                _("La localización debe tener entre 4 y 16 caracteres"))

        if province and len(province) > 16:
            raise ValueError(_("La provincia debe tener máximo 16 caracteres"))

        if dimensions and dimensions < 1:
            raise ValueError(
                _("Las dimensiones deben poseer un valor positivo"))
        
        if max_capacity and max_capacity < 1:
            raise ValueError("La capacidad máxima debe ser positiva")

        property_edit = Property.objects.get(pk=property_id)

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

        # Devolver la propiedad actualizada
        return UpdatePropertyMutation(property=property_edit)


class MakePropertyOutstandingMutation(graphene.Mutation):
    class Input:
        property_id = graphene.Int(required=True)

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
        
        selected_property.is_outstanding = True
        selected_property.outstanding_start_date = timezone.now()
        selected_property.save()

        return MakePropertyOutstandingMutation(property=selected_property)


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


# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #


def random_string(atributo):
    # Obtenemos las primeras tres letras del atributo
    prefijo = atributo[:3].lower()
    # Generamos una cadena aleatoria de cuatro caracteres
    sufijo = ''.join(random.choices(string.ascii_lowercase, k=4))
    # Combinamos el prefijo y el sufijo para formar el nombre
    random_string = prefijo + sufijo

    return random_string
