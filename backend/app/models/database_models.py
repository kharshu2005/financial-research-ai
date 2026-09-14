from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.db.database import Base


# ============================================================
# COMPANY
# ============================================================

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    research_runs = relationship(
        "ResearchRun",
        back_populates="company",
        cascade="all, delete-orphan",
    )


# ============================================================
# RESEARCH RUN
# ============================================================

class ResearchRun(Base):
    __tablename__ = "research_runs"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    query = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50),
        default="completed"
    )

    final_report = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    company = relationship(
        "Company",
        back_populates="research_runs"
    )

    agent_results = relationship(
        "AgentResult",
        back_populates="research_run",
        cascade="all, delete-orphan"
    )
# ============================================================
# AGENT RESULTS
# ============================================================

class AgentResult(Base):
    __tablename__ = "agent_results"

    id = Column(Integer, primary_key=True, index=True)

    research_run_id = Column(
        Integer,
        ForeignKey("research_runs.id"),
        nullable=False,
    )

    agent_name = Column(
        String(100),
        nullable=False,
    )

    result = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    research_run = relationship(
        "ResearchRun",
        back_populates="agent_results",
    )


# ============================================================
# FINANCIAL METRICS
# ============================================================

class FinancialMetric(Base):
    __tablename__ = "financial_metrics"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False,
    )

    metric_name = Column(
        String(100),
        nullable=False,
    )

    value = Column(
        Float,
        nullable=True,
    )

    unit = Column(
        String(50),
        nullable=True,
    )

    period = Column(
        String(50),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


# ============================================================
# SOURCES
# ============================================================

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)

    research_run_id = Column(
        Integer,
        ForeignKey("research_runs.id"),
        nullable=False,
    )

    source_type = Column(
        String(50),
        nullable=False,
    )

    title = Column(
        String(500),
        nullable=True,
    )

    url = Column(
        Text,
        nullable=True,
    )

    page_number = Column(
        Integer,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )