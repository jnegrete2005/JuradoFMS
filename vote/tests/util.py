from json import loads
from ..models import Competitor, VotingPoll
from graphene_django.utils.testing import graphql_query

def setUp(self):
  # Create Competitors
  c1_a = Competitor.objects.create(
    name='Si',
    easy=[1,1,1,1,1,1,1,1,1],
    hard=[1,1,1,1,1,1,1,1,1],
    tematicas=[1,1,1,1,1,1,1],
    random_score=[1,1,1,1,1,1,1,1,1],
    min1=[1,1,1,1,1,1,1,1,1],
    min2=[1,1,1,1,1,1,1,1,1],
    deluxe=[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  )
  c1_b =  Competitor.objects.create(
    name='No',
    easy=[2,2,9,2,2,2,2,2,9],
    hard=[2,2,2,2,2,2,2,2,2],
    tematicas=[2,2,2,2,2,2,2],
    random_score=[2,2,2,2,2,2,2,2,2],
    min1=[2,2,2,2,2,2,2,2,2],
    min2=[2,2,2,2,2,2,2,2,2],
    deluxe=[2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  )

  c2_a = Competitor.objects.create(
    name='Replica 1',
    easy=[3,3,3,3,3,3,3,3,3],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas=[3,3,3,3,3,3,3],
    random_score=[3,3,3,3,3,3,3,3,3],
    min1=[3,3,3,3,3,3,3,3,3],
    min2=[3,3,3,3,3,3,3,3,3],
    deluxe=[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    replica=[3,3,3,3,3,3,3,9,9]
  )
  c2_b = Competitor.objects.create(
    name='Replica 2',
    easy=[3,3,3,3,3,3,3,3,9],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas=[3,3,3,3,3,3,3],
    random_score=[3,3,3,3,3,3,3,3,3],
    min1=[3,3,3,3,3,3,3,3,3],
    min2=[3,3,3,3,3,3,3,3,3],
    deluxe=[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    replica=[3,3,3,3,3,3,3,3,3]
  )


  # Create VotingPolls
  poll1 = VotingPoll.objects.create(
    comp_1=c1_a,
    comp_2=c1_b
  )
  poll2 = VotingPoll.objects.create(
    comp_1=c2_a,
    comp_2=c2_b
  )

@classmethod
def setUpTestData(cls):
  # Create Competitors
  c1_a = Competitor.objects.create(
    name='Si',
    easy=[1,1,1,1,1,1,1,1,1],
    hard=[1,1,1,1,1,1,1,1,1],
    tematicas=[1,1,1,1,1,1,1],
    random_score=[1,1,1,1,1,1,1,1,1],
    min1=[1,1,1,1,1,1,1,1,1],
    min2=[1,1,1,1,1,1,1,1,1],
    deluxe=[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  )
  c1_b =  Competitor.objects.create(
    name='No',
    easy=[2,2,9,2,2,2,2,2,9],
    hard=[2,2,2,2,2,2,2,2,2],
    tematicas=[2,2,2,2,2,2,2],
    random_score=[2,2,2,2,2,2,2,2,2],
    min1=[2,2,2,2,2,2,2,2,2],
    min2=[2,2,2,2,2,2,2,2,2],
    deluxe=[2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  )
  c2_a = Competitor.objects.create(
    name='Replica 1',
    easy=[3,3,3,3,3,3,3,3,3],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas=[3,3,3,3,3,3,3],
    random_score=[3,3,3,3,3,3,3,3,3],
    min1=[3,3,3,3,3,3,3,3,3],
    min2=[3,3,3,3,3,3,3,3,3],
    deluxe=[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    replica=[3,3,3,3,3,3,3,9,9]
  )
  c2_b = Competitor.objects.create(
    name='Replica 2',
    easy=[3,3,3,3,3,3,3,3,9],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas=[3,3,3,3,3,3,3],
    random_score=[3,3,3,3,3,3,3,3,3],
    min1=[3,3,3,3,3,3,3,3,3],
    min2=[3,3,3,3,3,3,3,3,3],
    deluxe=[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    replica=[3,3,3,3,3,3,3,3,3]
  )

  # Create VotingPolls
  poll1 = VotingPoll.objects.create(
    comp_1=c1_a,
    comp_2=c1_b
  )
  poll2 = VotingPoll.objects.create(
    comp_1=c2_a,
    comp_2=c2_b
  )


class Query:
  """ Will query what you pass in, with the variables """
  def __init__(self, query: str, variables: dict):
    self.response = graphql_query(query, variables=variables)
    self.content = loads(self.response.content)