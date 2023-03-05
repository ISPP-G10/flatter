import graphene
from graphql_jwt.decorators import login_required

from authentication.models import FlatterUser, Tag, Role
from authentication.types import FlatterUserType
from django.utils.translation import gettext_lazy as _


class EditUserMutation(graphene.Mutation):
    class Input:
        username = graphene.String(required=False)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        email = graphene.String(required=False)
        bibliography = graphene.String(required=False)
        phone = graphene.String(required=False)
        profile_picture = graphene.String(required=False)


    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

        user = info.context.user
        username = kwargs.get('username', '').strip()
        first_name = kwargs.get('first_name', '').strip()
        last_name = kwargs.get('last_name', '').strip()
        email = kwargs.get('email', '').strip()
        bibliography = kwargs.get('bibliography', '').strip()
        phone = kwargs.get('phone', '').strip()
        profile_picture = kwargs.get('profile_picture', '').strip()

        print(len(phone))


        if len(username) > 1:
            if len(username) < 6 or len(username) > 25:
                raise ValueError(_("El usuario debe tener entre 6 y 24 caracteres"))

        if len(first_name) > 1:
            if len(first_name) < 3 or len(first_name) >= 50:
                raise ValueError(_("El nombre debe tener entre 3 y 50 caracteres"))

        if len(last_name) > 1:
            if len(last_name) < 3 or len(last_name) >= 50:
                raise ValueError(_("Los apellidos deben tener entre 3 y 50 caracteres"))

        if len(email) > 1:
            if ("@" not in email) or ("." not in email):
                raise ValueError(_("El email no es válido"))

        if not phone.isdigit() or len(phone) < 9:
            raise ValueError(_("El número de teléfono no es válido"))

        if user.username != username:
            if _exists_user(username):
                raise ValueError(_("Este nombre de usuario ya está registrado. Por favor, elige otro."))

        if user.email != email:
            if _exists_email(email):
                raise ValueError(_("Este email ya está registrado. Por favor, elige otro."))

        user_selected = FlatterUser.objects.get(pk=user.id)

        # Check that the user making the request is the owner of the account
        if user.id != user_selected.id:
            raise Exception(_("You are not authorized to perform this action."))

        user_selected.username = username
        user_selected.first_name = first_name
        user_selected.last_name = last_name
        user_selected.email = email
        user_selected.bibliography = bibliography
        user_selected.phone_number = phone
        user_selected.profile_picture = profile_picture
        user_selected.save()

        return EditUserMutation(user=user_selected)

class DeleteTagToUserMutation(graphene.Mutation):
    class Input:
        tag_name = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

            user = info.context.user
            tag_name = kwargs.get('tag_name', '').strip()

            user_selected = FlatterUser.objects.get(pk=user.id)

            # Check that the user making the request is the owner of the account
            if user.id != user_selected.id:
                raise Exception(_("You are not authorized to perform this action."))

            tag = Tag.objects.get(name=tag_name)
            user_selected.tags.remove(tag)

            return DeleteTagToUserMutation(user=user_selected)

class AddRoleToUserMutation(graphene.Mutation):
    class Input:
        role = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

            user = info.context.user
            role = kwargs.get('role', '').strip()

            user_selected = FlatterUser.objects.get(pk=user.id)

            # Check that the user making the request is the owner of the account
            if user.id != user_selected.id:
                raise Exception(_("You are not authorized to perform this action."))

            try:
                role = Role.objects.get(role=role)
            except:
                raise Exception(_("El rol no existe"))

            user_roles = user_selected.roles.all()
            if role in user_roles:
                raise Exception(_("El usuario ya tiene este rol"))

            user_selected.roles.add(role)
            user_selected.save()

            return AddRoleToUserMutation(user=user_selected)

class DeleteRoleToUserMutation(graphene.Mutation):
    class Input:
        role = graphene.String(required=True)

    user = graphene.Field(FlatterUserType)

    @staticmethod
    @login_required
    def mutate(root, info, **kwargs):

            user = info.context.user
            role = kwargs.get('role', '').strip()

            user_selected = FlatterUser.objects.get(pk=user.id)

            # Check that the user making the request is the owner of the account
            if user.id != user_selected.id:
                raise Exception(_("You are not authorized to perform this action."))

            try:
                role = Role.objects.get(role=role)
            except:
                raise Exception(_("El rol no existe"))

            user_selected.roles.remove(role)
            user_selected.save()

            return DeleteRoleToUserMutation(user=user_selected)




class SocialMutation(graphene.ObjectType):
    edit_user = EditUserMutation.Field()
    delete_tag_to_user = DeleteTagToUserMutation.Field()
    add_role_to_user = AddRoleToUserMutation.Field()
    delete_role_to_user = DeleteRoleToUserMutation.Field()


# ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- #

def _exists_user(username):
    return FlatterUser.objects.filter(username=username).exists()

def _exists_email(email):
    return FlatterUser.objects.filter(email=email).exists()