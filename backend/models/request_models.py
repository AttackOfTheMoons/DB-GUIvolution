from typing import Any, Dict

from pydantic import BaseModel


class InsertDataRequest(BaseModel):
    table_name: str
    values: Dict[str, Any]


class QueryRequestModel(BaseModel):
    user_input: str


class QueryResponseModel(BaseModel):
    sql_query: str
