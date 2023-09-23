from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from database_endpoint import router as database_router
import os

# Get environment variables
GPT_API_KEY = os.environ.get("GPT_API_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL")

print("GPT_API_KEY:", GPT_API_KEY)

# Create a FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000",
]

# Define the SQLAlchemy database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router, prefix='')
