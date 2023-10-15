from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Engine, MetaData, Table
from sqlalchemy.dialects.postgresql.base import PGInspector
from sqlalchemy.exc import CompileError
from sqlalchemy.orm import Session

from database import get_db, get_engine, get_inspector
from models import InsertDataRequest

router = APIRouter()


@router.get("/tables")
def get_table(inspector: PGInspector = Depends(get_inspector)) -> List:
    return inspector.get_table_names()


@router.get("/tables/{table_name}/columns")
def get_columns(
    table_name: str, inspector: PGInspector = Depends(get_inspector)
) -> List:
    return [
        {
            "name": col["name"],
            "type": col["type"].__visit_name__,
            "nullable": col["nullable"],
        }
        for col in inspector.get_columns(table_name)
    ]


@router.post("/insert")
def create_table(
    request: InsertDataRequest,
    db: Session = Depends(get_db),
    inspector: PGInspector = Depends(get_inspector),
    engine: Engine = Depends(get_engine),
) -> None:
    if request.table_name not in inspector.get_table_names():
        raise HTTPException(
            status_code=404, detail=f"Table {request.table_name} not found."
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
