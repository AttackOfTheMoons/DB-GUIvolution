from http import HTTPStatus
from typing import List, Optional

from database import get_db, get_engine, get_inspector
from fastapi import APIRouter, Depends, HTTPException
from models import InsertDataRequest, NodeType, SQLQueryAST, SQLQueryResult
from sqlalchemy import Engine, Inspector, MetaData, Table, text
from sqlalchemy.exc import CompileError, ProgrammingError
from sqlalchemy.orm import Session
from sqlglot import select

router = APIRouter()


@router.get("/tables")
def get_table(inspector: Inspector = Depends(get_inspector)) -> List:
    return inspector.get_table_names()


@router.get("/tables/{table_name}/columns")
def get_columns(table_name: str, inspector: Inspector = Depends(get_inspector)) -> List:
    return [
        {
            "name": col["name"],
            "type": col["type"].__visit_name__,
            "nullable": col["nullable"],
        }
        for col in inspector.get_columns(table_name)
    ]


# TODO: WHERE query
# TODO: SUB-QUERIES?
@router.post("/queries/")
async def execute_sql_query(
    sql_query: SQLQueryAST, db: Session = Depends(get_db)
) -> SQLQueryResult:
    selects = []
    from_table: Optional[str] = None
    for node in sql_query.nodes:
        if node.type == NodeType.SELECT:
            selects.append(", ".join(node.value))
        elif node.type == NodeType.FROM:
            if from_table is None:
                from_table = str(node.value)
            else:
                raise HTTPException(
                    status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    detail="Multiple FROM nodes are not allowed.",
                )
    if from_table is None:
        raise HTTPException(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            detail="No FROM node found in the SQL query.",
        )
    select_stmt = ", ".join(selects) if selects else "*"
    compiled_sql = select(select_stmt).from_(from_table).sql("postgres")

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
        keys=result.keys(), data=[tuple(row) for row in result.fetchall()]
    )


@router.post("/insert")
def create_table(
    request: InsertDataRequest,
    db: Session = Depends(get_db),
    inspector: Inspector = Depends(get_inspector),
    engine: Engine = Depends(get_engine),
) -> None:
    if request.table_name not in inspector.get_table_names():
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f"Table {request.table_name} not found.",
        )

    metadata = MetaData()
    table = Table(request.table_name, metadata, autoload_with=engine)

    try:
        with db.begin():
            db.execute(table.insert().values(request.values))
    except CompileError as err:
        if str(err).startswith("Unconsumed column names:"):
            # This error happens if the request.values dict has column values not in the table.
            raise HTTPException(status_code=400, detail=f"Error: {err}")
        else:
            raise err
