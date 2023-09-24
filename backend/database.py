import os

from dotenv import dotenv_values
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

env = {
    **dotenv_values('.env'),
    **os.environ
}

try:
    DATABASE_URL = f"postgresql://{env['POSTGRES_USER']}:{env['POSTGRES_PASSWORD']}@db/{env['POSTGRES_DB']}"
except KeyError as e:
    raise EnvironmentError(f'Missing environment variable: {e.args[0]}')

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)


def get_engine():
    return engine


def get_inspector():
    inspector = inspect(engine)
    return inspector


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
