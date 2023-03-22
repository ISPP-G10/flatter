import base64
import os
import re
from datetime import datetime

import graphene
import jwt
from django.utils.translation import gettext_lazy as _

from authentication.models import FlatterUser, Tag, Role
from authentication.types import FlatterUserType, IncidentType, RequestType
from mainApp.models import Review
from social.models import Group, Message
from social.models import Incident, Request
from social.types import ReviewType, GroupType, MessageType

GROUP_DOES_NOT_EXIST = 'Group does not exist'

USER_DOES_NOT_EXIST = 'User does not exist'


class CreateGroupMutation(graphene.Mutation):
    class Input:
        name = graphene.String(required=False)
        individual = graphene.Boolean(required=False)
        user_ids = graphene.List(graphene.Int, required=True)

    group = graphene.Field(GroupType)

    @staticmethod
    def mutate(root, info, **kwargs):

        users_ids = kwargs.get('user_ids')

        users = FlatterUser.objects.filter(id__in=users_ids)

        if not users.exists() and len(users) != len(users_ids):
            raise ValueError('User ids must be valid')

        if users.distinct().count() != len(users_ids):
            raise ValueError('User ids must be unique')

        users_not_add_group = users.filter(userpreferences__add_group=False)

        if users_not_add_group.exists():
            raise ValueError(f"The user(s) with id {', '.join(str(u.id) for u in users_not_add_group)} do not allow "
                             f"you to add them to a group")

        if 'individual' in kwargs and kwargs.get('individual'):
            individual = kwargs.get('individual')
            if len(users) != 2:
                raise ValueError('Individual groups can only have two users')
        else:
            individual = False

        if 'name' in kwargs and kwargs.get('name').strip():
            name = kwargs.get('name')
            if len(name) < 3 or len(name) > 30:
                raise ValueError('Group name must have between 3 and 30 characters')
        else:
            name = None

        group = Group.objects.create(name=name, individual=individual)
        group.users.set(users)

        return CreateGroupMutation(group=group)


class CreateMessageMutation(graphene.Mutation):
    class Input:
        text = graphene.String(required=True)
        group_id = graphene.Int(required=True)
        sender_id = graphene.Int(required=True)
        user_token = graphene.String(required=False)

    message = graphene.Field(MessageType)

    @staticmethod
    def mutate(root, info, **kwargs):

        user_token = kwargs.get('user_token', '').strip()

        try:
            user = FlatterUser.objects.get(id=kwargs.get('sender_id'))
        except FlatterUser.DoesNotExist:
            raise ValueError(USER_DOES_NOT_EXIST)

        check_token(user_token, user)

        user_group = Group.objects.get(id=kwargs.get('group_id'))

        if not user_group:
            raise ValueError(GROUP_DOES_NOT_EXIST)

        if user.id not in user_group.users.values_list('id', flat=True):
            raise ValueError(f'The user with id {user.id} is not part of the group')

        message = Message.objects.create(text=kwargs.get('text'), user=user, group=user_group)

        return CreateMessageMutation(message=message)


class AddUsersGroupMutation(graphene.Mutation):
    class Input:
        group_id = graphene.Int(required=True)
        user_ids = graphene.List(graphene.Int, required=True)

    group = graphene.Field(GroupType)

    @staticmethod
    def mutate(root, info, **kwargs):

        try:
            group = Group.objects.get(id=kwargs.get('group_id'))
        except Group.DoesNotExist:
            raise ValueError(GROUP_DOES_NOT_EXIST)

        users_id = kwargs.get('user_ids')

        users = FlatterUser.objects.filter(id__in=users_id)

        if not users.exists() and len(users) != len(users_id):
            raise ValueError('User ids must be valid')

        if users.distinct().count() != len(users_id):
            raise ValueError('User ids must be unique')

        users_not_add_group = users.filter(userpreferences__add_group=False)

        if users_not_add_group.exists():
            raise ValueError(f"The user(s) with id {', '.join(str(u.id) for u in users_not_add_group)} do not allow "
                             f"you to add them to a group")

        group.users.add(*users)

        return AddUsersGroupMutation(group=group)


class AddUserGroupMutation(graphene.Mutation):
    class Input:
        group_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)

    group = graphene.Field(GroupType)

    @staticmethod
    def mutate(root, info, **kwargs):

        user = FlatterUser.objects.get(id=kwargs.get('user_id'))

        if not user:
            raise ValueError(USER_DOES_NOT_EXIST)

        group = Group.objects.get(id=kwargs.get('group_id'))

        if not group:
            raise ValueError(GROUP_DOES_NOT_EXIST)

        if not user.userpreferences.add_group:
            raise ValueError(f'The user with id {user.id} does not allow you to add them to a group')

        if group.users.filter(id=user.id).exists():
            raise ValueError(f'The user with id {user.id} is already part of the group')

        if group.individual:
            raise ValueError('You cannot add a user to an individual group')

        group.users.add(user)

        return AddUserGroupMutation(group=group)


class LeaveGroupMutation(graphene.Mutation):
    class Input:
        group_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)
        user_token = graphene.String(required=False)

    group = graphene.Field(GroupType)

    @staticmethod
    def mutate(root, info, **kwargs):

        user_token = kwargs.get('user_token', '').strip()

        user = FlatterUser.objects.get(id=kwargs.get('user_id'))

        if not user:
            raise ValueError(USER_DOES_NOT_EXIST)

        check_token(user_token, user)

        group = Group.objects.get(id=kwargs.get('group_id'))

        if not group:
            raise ValueError(GROUP_DOES_NOT_EXIST)

        if not group.users.filter(id=user.id).exists():
            raise ValueError(f'The user with id {user.id} is not part of the group')

        group.users.remove(user)

        if group.users.count() <= 1:
            group.delete()
            return LeaveGroupMutation(group=None)

        return LeaveGroupMutation(group=group)


class CreateIncident(graphene.Mutation):
    class Input:
        command = graphene.String(required=True)

    incident = graphene.Field(IncidentType)

    @staticmethod
    def mutate(root, info, **kwargs):
        command = kwargs.get('command', '').strip()

        if not command:
            raise ValueError(_("El comando no puede estar vacío"))

        incident = Incident.objects.create(command=command)

        return CreateIncident(incident=incident)


class CreateRequest(graphene.Mutation):
    class Input:
        command = graphene.String(required=True)

    request = graphene.Field(RequestType)

    @staticmethod
    def mutate(root, info, **kwargs):
        command = kwargs.get('command', '').strip()

        if not command:
            raise ValueError(_("El comando no puede estar vacío"))

        request = Request.objects.create(command=command)

        return CreateRequest(request=request)


class EditUserPrivateMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        genre = graphene.String(required=True)
        role = graphene.String(required=True)
        phone = graphene.String(required=True)
        email = graphene.String(required=True)
        profile_picture = graphene.String(required=True)
        user_token = graphene.String(required=False)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):
        username = kwargs.get('username', '').strip()
        first_name = kwargs.get('first_name', '').strip()
        last_name = kwargs.get('last_name', '').strip()
        genre = kwargs.get('genre', '').strip()
        role = kwargs.get('role', '').strip()
        phone = kwargs.get('phone', '').strip()
        email = kwargs.get('email', '').strip()
        profile_picture = kwargs.get('profile_picture', '').strip()
        user_token = kwargs.get('user_token', '').strip()

        user_selected = FlatterUser.objects.get(username=username)

        check_token(user_token, user_selected)

        if (len(first_name) < 3 or len(first_name) >= 50):
            raise ValueError(_("El nombre debe tener entre 3 y 50 caracteres"))

        if (len(last_name) < 3 or len(last_name) >= 50):
            raise ValueError(_("Los apellidos deben tener entre 3 y 50 caracteres"))

        if not re.match(r"^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$", email):
            raise ValueError(_("El email no es válido"))

        if genre and not valid_genre(genre):
            raise ValueError(_("El género no es válido"))

        if role and not valid_roles(role):
            raise ValueError(_("Los roles no son válidos"))

        if phone:
            phone = phone.strip()
            if not re.match(r"^[9|6|7][0-9]{8}$", phone):
                raise ValueError(_("El teléfono no es válido"))

        if genre:
            genre = parse_genre(genre)

        if role:
            roles = parse_roles(role)



        if first_name and user_selected.first_name != first_name:
            user_selected.first_name = first_name
        if last_name and user_selected.last_name != last_name:
            user_selected.last_name = last_name
        if email and user_selected.email != email:
            if _exists_email(email):
                raise ValueError(_("Este email ya está registrado. Por favor, elige otro."))
            else:
                user_selected.email = email

        if not phone:
            user_selected.phone_number = None
        else:
            user_selected.phone_number = phone

        if not profile_picture:
            user_selected.profile_picture = "users/images/default.jpg"
        else:
            imgdata = base64.b64decode(profile_picture.split(',')[1])
            name = user_selected.username + '.png'
            filename = os.path.join('media', 'users', 'images', name)

            if os.path.exists(filename):
                os.remove(filename)

            with open(filename, 'wb') as f:
                f.write(imgdata)

            user_selected.profile_picture = os.path.join('users', 'images', name)

        if genre and user_selected.genre != genre:
            user_selected.genre = genre

        user_selected.save()

        if role:
            user_selected.roles.clear()
            user_selected.roles.add(*roles)

        return EditUserPrivateMutation(user=user_selected)


class EditUserPublicMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        biography = graphene.String(required=True)
        profile_picture = graphene.String(required=True)
        profession = graphene.String(required=True)
        birthday = graphene.String(required=True)
        tags = graphene.List(graphene.String, required=True)
        user_token = graphene.String(required=False)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):

        username = kwargs.get('username', '').strip()
        first_name = kwargs.get('first_name', '').strip()
        last_name = kwargs.get('last_name', '').strip()
        biography = kwargs.get('biography', '').strip()
        profile_picture = kwargs.get('profile_picture', '')
        profession = kwargs.get('profession', '').strip()
        birthday = kwargs.get('birthday', '').strip()
        tags = kwargs.get('tags', [])
        user_token = kwargs.get('user_token', '').strip()

        user_selected = FlatterUser.objects.get(username=username)

        check_token(user_token, user_selected)

        if (len(first_name) < 3 or len(first_name) >= 50):
            raise ValueError(_("El nombre debe tener entre 3 y 50 caracteres"))

        if (len(last_name) < 3 or len(last_name) >= 50):
            raise ValueError(_("Los apellidos deben tener entre 3 y 50 caracteres"))

        if profession and len(profession) < 1 and len(profession) > 100:
            raise ValueError(_("La profesión debe tener entre 1 y 100 caracteres"))



        if user_selected.first_name != first_name:
            user_selected.first_name = first_name
        if user_selected.last_name != last_name:
            user_selected.last_name = last_name

        if not biography:
            user_selected.biography = None
        else:
            user_selected.biography != biography
            user_selected.biography = biography

        if not profile_picture:
            user_selected.profile_picture = "users/images/default.jpg"
        else:
            imgdata = base64.b64decode(profile_picture.split(',')[1])
            name = user_selected.username + '.png'
            filename = os.path.join('media', 'users', 'images', name)

            if os.path.exists(filename):
                os.remove(filename)

            with open(filename, 'wb') as f:
                f.write(imgdata)

            user_selected.profile_picture = os.path.join('users', 'images', name)

        if not birthday:
            user_selected.birthday = None
        else:
            try:
                formated_birthday = datetime.strptime(birthday, '%d/%m/%Y')
                if formated_birthday > datetime.now():
                    raise ValueError(_("La fecha de nacimiento no puede ser mayor a la actual"))
            except ValueError:
                raise ValueError(_("La fecha de nacimiento no es válida, debe tener el formato dd/mm/yyyy"))

            if user_selected.birthday != formated_birthday:
                user_selected.birthday = formated_birthday

        if not profession:
            user_selected.profession = None
        else:
            user_selected.profession != profession
            user_selected.profession = profession

        user_selected.save()

        if len(tags) > 8:
            raise ValueError(_("No se pueden añadir más de 8 tags"))

        user_tags = []
        for tag in tags:
            if not _exists_tag(tag):
                raise ValueError(_(f"La etiqueta {tag} no existe"))
            user_tags.append(Tag.objects.get(name=tag))

        user_selected.tags.set(user_tags)

        return EditUserPublicMutation(user=user_selected)


class ChangePasswordMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)
        user_token = graphene.String(required=False)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):

        username = kwargs.get('username', '').strip()
        old_password = kwargs.get('old_password', '').strip()
        new_password = kwargs.get('new_password', '').strip()
        user_token = kwargs.get('user_token', '').strip()

        user_selected = FlatterUser.objects.get(username=username)

        check_token(user_token, user_selected)

        if not user_selected.check_password(old_password):
            raise ValueError(_("La contraseña actual no es correcta"))

        if old_password != new_password:
            user_selected.set_password(new_password)
            user_selected.save()

        return ChangePasswordMutation(user=user_selected)


class AddRoleToUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=True)
        role = graphene.String(required=True)
        user_token = graphene.String(required=False)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):

        username = kwargs.get('username', '').strip()
        role = kwargs.get('role', '').strip()
        user_token = kwargs.get('user_token', '').strip()

        user_selected = FlatterUser.objects.get(username=username)

        check_token(user_token, user_selected)

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
        username = graphene.String(required=True)
        user_token = graphene.String(required=False)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    def mutate(root, info, **kwargs):

        username = kwargs.get('username', '').strip()
        role = kwargs.get('role', '').strip()
        user_token = kwargs.get('user_token', '').strip()

        user_selected = FlatterUser.objects.get(username=username)

        check_token(user_token, user_selected)

        try:
            role = Role.objects.get(role=role)
        except Exception:
            raise ValueError(_("El rol no existe"))

        user_selected.roles.remove(role)
        user_selected.save()

        return DeleteRoleFromUserMutation(user=user_selected)


class CreateReview(graphene.Mutation):
    class Input:
        rating = graphene.Int(required=False)
        text = graphene.String(required=True)
        valued_user = graphene.String(required=True)
        evaluator_user = graphene.String(required=True)
        relationship = graphene.String(required=True)
        user_token = graphene.String(required=False)

    review = graphene.Field(ReviewType)

    @staticmethod
    def mutate(root, info, **kwargs):
        rating = kwargs.get('rating', None)
        text = kwargs.get('text', '').strip()
        valued_user = kwargs.get('valued_user', '')
        evaluator_user = kwargs.get('evaluator_user', '')
        relationship = kwargs.get('relationship', '').strip()
        user_token = kwargs.get('user_token', '').strip()

        try:
            evaluator_user = FlatterUser.objects.get(username=evaluator_user)
        except Exception:
            raise ValueError(_("El usuario evaluador no existe"))

        check_token(user_token, evaluator_user)

        if rating and (rating < 1 or rating > 5):
            raise ValueError(_("La valoración debe estar entre 1 y 5"))

        if len(text) < 2 or len(text) > 256:
            raise ValueError(_("El texto debe tener entre 2 y 256 caracteres"))

        try:
            valued_user = FlatterUser.objects.get(username=valued_user)
        except Exception:
            raise ValueError(_("El usuario valorado no existe"))

        if valued_user == evaluator_user:
            raise ValueError(_("No puedes valorarte a ti mismo"))

        if len(relationship) > 1:
            relationship = _parse_relationship(relationship.lower().strip())

        if not relationship:
            raise ValueError(_("La relación entre usuarios no es válida"))

        if Review.objects.filter(valued_user=valued_user, evaluator_user=evaluator_user).exists():
            raise ValueError(_("Ya has valorado a este usuario"))

        review = Review.objects.create(rating=rating, text=text, valued_user=valued_user, evaluator_user=evaluator_user,
                                       relationship=relationship)

        return CreateReview(review=review)


class SocialMutation(graphene.ObjectType):
    edit_user_public = EditUserPublicMutation.Field()
    edit_user_private = EditUserPrivateMutation.Field()
    add_role_to_user = AddRoleToUserMutation.Field()
    delete_role_to_user = DeleteRoleFromUserMutation.Field()
    change_user_password = ChangePasswordMutation.Field()
    create_review = CreateReview.Field()
    create_incident = CreateIncident.Field()
    create_request = CreateRequest.Field()
    create_group = CreateGroupMutation.Field()
    create_message = CreateMessageMutation.Field()
    leave_group = LeaveGroupMutation.Field()
    add_users_group = AddUsersGroupMutation.Field()


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
    if relationship == 'inquilino':
        return 'I'
    return None


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


def _exists_tag(tag):
    return Tag.objects.filter(name=tag).exists()


def check_token(user_token: str, user: FlatterUser):
    if user_token:
        try:
            user_token = jwt.decode(user_token, 'my_secret', algorithms=['HS256'])
            if user_token['username'] != user.username:
                raise ValueError(_("El token no es válido"))
        except jwt.exceptions.DecodeError:
            raise ValueError(_("El token no es válido"))
