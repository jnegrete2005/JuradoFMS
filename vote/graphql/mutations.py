from .types import CompetitorType, VotingPollType, CompMode
from ..models import Competitor, VotingPoll

import graphene

class CreatePoll(graphene.Mutation):
  class Arguments:
    comp1 = graphene.String(required=True)
    comp2 = graphene.String(required=True)

  poll = graphene.Field(VotingPollType)

  @classmethod
  def mutate(cls, root, info, comp1, comp2):
    poll = VotingPoll.objects.first()
    
    return CreatePoll(poll=poll)


class SaveModes(graphene.Mutation):
  class Arguments:
    poll_id = graphene.ID(required=True)
    mode = graphene.String(required=True)
    value_1 = graphene.List(graphene.Int, required=True)
    value_2 = graphene.List(graphene.Int, required=True)

  comp_1 = graphene.Field(CompMode)
  comp_2 = graphene.Field(CompMode)

  @classmethod
  def mutate(cls, root, info, poll_id, mode, value_1, value_2):
    poll = VotingPoll.objects.get(pk=poll_id)

    poll.comp_1.__dict__[mode] = value_1
    poll.comp_2.__dict__[mode] = value_2
    
    poll.comp_1.save(update_fields=[mode])
    poll.comp_2.save(update_fields=[mode])

    return SaveModes(
        comp_1={'mode': poll.comp_1.__dict__[mode]}, 
        comp_2={'mode': poll.comp_2.__dict__[mode]}
      )


class Mutation(graphene.ObjectType):
  create_poll = CreatePoll.Field()
  save_modes = SaveModes.Field()
  