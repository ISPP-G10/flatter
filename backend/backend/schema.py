import graphene
from mainApp.queries import MainAppQuery as SchemeMainAppQuery
from mainApp.mutations import PropertyMutation as SchemeMainAppMutation
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from social.mutations import SocialMutation as SchemeSocialMutations
from social.queries import SocialQueries as SchemeSocialQueries
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie




class FlatterQuery(SchemeAuthenticationQuery, SchemeSocialQueries, SchemeMainAppQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, SchemeSocialMutations, SchemeMainAppMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)