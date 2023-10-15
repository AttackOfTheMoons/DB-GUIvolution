from typing import Generator

from sqlalchemy import Engine, Inspector, create_engine, inspect
from sqlalchemy.orm import Session, sessionmaker

from core import env

try:
    DATABASE_URL = f"postgresql://{env['POSTGRES_USER']}:{env['POSTGRES_PASSWORD']}@db/{env['POSTGRES_DB']}"
except KeyError as e:
    raise EnvironmentError(f"Missing environment variable: {e.args[0]}")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)


def get_engine() -> Engine:
    return engine


def get_inspector() -> Inspector:
    inspector = inspect(engine)
    return inspector


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
