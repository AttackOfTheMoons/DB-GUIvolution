from typing import List

from pydantic import BaseModel


class SQLQuery(BaseModel):
    sql_query: str
    flavor: str


class SQLQueryResult(BaseModel):
    keys: List[str]
    data: List
    sql: SQLQuery


class QueryResponseModel(BaseModel):
    sql_query: str
