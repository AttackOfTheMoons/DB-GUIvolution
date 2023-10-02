from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.database_endpoint import router as database_router

origins = [
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router, prefix="")
