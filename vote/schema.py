from graphene import Schema

from .graphql.query import Query
from .graphql.mutations import Mutation

schema = Schema(query=Query, mutation=Mutation)