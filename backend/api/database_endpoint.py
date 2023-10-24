from http import HTTPStatus
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Engine, Inspector, MetaData, Table
from sqlalchemy.exc import CompileError
from sqlalchemy.orm import Session

from database import get_db, get_engine, get_inspector, process_query
from models import InsertDataRequest, SQLQueryAST, SQLQueryResult

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
    return process_query(db, sql_query.nodes, sql_query.flavor or "postgres")


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
