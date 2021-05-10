import json

from graphene_django.utils.testing import GraphQLTestCase

from .util import Query, setUp as sU
from ..models import Competitor, VotingPoll

# Create your tests here.
class MutationsTestCase(GraphQLTestCase):
  setUp = sU

  def test_create_poll(self):
    """ Test if creating a poll works """

    query = Query(
      """ 
      mutation CreatePoll($comp1: String!, $comp2: String!) {
        createPoll(comp1: $comp1, comp2: $comp2) {
          poll {
            id
            comp1 {
              id 
              name
            }
            comp2 {
              id
              name
            }
          }
        }
      }
      """,
      {
        'comp1': 'Si',
        'comp2': 'No'
      }
    )

    self.assertResponseNoErrors(query.response)
    self.assertEqual(int(query.content['data']['createPoll']['poll']['id']), VotingPoll.objects.last().id)
    self.assertEqual(query.content['data']['createPoll']['poll']['comp1']['name'], 'Si')
    self.assertEqual(query.content['data']['createPoll']['poll']['comp2']['name'], 'No')

  def test_save_modes(self):
    query = Query(
      """  
      mutation SaveModes($id: ID!, $mode: String!, $value1: [Float]!, $value2: [Float]!) {
        saveModes(pollId: $id, mode: $mode, value1:$value1, value2: $value2) {
          comp1 {
            mode
          }
          comp2 {
            mode
          }
        }
      }
      """,
      {
        'id': VotingPoll.objects.first().id,
        'mode': 'easy',
        'value1': [1,2,2,1,1,1,1,1,1],
        'value2': [1,2,2,1,1,1,1,1,1]
      }
    )

    self.assertResponseNoErrors(query.response)
    self.assertEqual(query.content['data']['saveModes']['comp1']['mode'], [1,2,2,1,1,1,1,1,1])

  def test_save_winner(self):
    query = Query(
      """
      mutation SaveWinner($id: ID!, $winner: String!) {
        saveWinner(pollId: $id, winner: $winner) {
          poll {
            winner
          }
        }
      }
      """,
      {
        'id': VotingPoll.objects.first().id,
        'winner': 'Si'
      }
    )

    self.assertResponseNoErrors(query.response)

  def test_plus_replica(self):
    query = Query(
      """
      mutation PlusReplica($id: ID!) {
        plusReplica(id: $id) {
          poll {
            repCounter
          }
        }
      }
      """,
      {
        'id': VotingPoll.objects.first().id
      }
    )

    self.assertResponseNoErrors(query.response)

    query = Query(
      """
      mutation SaveWinner($id: ID!, $winner: String!) {
        saveWinner(pollId: $id, winner: $winner) {
          poll {
            winner
          }
        }
      }
      """,
      {
        'id': VotingPoll.objects.first().id
      }
    )

    self.assertResponseHasErrors(query.response)
