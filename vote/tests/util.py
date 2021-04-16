from json import loads
from ..models import Competitor, VotingPoll
from graphene_django.utils.testing import graphql_query

def setUp(self):
  # Create Competitors
  c1_a = Competitor.objects.create(
    name='Si',
    easy=[1,1,1,1,1,1,1,1,1],
    hard=[1,1,1,1,1,1,1,1,1],
    tematicas_1=[1,1,1,1,1,1,1],
    tematicas_2=[1,1,1,1,1,1,1],
    random_score=[1,1,1,1,1,1,1,1,1],
    min1=[1,1,1,1,1,1,1,1,1],
    min2=[1,1,1,1,1,1,1,1,1],
    deluxe=[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  )
  c1_b =  Competitor.objects.create(
    name='No',
    easy=[2,2,9,2,2,2,2,2,9],
    hard=[2,2,2,2,2,2,2,2,2],
    tematicas_1=[2,2,2,2,2,2,2],
    tematicas_2=[2,2,2,2,2,2,2],
    random_score=[2,2,2,2,2,2,2,2,2],
    min1=[2,2,2,2,2,2,2,2,2],
    min2=[2,2,2,2,2,2,2,2,2],
    deluxe=[2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  )

  c2_a = Competitor.objects.create(
    name='Replica 1',
    easy=[3,3,3,3,3,3,3,3,3],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas_1=[3,3,3,3,3,3,3],
    tematicas_2=[3,3,3,3,3,3,3],
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
    tematicas_1=[3,3,3,3,3,3,3],
    tematicas_2=[3,3,3,3,3,3,3],
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
    tematicas_1=[1,1,1,1,1,1,1],
    tematicas_2=[1,1,1,1,1,1,1],
    random_score=[1,1,1,1,1,1,1,1,1],
    min1=[1,1,1,1,1,1,1,1,1],
    min2=[1,1,1,1,1,1,1,1,1],
    deluxe=[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  )
  c1_b =  Competitor.objects.create(
    name='No',
    easy=[2,2,9,2,2,2,2,2,9],
    hard=[2,2,2,2,2,2,2,2,2],
    tematicas_1=[2,2,2,2,2,2,2],
    tematicas_2=[2,2,2,2,2,2,2],
    random_score=[2,2,2,2,2,2,2,2,2],
    min1=[2,2,2,2,2,2,2,2,2],
    min2=[2,2,2,2,2,2,2,2,2],
    deluxe=[2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  )
  c2_a = Competitor.objects.create(
    name='Replica 1',
    easy=[3,3,3,3,3,3,3,3,3],
    hard=[3,3,3,3,3,3,3,3,3],
    tematicas_1=[3,3,3,3,3,3,3],
    tematicas_2=[3,3,3,3,3,3,3],
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
    tematicas_1=[3,3,3,3,3,3,3],
    tematicas_2=[3,3,3,3,3,3,3],
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

def get_key_by_val(my_dict: dict, val: str or int):
  for key, value in my_dict.items():
    if val == value:
      return key

  raise Exception('Key doesn\'t exist')

def index_dict(dictionary, n=0):
  if n < 0:
    n += len(dictionary)
  for i, key in enumerate(dictionary.keys()):
    if i == n:
      return dictionary[key]
  raise IndexError("dictionary index out of range")

modes_to_int = {
  'easy': 0,
  'hard': 1,
  'tematicas_1': 2,
  'tematicas_2': 3,
  'random_score': 4,
  'min1': 5,
  'min2': 6,
  'deluxe': 7,
  'end': 8,
  'replica': 9,
}

mode_aliases = {
  'easy': 'Easy Mode',
  'hard': 'Hard Mode',
  'tematicas_1': 'Primera Temática',
  'tematicas_2': 'Segunda Temática',
  'random_score': 'Random Mode',
  'min1': 'Primer Minuto',
  'min2': 'Segundo Minuto',
  'deluxe': 'Deluxe',
  'end': 'end',
  'replica': 'Réplica',
}