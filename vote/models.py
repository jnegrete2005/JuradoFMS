from django.db import models
from django.contrib.postgres.fields import ArrayField 

# Create your models here.
class Competitor(models.Model):
  """
  Competitor model object
  """
  # Create the choices
  PERSONAJES = 0
  OBJETOS = 1
  IMAGENES = 2
  TERMINACIONES = 3
  ACTUALIDAD = 4
  CHOICES = (
    (PERSONAJES, 'Personajes contrapuestos'),
    (OBJETOS, 'Objetos'),
    (IMAGENES, 'Imágenes vaiadas'),
    (TERMINACIONES, 'Terminaciones'),
    (ACTUALIDAD, 'Temática de actualidad')
  )

  name = models.CharField(max_length=20)
  easy = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Easy Mode')
  hard = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Hard Mode')
  tematicas = ArrayField(models.PositiveSmallIntegerField(), size=7, null=True, blank=True, verbose_name='Tematicas')
  random_score = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Random Mode')
  min1 = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 1')
  min2 = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='minuto 2')
  deluxe = ArrayField(models.PositiveSmallIntegerField(), size=14, null=True, blank=True, verbose_name='Deluxe')
  replica = ArrayField(models.PositiveSmallIntegerField(), size=9, null=True, blank=True, verbose_name='Replica')

  def get_sum(self, mode):
    if mode == 'name':
      raise NameError(f'mode can\'t be equal to {mode}')

    i = 0 

    for j in self.__dict__[mode]:
      if j != 9:
        i += j

    return i

  def get_total(self):
    """
    Will give you the total of the competitor (excluding replica)
    """
    return (self.get_sum('easy') + 
            self.get_sum('hard') + 
            self.get_sum('tematicas') +
            self.get_sum('random_score') +
            self.get_sum('min1') +
            self.get_sum('min2') +
            self.get_sum('deluxe'))

  def __str__(self):
    return self.name


class VotingPoll(models.Model):
  """
  VotingPoll model object
  """
  
  comp_1 = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='comp_1')
  comp_2 = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='comp_2')

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

      return comp_1 if max_num == comp_1 else comp_2

    # Normal case
    if (comp_1.get_total() == comp_2.get_total() 
        or abs(comp_1.get_total() - comp_2.get_total()) < 6):
      return 'Réplica'

    max_num = max(comp_1.get_total(), comp_2.get_total())

    return comp_1 if max_num == comp_1.get_total() else comp_2
