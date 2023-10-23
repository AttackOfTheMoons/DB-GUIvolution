from enum import Enum
from typing import Union

from pydantic import BaseModel, field_validator
from pydantic_core.core_schema import ValidationInfo


class ColumnType(str, Enum):
    INTEGER = "INTEGER"
    FLOAT = "FLOAT"
    TEXT = "TEXT"
    VARCHAR = "VARCHAR"
    BOOL = "BOOL"
    DATE = "DATE"
    TIMESTAMP = "TIMESTAMP"
    UUID = "UUID"
    EMAIL = "EMAIL"
    IP_ADDRESS = "IP_ADDRESS"
    ENUM = "ENUM"
    DECIMAL = "DECIMAL"
    OTHER = "OTHER"


class ComparisonTypes(str, Enum):
    EQUAL = "="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    LESS_THAN = "<"
    GREATER_THAN_OR_EQUAL = ">="
    LESS_THAN_OR_EQUAL = "<="
    PREFIX = "PREFIX"
    SUFFIX = "SUFFIX"
    REGEX = "REGEX"
    BEFORE = "BEFORE"
    AFTER = "AFTER"
    DURING = "DURING"
    LIKE = "LIKE"


ALLOWED_COMPARISONS = {
    ColumnType.INTEGER: [
        ComparisonTypes.GREATER_THAN,
        ComparisonTypes.LESS_THAN,
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.GREATER_THAN_OR_EQUAL,
        ComparisonTypes.LESS_THAN_OR_EQUAL,
    ],
    ColumnType.FLOAT: [
        ComparisonTypes.GREATER_THAN,
        ComparisonTypes.LESS_THAN,
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.GREATER_THAN_OR_EQUAL,
        ComparisonTypes.LESS_THAN_OR_EQUAL,
    ],
    ColumnType.TEXT: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.PREFIX,
        ComparisonTypes.SUFFIX,
        ComparisonTypes.REGEX,
    ],
    ColumnType.VARCHAR: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.PREFIX,
        ComparisonTypes.SUFFIX,
        ComparisonTypes.REGEX,
    ],
    ColumnType.BOOL: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
    ],
    ColumnType.DATE: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.BEFORE,
        ComparisonTypes.AFTER,
        ComparisonTypes.DURING,
    ],
    ColumnType.TIMESTAMP: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.BEFORE,
        ComparisonTypes.AFTER,
        ComparisonTypes.DURING,
    ],
    ColumnType.UUID: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
    ],
    ColumnType.EMAIL: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.PREFIX,
        ComparisonTypes.SUFFIX,
        ComparisonTypes.REGEX,
    ],
    ColumnType.IP_ADDRESS: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.PREFIX,
        ComparisonTypes.SUFFIX,
        ComparisonTypes.REGEX,
    ],
    ColumnType.ENUM: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
    ],
    ColumnType.DECIMAL: [
        ComparisonTypes.GREATER_THAN,
        ComparisonTypes.LESS_THAN,
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
        ComparisonTypes.GREATER_THAN_OR_EQUAL,
        ComparisonTypes.LESS_THAN_OR_EQUAL,
    ],
    # For any other types not explicitly defined, allow only "=" and "!="
    ColumnType.OTHER: [
        ComparisonTypes.EQUAL,
        ComparisonTypes.NOT_EQUAL,
    ],
}


class WhereStmt(BaseModel):
    column: str
    column_type: ColumnType
    compared_value: Union[str, int, float, bool]
    comparator: str
    # required: bool

    @field_validator("compared_value")
    def validate_value(
        cls, compared_value: Union[str, int, float, bool], info: ValidationInfo
    ) -> Union[str, int, float, bool]:
        column_type = info.data.get("column_type")
        field = info.field_name
        if column_type == ColumnType.INTEGER:
            if not isinstance(compared_value, int):
                raise ValueError(f"{field} must be an integer")
        elif column_type == ColumnType.FLOAT:
            if not isinstance(compared_value, (int, float)):
                raise ValueError(f"{field} must be a number")
        elif column_type in (ColumnType.TEXT, ColumnType.VARCHAR):
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string")
        elif column_type == ColumnType.BOOL:
            if not isinstance(compared_value, bool):
                raise ValueError(f"{field} must be a boolean")
        elif column_type == ColumnType.DATE:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (date)")
        elif column_type == ColumnType.TIMESTAMP:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (timestamp)")
        elif column_type == ColumnType.UUID:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (UUID)")
        elif column_type == ColumnType.EMAIL:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (email)")
        elif column_type == ColumnType.IP_ADDRESS:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (IP address)")
        elif column_type == ColumnType.ENUM:
            if not isinstance(compared_value, str):
                raise ValueError(f"{field} must be a string (enum)")
        elif column_type == ColumnType.DECIMAL:
            if not isinstance(compared_value, (int, float)):
                raise ValueError(f"{field} must be a number (decimal)")
        elif column_type == ColumnType.OTHER:
            # Handle other types, if needed
            pass
        return compared_value

    @field_validator("comparator")
    def validate_comparison_type(
        cls, comparison_type: str, info: ValidationInfo
    ) -> str:
        column_type = info.data["column_type"]

        if comparison_type not in ALLOWED_COMPARISONS[column_type.upper()]:
            raise ValueError(
                f"Invalid comparison for column type {column_type}: {comparison_type}"
            )
        if comparison_type == ComparisonTypes.REGEX:
            return "REGEXP"
        elif comparison_type == ComparisonTypes.PREFIX:
            info.data["compared_value"] = f"{info.data.get('compared_value')}%"
            return "LIKE"
        elif comparison_type == ComparisonTypes.SUFFIX:
            info.data["compared_value"] = f"%{info.data.get('compared_value')}"
            return "LIKE"
        elif comparison_type == ComparisonTypes.BEFORE:
            return "<"
        elif comparison_type == ComparisonTypes.AFTER:
            return ">"
        elif comparison_type == ComparisonTypes.DURING:
            return "="
        else:
            return str(comparison_type)
