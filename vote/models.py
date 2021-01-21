from django.db import models

# Create your models here.
class Competitor(models.Model):
  """
  Competitor model object
  """
  name = models.CharField(max_length=20)
  easy = models.CharField(max_length=27, null=True, blank=True)
  hard = models.CharField(max_length=27, null=True, blank=True)
  tematicas = models.CharField(max_length=21, null=True, blank=True)
  random = models.CharField(max_length=27, null=True, blank=True)
  minuto1 = models.CharField(max_length=27, null=True, blank=True)
  minuto2 = models.CharField(max_length=27, null=True, blank=True)
  deluxe = models.CharField(max_length=42, null=True, blank=True)
  replica = models.CharField(max_length=27, null=True, blank=True)

  def to_list(self, mode):
    """
    Will convert the list string value to an integer list
    """
    field = self.__dict__[mode]

    if field == None:
      if mode == 'tematicas':
        return [9 for i in range(7)]
      elif mode == 'deluxe':
        return [9 for i in range(14)]
      else:
        return [9 for i in range(9)]

    return list(map(int, str(field).replace('[', '').replace(']', '').split(', ')))

  def to_list_end(self, mode):
    """
    For ignoring the 9s when adding up values
    """
    def to_int(i):

      return 0 if i == '9' else int(i)

    field = self.__dict__[mode]

    if field == None:
      if mode == 'tematicas':
        return [0 for i in range(7)]
      elif mode == 'deluxe':
        return [0 for i in range(14)]
      else:
        return [0 for i in range(9)]


    return list(map(to_int, str(field).replace('[', '').replace(']', '').split(', ')))

  def get_total(self):
    """
    Will give you the total of the competitor
    """
    return (sum(self.to_list_end('easy')) + 
            sum(self.to_list_end('hard')) + 
            sum(self.to_list_end('tematicas')) +
            sum(self.to_list_end('random')) +
            sum(self.to_list_end('minuto1')) +
            sum(self.to_list_end('minuto2')) +
            sum(self.to_list_end('deluxe')))

  def __str__(self):
    return self.name


class VotingPoll(models.Model):
  """
  VotingPoll model object
  """
  
  comp_1 = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='comp_1')
  comp_2 = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='comp_2')

  def __str__(self):
    return f'{self.competitor_1} vs {self.competitor_2}'

  def get_winner(self):
    """
    Will return the winner, or replica
    """
    comp_1 = self.comp_1
    comp_2 = self.comp_2

    if replica:
      maxi = max(sum(comp_1.to_list_end('replica')), sum(comp_2.to_list_end('replica')))
      
      if ((maxi == sum(comp_1.to_list_end('replica')) and maxi == sum(comp_2.to_list_end('replica')) 
        or (abs(sum(comp_1.to_list_end('replica')) - sum(comp_2.to_list_end('replica'))) < 6))):
        return 'Réplica'

      return comp_1 if maxi == sum(comp_1.to_list_end('replica')) else comp_2


    maxi = max(comp_1.get_total(), comp_2.get_total())

    if ((maxi == comp_1.get_total() and maxi == comp_2.get_total()) 
      or (abs(comp_1.get_total() - comp_2.get_total()) < 6)):
      return 'Réplica'

    return comp_1 if maxi == comp_1.get_total() else comp_2
