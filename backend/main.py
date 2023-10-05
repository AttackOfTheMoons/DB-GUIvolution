from api import router as database_router
from core import env
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.database_endpoint import router as database_router
from backend.api.nlp_endpoints import router as nlp_router

origins = ["http://localhost:3000"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router, prefix="")
app.include_router(nlp_router, prefix="/api/nlp")
