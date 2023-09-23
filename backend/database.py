from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://username:password@localhost/dbname"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

inspector = inspect(engine)


def get_engine():
    return engine


def get_inspector():
    return inspector


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
