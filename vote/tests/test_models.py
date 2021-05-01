from django.test import TestCase

from .util import setUp as sU
from ..models import Competitor, VotingPoll

# Create your tests here.
class VoteTestCase(TestCase):
  setUp = sU
  
  # Competitor
  def test_get_comp(self):
    """ Checks if getting a Competitor works properly """
    comp = Competitor.objects.get(pk=1)
    self.assertEqual(comp.name, 'Si')
    self.assertEqual(comp.easy, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.hard, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.tematicas_1, [1,1,1,1,1,1,1])
    self.assertEqual(comp.tematicas_2, [1,1,1,1,1,1,1])
    self.assertEqual(comp.random_score, [1,1,1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.min1, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.min2, [1,1,1,1,1,1,1,1,1])
    self.assertEqual(comp.deluxe, [1,1,1,1,1,1,1,1,1,1,1,1,1,1])

  # VotingPoll
  def test_get_poll(self):
    """ Checks if getting the a works """
    self.assertEqual(VotingPoll.objects.first(), VotingPoll.objects.get(comp_1=Competitor.objects.get(name='Si')))
    self.assertEqual(VotingPoll.objects.first(), VotingPoll.objects.get(comp_2=Competitor.objects.get(name='No')))
