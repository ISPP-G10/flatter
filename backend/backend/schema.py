import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from mainApp.mutations import PropertyMutation as SchemePropertyMutation

class FlatterQuery(SchemeAuthenticationQuery, graphene.ObjectType):
  pass

class FlatterMutation(SchemeAuthenticationMutation, SchemePropertyMutation,graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)