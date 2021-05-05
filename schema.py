from graphene import Schema
from vote.graphql.query import Query as VoteQuery
from vote.graphql.mutations import Mutation as VoteMutation

class Mutation(VoteMutation):
  pass

class Query(VoteQuery):
  pass

schema = Schema(query=Query, mutation=Mutation)