import graphene
from django.db.models import Avg

from authentication.models import Tag
from mainApp.models import Review
from social.types import ReviewType
from authentication.types import TagType


class SocialQueries(object):

  get_user_reviews = graphene.List(ReviewType, username=graphene.String())
  get_all_tag = graphene.List(TagType, tag=graphene.String())

  def resolve_get_user_reviews(self, info, username):
    return Review.objects.filter(valued_user__username=username)

  def resolve_get_all_tag(self, info):
      return Tag.objects.all()
