from fastapi import APIRouter, Depends
from sqlalchemy.dialects.postgresql.base import PGInspector

from database import get_inspector
from gpt import generate_sql_query
from models import QueryRequestModel, QueryResponseModel

router = APIRouter()


@router.post("/{flavor}/generate_sql", response_model=QueryResponseModel)
def generate_sql_endpoint(
    flavor: str,
    request: QueryRequestModel,
    inspector: PGInspector = Depends(get_inspector),
) -> QueryResponseModel:
    return generate_sql_query(
        request.user_input,
        flavor,
        inspector=inspector,
        conversation_history=request.conversation_history or [],
    )
