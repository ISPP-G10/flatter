import base64, os

import graphene
from django.core.exceptions import ValidationError
from graphql_jwt.decorators import login_required
import phonenumbers
from authentication.models import FlatterUser, Tag, Role
from authentication.types import FlatterUserType
from django.utils.translation import gettext_lazy as _
from mainApp.models import Review, Property
from social.types import ReviewType
from datetime import datetime


class EditUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        email = graphene.String(required=False)
        bibliography = graphene.String(required=False)
        phone = graphene.String(required=False)
        profile_picture = graphene.String(required=False)
        profession = graphene.String(required=False)
        birthday = graphene.String(required=False)


    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):

        username = kwargs.get('username', '').strip()
        first_name = kwargs.get('first_name', '').strip()
        last_name = kwargs.get('last_name', '').strip()
        email = kwargs.get('email', '').strip()
        bibliography = kwargs.get('bibliography', '').strip()
        phone = kwargs.get('phone', '').strip()
        profile_picture = kwargs.get('profile_picture', '')
        profession = kwargs.get('profession', '').strip()
        birthday = kwargs.get('birthday', '').strip()

        if first_name and (len(first_name) < 3 or len(first_name) >= 50):
            raise ValueError(_("El nombre debe tener entre 3 y 50 caracteres"))

        if last_name and (len(last_name) < 3 or len(last_name) >= 50):
            raise ValueError(_("Los apellidos deben tener entre 3 y 50 caracteres"))

        if email and ("@" not in email or "." not in email):
            raise ValueError(_("El email no es válido"))

        if phone:
            try:
                parsed_number = phonenumbers.parse(phone, None)
                if not phonenumbers.is_valid_number(parsed_number):
                    raise ValidationError(_("El número de teléfono no es válido."))
            except phonenumbers.NumberParseException as e:
                raise ValidationError(_("Error al validar el número de teléfono: %(error)s"),
                                      code="invalid_phone_number", params={"error": str(e)})

        if profession and len(profession) < 1 and len(profession) > 100:
            raise ValueError(_("La profesión debe tener entre 1 y 100 caracteres"))



        user_selected = FlatterUser.objects.get(username=username)

        if user_selected.username != username:
            user_selected.username = username
        if user_selected.first_name != first_name:
            user_selected.first_name = first_name
        if user_selected.last_name != last_name:
            user_selected.last_name = last_name
        if user_selected.email != email:
            if _exists_email(email):
                raise ValueError(_("Este email ya está registrado. Por favor, elige otro."))
            else:
                user_selected.email = email    
        if user_selected.bibliography != bibliography:
            user_selected.bibliography = bibliography
        if user_selected.phone_number != phone:
            user_selected.phone_number = phone

        if profile_picture:
            imgdata = base64.b64decode(profile_picture.split(',')[1])
            name = user_selected.username + '.png'
            filename = os.path.join('media', 'users', 'images', name)
            
            if os.path.exists(filename):
                os.remove(filename)
            
            with open(filename, 'wb') as f:
                f.write(imgdata)

            user_selected.profile_picture = os.path.join('users', 'images', name)

        if birthday:
        
            formated_birthday = datetime.strptime(birthday, '%Y-%m-%d')

            if user_selected.birthday != formated_birthday:
                user_selected.birthday = formated_birthday

        if user_selected.profession != profession:
            user_selected.profession = profession

        user_selected.save()

        return EditUserMutation(user=user_selected)

class DeleteTagFromUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        tag_name = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

            username = kwargs.get('username', '').strip()
            tag_name = kwargs.get('tag_name', '').strip()

            user_selected = FlatterUser.objects.get(username=username)

            tag = Tag.objects.get(name=tag_name)
            user_selected.tags.remove(tag)

            return DeleteTagToUserMutation(user=user_selected)

class AddRoleToUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        role = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):
        
            username = kwargs.get('username', '').strip()
            role = kwargs.get('role', '').strip()

            user_selected = FlatterUser.objects.get(username=username)

            # Check that the user making the request is the owner of the account

            try:
                role = Role.objects.get(role=role)
            except Exception:
                raise ValueError(_("El rol no existe"))

            user_roles = user_selected.roles.all()
            if role in user_roles:
                raise ValueError(_("El usuario ya tiene este rol"))

            user_selected.roles.add(role)
            user_selected.save()

            return AddRoleToUserMutation(user=user_selected)

class DeleteRoleFromUserMutation(graphene.Mutation):
    class Input:
        role = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

            username = kwargs.get('username', '').strip()
            role = kwargs.get('role', '').strip()

            user_selected = FlatterUser.objects.get(username=username)    

            try:
                role = Role.objects.get(role=role)
            except Exception:
                raise ValueError(_("El rol no existe"))

            user_selected.roles.remove(role)
            user_selected.save()

            return DeleteRoleToUserMutation(user=user_selected)

class CreateReview(graphene.Mutation):

    class Input:
        rating = graphene.Int(required=False)
        text = graphene.String(required=True)
        valued_user = graphene.String(required=True)
        evaluator_user = graphene.String(required=True)
        relationship = graphene.String(required=True)


    review = graphene.Field(ReviewType)

    @staticmethod
    def mutate(root, info, **kwargs):
        rating = kwargs.get('rating', None)
        text = kwargs.get('text', '').strip()
        valued_user = kwargs.get('valued_user', '')
        evaluator_user = kwargs.get('evaluator_user', '')
        relationship = kwargs.get('relationship', '').strip()
        
        if rating and (rating < 1 or rating > 5):
            raise ValueError(_("La valoración debe estar entre 1 y 5"))
        
        if len(text) < 2 or len(text) > 256:
            raise ValueError(_("El texto debe tener entre 2 y 256 caracteres"))
        
        try:
            valued_user = FlatterUser.objects.get(username=valued_user)
        except Exception:
            raise ValueError(_("El usuario valorado no existe"))
        
        try:
            evaluator_user = FlatterUser.objects.get(username=evaluator_user)
        except Exception:
            raise ValueError(_("El usuario evaluador no existe"))

        if valued_user == evaluator_user:
            raise ValueError(_("No puedes valorarte a ti mismo"))
        
        if len(relationship) > 1:
            relationship = _parse_relationship(relationship.lower().strip())
        
        if not relationship:
            raise ValueError(_("La relación entre usuarios no es válida"))

        if Review.objects.filter(valued_user=valued_user, evaluator_user=evaluator_user).exists():
            raise ValueError(_("Ya has valorado a este usuario"))

        review = Review.objects.create(rating=rating, text=text, valued_user=valued_user, evaluator_user=evaluator_user, relationship=relationship)

        return CreateReview(review=review)





class SocialMutation(graphene.ObjectType):
    edit_user = EditUserMutation.Field()
    delete_tag_to_user = DeleteTagFromUserMutation.Field()
    add_role_to_user = AddRoleToUserMutation.Field()
    delete_role_to_user = DeleteRoleFromUserMutation.Field()
    create_review = CreateReview.Field()


# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_email(email):
    return FlatterUser.objects.filter(email=email).exists()

def _parse_relationship(relationship):
    if relationship == 'amigo':
        return 'A'
    if relationship == 'compañero':
        return 'C'
    if relationship == 'excompañero':
        return 'E'
    if relationship == 'propietario':
        return 'P'
    return None