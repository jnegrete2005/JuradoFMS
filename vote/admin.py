from django.contrib import admin

from .models import Competitor, VotingPoll

# Register your models here.
@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
  list_display = (
    'id', 'name', 'easy', 'hard', 'tematicas', 'random_mode', 'random_score', 'min1', 'min2', 'deluxe', 'replica'
  )


@admin.register(VotingPoll)
class VotingPollAdmin(admin.ModelAdmin):
  list_display = ( 'comp_1', 'comp_2' )
