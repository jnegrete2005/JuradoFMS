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
  random_score = ArrayField(PositiveSmallIntegerField(), size=11, null=True, blank=True, verbose_name='Random Mode')
  min1 = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 1')
  min2 = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 2')
  deluxe = ArrayField(PositiveSmallIntegerField(), size=14, null=True, blank=True, verbose_name='Deluxe')
  replica = ArrayField(PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Replica')
  _list = [ 'easy', 'hard', 'tematicas_1', 'tematicas_2', 'random_score', 'min1', 'min2', 'deluxe', 'replica' ]

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
  rep_counter = PositiveSmallIntegerField(default=0)
  winner = CharField(max_length=20, null=True, blank=True)

  def __str__(self):
    return f'{self.comp_1} vs {self.comp_2}'
