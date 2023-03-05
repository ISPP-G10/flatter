import graphene
from mainApp.queries import MainAppQuery as SchemeMainAppQuery
from mainApp.mutations import PropertyMutation as SchemeMainAppMutation
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation

class FlatterQuery(SchemeAuthenticationQuery, SchemeMainAppQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, SchemeMainAppMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)