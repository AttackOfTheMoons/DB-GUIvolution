from typing import Dict, Any

from pydantic import BaseModel


class InsertDataRequest(BaseModel):
    table_name: str
    values: Dict[str, Any]
