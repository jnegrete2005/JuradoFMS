from .types import CompetitorType, VotingPollType
from ..models import Competitor, VotingPoll

import graphene

class CreatePoll(graphene.Mutation):
  class Arguments:
    comp1 = graphene.String(required=True)
    comp2 = graphene.String(required=True)

  poll = graphene.Field(VotingPollType)

  @classmethod
  def mutate(cls, root, info, comp1, comp2):
    comp_1 = Competitor.objects.create(name=comp1)
    comp_2 = Competitor.objects.create(name=comp2)

    poll = VotingPoll.objects.create(comp_1=comp_1, comp_2=comp_2)
    
    return CreatePoll(poll=poll)


class SaveMode(graphene.Mutation):
  class Arguments:
    id = graphene.ID(required=True)
    mode = graphene.String(required=True)
    value = graphene.List(graphene.Int, required=True)

  comp = graphene.Field(CompetitorType)

  @classmethod
  def mutate(cls, root, info, id, mode, value):
    comp = Competitor.objects.get(pk=id)
    comp.__dict__[mode] = value
    comp.save(update_fields=[mode])

    return SaveMode(comp=comp)


class Mutation(graphene.ObjectType):
  create_poll = CreatePoll.Field()
  save_mode = SaveMode.Field()