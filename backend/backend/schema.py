import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from mainApp.queries import MainAppQuery as SchemeMainAppQuery
from mainApp.mutations import PropertyMutation as SchemeMainAppMutation
from social.mutations import SocialMutation as SchemeSocialMutations
from social.queries import SocialQueries as SchemeSocialQueries

class FlatterQuery(SchemeAuthenticationQuery, SchemeSocialQueries, SchemeMainAppQuery, graphene.ObjectType):

  pass


class FlatterMutation(SchemeAuthenticationMutation, SchemeSocialMutations, SchemeMainAppMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)