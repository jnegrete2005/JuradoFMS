from django.contrib import admin

from .models import Competitor, VotingPoll

# Register your models here.
class CompetitorAdmin(admin.ModelAdmin):
  list_display = (
    'id', 'name', 'easy', 'hard', 'tematicas', 'random_mode', 'random_score', 'min1', 'min2', 'deluxe', 'replica'
  )

class VotingPollAdmin(admin.ModelAdmin):
  list_display = ( 'comp_1', 'comp_2' )


admin.site.register(Competitor, CompetitorAdmin)
admin.site.register(VotingPoll, VotingPollAdmin)
