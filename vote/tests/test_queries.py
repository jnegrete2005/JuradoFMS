from json import loads

from graphene_django.utils.testing import GraphQLTestCase

from .util import Query, setUpTestData as setUpTD
from ..models import Competitor, VotingPoll

# Create your tests here.
class QueriesTestCase(GraphQLTestCase):
  setUpTestData = setUpTD

  def test_voting_poll(self):
    """ Should return a complete VotingPoll """

    query = Query(
      """ 
      query votingPoll($id: ID!) {
        votingPoll(id: $id) {
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
      """,
      { 'id': VotingPoll.objects.first().id }
    )

    self.assertResponseNoErrors(query.response)
    self.assertEqual(query.content['data']['votingPoll']['comp1']['name'], 'Si')

  def test_get_comp(self):
    """ Query to return a single Competitor """
    
    query = Query(
      """  
      query GetComp($id: ID!) {
        comp(id: $id) {
          id
          name
        }
      }
      """,
      { 'id': Competitor.objects.first().id }
    )

    self.assertResponseNoErrors(query.response)
    self.assertEqual(query.content['data']['comp']['name'], 'Si')

  def test_get_mode(self):
    """ Returns a mode in the form of 'mode' """

    query = Query(
      """  
      query GetMode($id: ID!, $mode: String!) {
        getMode(id: $id, mode: $mode) {
          mode
        }
      }
      """,
      {
        'id': Competitor.objects.first().id,
        'mode': 'easy'
      }
    )

    self.assertResponseNoErrors(query.response)
    self.assertEqual(query.content['data']['getMode']['mode'], [1,1,1,1,1,1,1,1,1])
  