from graphene_django import DjangoObjectType
from ..models import Competitor, VotingPoll

import graphene

class CompetitorType(DjangoObjectType):
  class Meta:
    model = Competitor
    fields = '__all__'


class VotingPollType(DjangoObjectType):
  class Meta:
    model = VotingPoll
    fields = '__all__'