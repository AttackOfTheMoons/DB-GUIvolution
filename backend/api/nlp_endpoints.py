from fastapi import APIRouter, Body, Depends
from sqlalchemy.dialects.postgresql.base import PGInspector

from database import get_inspector
from gpt import generate_sql_query
from models import QueryRequestModel, QueryResponseModel

router = APIRouter()


@router.post("/{flavor}/generate_sql", response_model=QueryResponseModel)
def generate_sql_endpoint(
    flavor: str,
    request: QueryRequestModel = Body(...),
    inspector: PGInspector = Depends(get_inspector),
) -> QueryResponseModel:
    engineered_input, sql_query = generate_sql_query(
        request.user_input,
        flavor,
        inspector=inspector,
        conversation_history=request.conversation_history,
    )
    return QueryResponseModel(engineered_input=engineered_input, sql_query=sql_query)
