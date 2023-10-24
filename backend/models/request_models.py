from enum import Enum
from typing import Any, Dict, List, Union

from pydantic import BaseModel, field_validator
from pydantic_core.core_schema import ValidationInfo


class InsertDataRequest(BaseModel):
    table_name: str
    values: Dict[str, Any]


class QueryRequestModel(BaseModel):
    user_input: str
    conversation_history: List[Dict[str, str]]


class NodeType(str, Enum):
    FROM = "from"
    SELECT = "select"
    WHERE = "where"


class Node(BaseModel):
    id: str
    type: NodeType
    value: Union[List[str], str]

    @field_validator("value")
    def validate_value_based_on_type(
        cls, value: Union[List[str], str], info: ValidationInfo
    ) -> Union[List[str], str]:
        node_type = info.data["type"]
        if node_type == NodeType.SELECT:
            if not isinstance(value, list):
                raise ValueError("SELECT should be a list of column names")
            elif not value:
                raise ValueError("SELECT list cannot be empty")
            elif any(not isinstance(item, str) or not item.strip() for item in value):
                raise ValueError("All items in SELECT list should be non-empty strings")
        elif node_type == NodeType.FROM:
            if not isinstance(value, str):
                raise ValueError("FROM should be a string (table name)")
            elif (
                not value.strip()
            ):  # Check if the string is empty or contains only whitespace
                raise ValueError("FROM cannot be an empty string")
        elif node_type == NodeType.WHERE:
            if not isinstance(value, str):
                raise ValueError("WHERE should be a string (condition)")
            elif (
                not value.strip()
            ):  # Check if the string is empty or contains only whitespace
                raise ValueError("WHERE cannot be an empty string")
        return value


class SQLQueryAST(BaseModel):
    nodes: List[Node]
