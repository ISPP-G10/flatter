import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation

class FlatterQuery(SchemeAuthenticationQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)