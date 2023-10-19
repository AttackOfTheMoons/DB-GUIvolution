from typing import List

from pydantic import BaseModel


class SQLQueryResult(BaseModel):
    keys: List[str]
    data: List
