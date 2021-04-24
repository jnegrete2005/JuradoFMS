from django.contrib import admin

from .models import Competitor, VotingPoll

# Register your models here.
@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
  list_display = (
    'id', 'name', 'easy', 'hard', 'tematicas_1', 'tematicas_2', 'random_score', 'min1', 'min2', 'deluxe', 'replica'
  )


@admin.register(VotingPoll)
class VotingPollAdmin(admin.ModelAdmin):
  list_display = ('id', 'comp_1', 'comp_2', 'winner', 'rep_counter')
