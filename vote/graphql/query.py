from .model_types import CompetitorType, CompetitorModeType, VotingPollType
from ..models import Competitor, VotingPoll

import graphene

class Query(graphene.ObjectType):
  voting_poll = graphene.Field(VotingPollType, id=graphene.ID())
  comp_mode = graphene.Field(CompetitorModeType, id=graphene.ID(), mode=graphene.String())

  def resolve_voting_poll(root, info, id):
    return VotingPoll.objects.get(pk=id)

  def resolve_comp_mode(root, info, id, mode):
    return Competitor.objects.get(pk=id).__dict__[mode]
