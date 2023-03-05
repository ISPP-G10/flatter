import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from mainApp.queries import MainAppQuery as SchemeMainAppQuery
class FlatterQuery(SchemeAuthenticationQuery, SchemeMainAppQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)