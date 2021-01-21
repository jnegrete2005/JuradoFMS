from graphene import Schema

from .graphql.query import Query

schema = Schema(query=Query)