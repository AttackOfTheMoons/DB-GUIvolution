from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import env
from database_endpoint import router as database_router

GPT_API_KEY = env.get("GPT_API_KEY")

if GPT_API_KEY is None:
    raise EnvironmentError("Missing environment variable: GPT_API_KEY")

origins = [
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router, prefix='')
