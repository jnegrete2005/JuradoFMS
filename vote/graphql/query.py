from .model_types import CompetitorType, VotingPollType
from ..models import Competitor, VotingPoll

import graphene

class Query(graphene.ObjectType):
  voting_poll = graphene.Field(VotingPollType, id=graphene.ID())

  def resolve_voting_poll(root, info, id):
    return VotingPoll.objects.get(pk=id)
