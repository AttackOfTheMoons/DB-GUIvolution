from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Table, MetaData, Engine
from sqlalchemy.dialects.postgresql.base import PGInspector
from sqlalchemy.exc import CompileError
from sqlalchemy.orm import Session

from models.request_models import InsertDataRequest
from database import get_db, get_inspector, get_engine

router = APIRouter()


@router.post('/insert')
def create_table(request: InsertDataRequest, db: Session = Depends(get_db),
                 inspector: PGInspector = Depends(get_inspector),
                 engine: Engine = Depends(get_engine)):
    if request.table_name not in inspector.get_table_names():
        raise HTTPException(status_code=404, detail=f'Table {request.table_name} not found.')

    metadata = MetaData()
    table = Table(request.table_name, metadata, autoload_with=engine)

    try:
        with db.begin():
            db.execute(table.insert().values(request.values))
    except CompileError as err:
        if str(err).startswith("Unconsumed column names:"):
            # This error happens if the request.values dict has column values not in the table.
            raise HTTPException(status_code=400, detail=f'Error: {err}')
        else:
            raise err
