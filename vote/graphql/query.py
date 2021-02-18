from .types import CompetitorType, VotingPollType, CompMode
from ..models import Competitor, VotingPoll

import graphene

class Query(graphene.ObjectType):
  voting_poll = graphene.Field(VotingPollType, id=graphene.ID())
  comp = graphene.Field(CompetitorType, id=graphene.ID())
  get_mode = graphene.Field(CompMode, id=graphene.ID(), mode=graphene.String())

  def resolve_voting_poll(root, info, id):
    return VotingPoll.objects.get(pk=id)

  def resolve_comp(root, info, id):
    return Competitor.objects.get(pk=id)

  def resolve_get_mode(root, info, id, mode):
    return CompMode(mode=Competitor.objects.get(id=id).__dict__[mode])
    