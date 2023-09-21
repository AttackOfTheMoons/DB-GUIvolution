from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create a FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000",
]

# Define the SQLAlchemy database engine
DATABASE_URL = "postgresql://username:password@localhost/dbname"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a SQLAlchemy session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define SQLAlchemy models (you can import your models from models.py)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a simple "Hello, World!" endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
