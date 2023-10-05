from fastapi import APIRouter, Body
from gpt.gpt_service import generate_sql_query
from pydantic import BaseModel

router = APIRouter()


# Define the request model for the POST request
class QueryRequestModel(BaseModel):
    user_input: str


# Define the response model for the POST request
class QueryResponseModel(BaseModel):
    sql_query: str


@router.post("/generate_sql", response_model=QueryResponseModel)
def generate_sql_endpoint(request: QueryRequestModel = Body(...)) -> QueryResponseModel:
    return {"sql_query": generate_sql_query(request.user_input)}
