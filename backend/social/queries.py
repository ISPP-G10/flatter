import graphene

from authentication.models import Tag
from authentication.types import TagType
from .types import GroupType, MessageType
from .models import Group, Message


class SocialQueries(object):

  get_all_tag = graphene.List(TagType, tag=graphene.String())
  get_groups = graphene.List(GroupType)
  get_messages = graphene.List(MessageType)

  def resolve_get_all_tag(self, info):
      return Tag.objects.all()
  
  def resolve_get_groups(self, info):
      return Group.objects.all()

  def resolve_get_messages(self, info):
      return Message.objects.all()
