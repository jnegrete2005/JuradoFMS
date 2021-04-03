from .types import CompetitorType, VotingPollType, CompMode
from ..models import Competitor, VotingPoll

from django.conf import settings

from graphql import GraphQLError

import graphene


class CreatePoll(graphene.Mutation):
  class Arguments:
    comp1 = graphene.String(required=True)
    comp2 = graphene.String(required=True)

  poll = graphene.Field(VotingPollType)

  @classmethod
  def mutate(cls, root, info, comp1, comp2):
    if settings.DEBUG:
      poll = VotingPoll.objects.first()
      for i in range(8):
        poll.comp_1[i] = None
        poll.comp_2[i] = None
      return CreatePoll(poll=poll)

    comp_1 = Competitor.objects.create(name=comp1)
    comp_2 = Competitor.objects.create(name=comp2)

    poll = VotingPoll.objects.create(comp_1=comp_1, comp_2=comp_2)
    
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
  def mutate(cls, root, info, poll_id: int, mode: str, value_1: list, value_2: list):
    # Check if the mode is according to the length
    if mode == 'deluxe':
      if len(value_1) != 14 or len(value_2) != 14:
        raise GraphQLError('Deluxe no puede tener más ni menos de 14 elementos')

    elif mode == 'tematicas':
      if len(value_1) != 7 or len(value_2) != 7:
        raise GraphQLError('Tematicas no puede tener más ni menos de 7 elementos')

    elif len(value_1) != 9 or len(value_2) != 9:
      raise GraphQLError(f'{Competitor._meta.get_field(mode).verbose_name} no puede tener más ni menos de 9 elementos')

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
  