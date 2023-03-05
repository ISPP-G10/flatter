import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from social.mutations import SocialMutation as SchemeSocialMutations

class FlatterQuery(SchemeAuthenticationQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, SchemeSocialMutations, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)