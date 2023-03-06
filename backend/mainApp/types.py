from graphene_django.types import DjangoObjectType
<<<<<<< Updated upstream
from mainApp.models import Property
=======

from .models import Property
>>>>>>> Stashed changes

class PropertyType(DjangoObjectType):
  class Meta:
    model = Property