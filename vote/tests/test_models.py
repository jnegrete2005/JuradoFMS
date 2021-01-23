from django.test import TestCase

from ..models import Competitor, VotingPoll
from .setup import setUp as su

# Create your tests here.
class VoteTestCase(TestCase):
  setUp = su
  
  # Competitor
  def test_get_comp(self):
    """ Checks if getting a Competitor works properly """
    comp = Competitor.objects.get(pk=1)
    self.assertEqual(comp.name, 'Si')
    self.assertEqual(comp.easy, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.hard, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.tematicas, [1,1,1,1,1,1,1])
    self.assertEqual(comp.random_mode, 1)
    self.assertEqual(comp.random_score, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.min1, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.min2, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.deluxe, [1,1,1,1,1,1,1,1,1,1,1,1,1,1])

  def test_get_sum(self):
    """ Checks if the get_sum Competitor function works """
    self.assertEqual(Competitor.objects.get(name='No').get_sum('deluxe'), 28)

  def test_get_sum_9(self):
    """ Checks if the function ignores 9s """
    self.assertEqual(Competitor.objects.get(name='No').get_sum('easy'), 14)

  def test_get_total(self):
    """ Checks if the get_total Competitor function works """
    self.assertEqual(Competitor.objects.get(name='Si').get_total(), 66)

  def test_get_total_9(self):
    """ Checks if the function ignores 9s """
    self.assertEqual(Competitor.objects.get(name='No').get_total(), 128)

  # VotingPoll
  def test_get_poll(self):
    """ Checks if getting the a works """
    self.assertEqual(VotingPoll.objects.first(), VotingPoll.objects.get(comp_1=Competitor.objects.get(name='Si')))
    self.assertEqual(VotingPoll.objects.first(), VotingPoll.objects.get(comp_2=Competitor.objects.get(name='No')))

  def test_get_winner_win(self):
    """ Checks if the get_winner VotingPoll function works (returns a winner) """
    self.assertEqual(VotingPoll.objects.first().get_winner(), VotingPoll.objects.first().comp_2)

  def test_get_winner_replica(self):
    """ Checks if the get_winner VotingPoll function works (returns a replica) """
    self.assertEqual(VotingPoll.objects.last().get_winner(), 'Réplica')

  def test_get_winner_replica_1(self):
    """ 
    Checks if the get_winner VotingPoll function works 
    (returns a winner with replica mode on) 
    """
    self.assertEqual(VotingPoll.objects.last().get_winner(replica=True), Competitor.objects.last())
