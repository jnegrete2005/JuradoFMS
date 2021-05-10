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
    if settings.DEBUG == True:
      poll = VotingPoll.objects.first()
      for i in range(9):
        poll.comp_1[i] = None
        poll.comp_2[i] = None
      poll.rep_counter = 0
      poll.save(update_fields=['rep_counter'])
      return CreatePoll(poll=poll)

    if (len(comp1) > 20 or len(comp1) < 2) or (len(comp2) > 20 or len(comp2) < 2):
      raise GraphQLError('Los competidores tienen que tener un máximo de 20 caracteres y un mínimo de 2')

    comp_1 = Competitor.objects.create(name=comp1)
    comp_2 = Competitor.objects.create(name=comp2)

    poll = VotingPoll.objects.create(comp_1=comp_1, comp_2=comp_2)
    
    return CreatePoll(poll=poll)


class SaveModes(graphene.Mutation):
  class Arguments:
    poll_id = graphene.ID(required=True)
    mode = graphene.String(required=True)
    value_1 = graphene.List(graphene.Float, required=True)
    value_2 = graphene.List(graphene.Float, required=True)

  comp_1 = graphene.Field(CompMode)
  comp_2 = graphene.Field(CompMode)

  @classmethod
  def mutate(cls, root, info, poll_id: int, mode: str, value_1: list, value_2: list):
    # Check if the mode is according to the length
    if mode == 'deluxe':
      if len(value_1) != 14 or len(value_2) != 14:
        raise GraphQLError('Deluxe no puede tener más ni menos de 14 elementos')

    elif mode.startswith('tematicas'):
      if len(value_1) != 7 or len(value_2) != 7:
        raise GraphQLError('Tematicas no puede tener más ni menos de 7 elementos')

    elif mode == 'random_score':
      if len(value_1) != 11 or len(value_2) != 11:
        raise GraphQLError('Random mode no puede tener más ni menos de 11 elementos')
    
    elif mode.startswith('min'):
      if len(value_1) != 18 or len(value_2) != 18:
        raise GraphQLError('Los minutos tienen que tener 18 elementos (los checks cuentan)')

    elif len(value_1) != 9 or len(value_2) != 9:
      raise GraphQLError(f'{Competitor._meta.get_field(mode).verbose_name} no puede tener más ni menos de 9 elementos')

    validate_input(value_1)
    validate_input(value_2)

    poll = VotingPoll.objects.get(pk=int(poll_id))

    poll.comp_1.__dict__[mode] = value_1
    poll.comp_2.__dict__[mode] = value_2
    
    poll.comp_1.save(update_fields=[mode])
    poll.comp_2.save(update_fields=[mode])

    return SaveModes(
        comp_1={'mode': poll.comp_1.__dict__[mode]}, 
        comp_2={'mode': poll.comp_2.__dict__[mode]}
      )


class SaveWinner(graphene.Mutation):
  class Arguments:
    poll_id = graphene.ID(required=True)
    winner = graphene.String(required=True)

  poll = graphene.Field(VotingPollType)

  @classmethod
  def mutate(cls, root, info, poll_id: int, winner: str):
    poll = VotingPoll.objects.get(pk=int(poll_id))

    # Check if the winner is valid
    possible = [poll.comp_1.name, poll.comp_2.name, 'replica']
    if winner not in possible:
      raise GraphQLError(f'"{winner}" no coincide con los competidores de esta batalla.')

    # Set the new winner
    poll.winner = winner
    poll.save(update_fields=['winner'])

    return SaveWinner(poll=poll)


class PlusReplica(graphene.Mutation):
  class Arguments:
    id = graphene.ID(required=True)

  poll = graphene.Field(VotingPollType)
  
  @classmethod
  def mutate(cls, root, info, id: int):
    poll = VotingPoll.objects.get(pk=int(id))

    # Validate number
    if poll.rep_counter > 0:
      raise GraphQLError('Solo pueden haber 2 replicas en total.')
    
    poll.rep_counter += 1
    poll.save(update_fields=['rep_counter'])

    return PlusReplica(poll=poll)


class Mutation(graphene.ObjectType):
  create_poll = CreatePoll.Field()
  save_modes = SaveModes.Field()
  save_winner = SaveWinner.Field()
  plus_replica = PlusReplica.Field()


def validate_input(val: list):
  for num in val:
    if (num >= 0 and num <= 4 and num % 0.5 == 0) or num == 9:
      continue
    raise GraphQLError('Los valores deben ser entre 0 y 4 y el único decimal que pueden tener es .5')
  return
  