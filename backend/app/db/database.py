from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:Postgre@localhost:5432/financial_research"

engine = create_engine(
    DATABASE_URL,
    echo=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.models.database_models import (
    Company,
    ResearchRun,
    AgentResult,
    FinancialMetric,
    Source,
)

Base.metadata.create_all(bind=engine)        