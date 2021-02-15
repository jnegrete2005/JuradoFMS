from .types import CompetitorType, VotingPollType
from ..models import Competitor, VotingPoll

import graphene

class Query(graphene.ObjectType):
  voting_poll = graphene.Field(VotingPollType, id=graphene.ID())
  comp = graphene.Field(CompetitorType, id=graphene.ID())

  def resolve_voting_poll(root, info, id):
    return VotingPoll.objects.get(pk=id)

  def resolve_comp(root, info, id):
    return Competitor.objects.get(pk=id)
    