from django.db.models import (
  Model, CharField, ForeignKey, PositiveSmallIntegerField, CASCADE
)
from django.contrib.postgres.fields import ArrayField

# Create your models here.


class Competitor(Model):
  """
  Competitor model object
  """
  name = CharField(max_length=20)
  easy = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Easy Mode')
  hard = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Hard Mode')
  tematicas_1 = ArrayField(PositiveSmallIntegerField(), size=7, null=True, blank=True, verbose_name='Tematicas 1')
  tematicas_2 = ArrayField(PositiveSmallIntegerField(), size=7, null=True, blank=True, verbose_name='Tematicas 2')
  random_score = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Random Mode')
  min1 = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 1')
  min2 = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 2')
  deluxe = ArrayField(PositiveSmallIntegerField(), size=14, null=True, blank=True, verbose_name='Deluxe')
  replica = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Replica')
  _list = [ 'easy', 'hard', 'tematicas_1', 'tematicas_2', 'random_score', 'min1', 'min2', 'deluxe', 'replica' ]

  def get_sum(self, mode):
    if mode == 'name':
      raise NameError('mode can\'t be equal to name')

    i = 0

    try:
      for j in self.__dict__[mode]:
        if j != 9:
          i += j
    except TypeError:
      pass

    return i

  def get_total(self):
    """
    Will give you the total of the competitor (excluding replica)
    """
    return (self.get_sum('easy') +
            self.get_sum('hard') +
            self.get_sum('tematicas_1') +
            self.get_sum('tematicas_2') +
            self.get_sum('random_score') +
            self.get_sum('min1') +
            self.get_sum('min2') +
            self.get_sum('deluxe'))

  def __str__(self):
    return self.name

  def __getitem__(self, index: int):
    return self.__dict__[self._list[index]]

  def __setitem__(self, index: int, value: list):
    self.__dict__[self._list[index]] = value
    self.save(update_fields=[self._list[index]])


class VotingPoll(Model):
  """
  VotingPoll model object
  """
  comp_1 = ForeignKey(Competitor, on_delete=CASCADE, related_name='comp_1')
  comp_2 = ForeignKey(Competitor, on_delete=CASCADE, related_name='comp_2')
  rep_counter = PositiveSmallIntegerField(null=True, blank=True)
  winner = CharField(max_length=20, null=True, blank=True)

  def __str__(self):
    return f'{self.comp_1} vs {self.comp_2}'

  def get_winner(self, replica=False):
    """
    Will return the winner, or replica
    """
    comp_1 = self.comp_1
    comp_2 = self.comp_2

    # Replica mode case
    if replica:
      if (comp_1.get_sum('replica') == comp_2.get_sum('replica')
          or abs(comp_1.get_sum('replica') - comp_2.get_sum('replica')) < 6):
        return 'Réplica'

      max_num = max(comp_1.get_sum('replica'), comp_2.get_sum('replica'))

      self.winner = comp_1.name if max_num == comp_1.get_total() else comp_2.name
      self.save(update_fields=['winner'])

      return self.winner

    # Normal case
    if (comp_1.get_total() == comp_2.get_total()
        or abs(comp_1.get_total() - comp_2.get_total()) < 6):
      return 'Réplica'

    max_num = max(comp_1.get_total(), comp_2.get_total())

    self.winner = comp_1.name if max_num == comp_1.get_total() else comp_2.name
    self.save(update_fields=['winner'])

    return self.winner
