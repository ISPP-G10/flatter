import graphene

from authentication.models import Tag
from authentication.types import TagType


class SocialQueries(object):

  get_all_tag = graphene.List(TagType, tag=graphene.String())

  def resolve_get_all_tag(self, info):
      return Tag.objects.all()
