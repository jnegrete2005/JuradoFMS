from graphene_django import DjangoObjectType
from ..models import Competitor, VotingPoll

class CompetitorType(DjangoObjectType):
  class Meta:
    model = Competitor
    fields = (
      'id', 'name', 'easy', 'hard', 'tematicas', 'random', 'minuto1', 'minuto2', 'deluxe', 'replica'
      )


class VotingPollType(DjangoObjectType):
  class Meta:
    model = VotingPoll
    fields = ('comp_1', 'comp_2')