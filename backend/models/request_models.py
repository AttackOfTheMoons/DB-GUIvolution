from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, field_validator
from pydantic_core.core_schema import ValidationInfo

from .response_models import SQLColumn
from .where_node_model import WhereStmt

# NLP Models


class QueryRequestModel(BaseModel):
    user_input: str


# Node-based Models


class InsertDataRequest(BaseModel):
    table_name: str
    values: Dict[str, Any]


class NodeType(str, Enum):
    FROM = "from"
    SELECT = "select"
    WHERE = "where"


class Node(BaseModel):
    id: str
    type: NodeType
    value: Union[List[SQLColumn], str, WhereStmt]

    @field_validator("value")
    def validate_value_based_on_type(
        cls,
        value: Union[List[str], str, WhereStmt],
        info: ValidationInfo,
    ) -> Union[List[str], str, WhereStmt]:
        node_type = info.data["type"]
        if node_type == NodeType.SELECT:
            if not isinstance(value, list):
                raise ValueError("SELECT should be a list of columns")
            elif not value:
                raise ValueError("SELECT list cannot be empty")
            elif any(not isinstance(item, SQLColumn) for item in value):
                raise ValueError("SELECT should be a list of columns")
        elif node_type == NodeType.FROM:
            if not isinstance(value, str):
                raise ValueError("FROM should be a string (table name)")
            elif (
                not value.strip()
            ):  # Check if the string is empty or contains only whitespace
                raise ValueError("FROM cannot be an empty string")
        elif node_type == NodeType.WHERE:
            if not isinstance(value, WhereStmt):
                raise ValueError(
                    "WHERE should be in the format: {column, comparator, compared_value}"
                )
        return value


class SQLQueryAST(BaseModel):
    nodes: List[Node]
    flavor: Optional[str]
