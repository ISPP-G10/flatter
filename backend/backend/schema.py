import graphene
from authentication.queries import AuthenticationQuery as SchemeAuthenticationQuery
from authentication.mutations import AuthenticationMutation as SchemeAuthenticationMutation
from mainApp.queries import MainAppQuery as SchemeMainAppQuery
from mainApp.mutations import MainAppMutation as SchemeMainAppMutation

class FlatterQuery(SchemeAuthenticationQuery, SchemeMainAppQuery,graphene.ObjectType):
  pass



class FlatterMutation(SchemeAuthenticationMutation, SchemeMainAppMutation,graphene.ObjectType):
  pass

schema = graphene.Schema(query=FlatterQuery, mutation=FlatterMutation)