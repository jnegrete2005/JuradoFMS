from .model_types import CompetitorType, VotingPollType
from ..models import Competitor, VotingPoll

import graphene

class CreateCompetitors(graphene.Mutation):
  class Arguments:
    comp_1 = graphene.String(required=True)
    comp_2 = graphene.String(required=True)

  comp_1 = graphene.Field(CompetitorType)
  comp_2 = graphene.Field(CompetitorType)

  @classmethod
  def mutate(cls, root, info, comp_1, comp_2):
    comp_1 = Competitor.objects.create(name=comp_1)
    comp_2 = Competitor.objects.create(name=comp_2)
    
    return CreateCompetitors(comp_1=comp_1, comp_2=comp_2)


class Mutation(graphene.ObjectType):
  create_competitors = CreateCompetitors.Field()