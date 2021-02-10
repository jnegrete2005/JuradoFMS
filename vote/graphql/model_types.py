from graphene_django import DjangoObjectType
from graphene.types.objecttype import ObjectType
from ..models import Competitor, VotingPoll

import graphene

class CompetitorType(DjangoObjectType):
  class Meta:
    model = Competitor
    fields = '__all__'


class CompetitorModeType(ObjectType):
  mode = graphene.List(graphene.Int)


class VotingPollType(DjangoObjectType):
  class Meta:
    model = VotingPoll
    fields = '__all__'