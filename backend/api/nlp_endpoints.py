from database import get_inspector
from fastapi import APIRouter, Body, Depends
from gpt.gpt_service import generate_sql_query
from models.request_models import QueryRequestModel, QueryResponseModel
from sqlalchemy.dialects.postgresql.base import PGInspector

router = APIRouter()


@router.post("/{flavor}/generate_sql", response_model=QueryResponseModel)
def generate_sql_endpoint(
    flavor: str,
    request: QueryRequestModel = Body(...),
    inspector: PGInspector = Depends(get_inspector),
) -> QueryResponseModel:
    return QueryResponseModel(
        sql_query=generate_sql_query(request.user_input, flavor, inspector=inspector)
    )
