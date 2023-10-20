from fastapi import APIRouter, Body, Depends
from sqlalchemy import Inspector

from database import get_inspector
from gpt import generate_sql_query
from models import QueryRequestModel, QueryResponseModel

router = APIRouter()


@router.post("/{flavor}/generate_sql", response_model=QueryResponseModel)
def generate_sql_endpoint(
    flavor: str,
    request: QueryRequestModel = Body(...),
    inspector: Inspector = Depends(get_inspector),
) -> QueryResponseModel:
    return QueryResponseModel(
        sql_query=generate_sql_query(request.user_input, flavor, inspector=inspector)
    )
