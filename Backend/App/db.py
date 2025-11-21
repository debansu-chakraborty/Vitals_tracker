from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base # <-- ADDED IMPORT

# The 'check_same_thread=False' argument is crucial for SQLite with FastAPI.
DATABASE_URL = "sqlite:///./vitals.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for the ORM models to inherit
Base = declarative_base() # <-- ADDED DEFINITION

def get_db():
    """Dependency function to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()