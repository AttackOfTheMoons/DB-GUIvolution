from http import HTTPStatus
from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import Session
from sqlglot import condition, select

from models import Node, NodeType, SQLQuery, SQLQueryResult, WhereStmt


# TODO: AND conditions is the whole where support right now.
def process_query(db: Session, nodes: List[Node], flavor: str) -> SQLQueryResult:
    selects: List[str] = []
    from_table: Optional[str] = None
    where = None
    for node in nodes:
        if node.type == NodeType.SELECT:
            assert isinstance(node.value, list)
            selects.extend(node.value)
        elif node.type == NodeType.FROM:
            if from_table is None:
                from_table = str(node.value)
            else:
                raise HTTPException(
                    status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    detail="Multiple FROM nodes are not allowed.",
                )
        elif node.type == NodeType.WHERE:
            where_stmt = node.value
            assert isinstance(where_stmt, WhereStmt)
            value = (
                f"'{where_stmt.compared_value}'"
                if isinstance(where_stmt.compared_value, str)
                else where_stmt.compared_value
            )
            where_str = f"{where_stmt.column} {where_stmt.comparator} {value}"
            if where is None:
                where = condition(where_str)
            else:
                where = where.and_(where_str)

    if from_table is None:
        raise HTTPException(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            detail="No FROM node found in the SQL query.",
        )
    select_stmt = selects if selects else ("*",)
    uncompleted_sql = select(*select_stmt).from_(from_table)
    if where:
        uncompleted_sql = uncompleted_sql.where(where)

    compiled_sql = uncompleted_sql.sql("postgres")

    try:
        result = db.execute(text(compiled_sql))
    except ProgrammingError as err:
        error_message = str(err)
        if "relation" in error_message and "does not exist" in error_message:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail=f"Table: {from_table} not found",
            )
        else:
            raise err

    return SQLQueryResult(
        keys=[str(key) for key in result.keys()],
        data=[tuple(row) for row in result.fetchall()],
        sql=SQLQuery(sql_query=uncompleted_sql.sql(flavor, pretty=True), flavor=flavor),
    )
