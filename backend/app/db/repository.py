from sqlalchemy.orm import Session

from app.models.database_models import (
    Company,
    ResearchRun,
    AgentResult,
    FinancialMetric,
    Source,
)


# ============================================================
# COMPANY
# ============================================================

def get_or_create_company(
    db: Session,
    ticker: str,
    name: str,
):
    ticker = ticker.upper().strip()

    company = (
        db.query(Company)
        .filter(Company.ticker == ticker)
        .first()
    )

    if company:
        return company

    company = Company(
        ticker=ticker,
        name=name,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


# ============================================================
# RESEARCH RUN
# ============================================================

def create_research_run(
    db: Session,
    company_id: int,
    query: str,
):
    research_run = ResearchRun(
        company_id=company_id,
        query=query,
        status="running",
    )

    db.add(research_run)
    db.commit()
    db.refresh(research_run)

    return research_run


def update_research_run_status(
    db: Session,
    research_run_id: int,
    status: str,
):
    research_run = (
        db.query(ResearchRun)
        .filter(ResearchRun.id == research_run_id)
        .first()
    )

    if research_run:
        research_run.status = status
        db.commit()
        db.refresh(research_run)

    return research_run


# ============================================================
# AGENT RESULTS
# ============================================================

def save_agent_result(
    db: Session,
    research_run_id: int,
    agent_name: str,
    result: str,
):
    agent_result = AgentResult(
        research_run_id=research_run_id,
        agent_name=agent_name,
        result=result,
    )

    db.add(agent_result)
    db.commit()
    db.refresh(agent_result)

    return agent_result


# ============================================================
# FINANCIAL METRICS
# ============================================================

def save_financial_metric(
    db: Session,
    company_id: int,
    metric_name: str,
    value: float,
    unit: str | None = None,
    period: str | None = None,
):
    metric = FinancialMetric(
        company_id=company_id,
        metric_name=metric_name,
        value=value,
        unit=unit,
        period=period,
    )

    db.add(metric)
    db.commit()
    db.refresh(metric)

    return metric


# ============================================================
# SOURCES
# ============================================================

def save_source(
    db: Session,
    research_run_id: int,
    source_type: str,
    title: str | None = None,
    url: str | None = None,
    page_number: int | None = None,
):
    source = Source(
        research_run_id=research_run_id,
        source_type=source_type,
        title=title,
        url=url,
        page_number=page_number,
    )

    db.add(source)
    db.commit()
    db.refresh(source)

    return source


# ============================================================
# GET RESEARCH RUN
# ============================================================

def get_research_run(
    db: Session,
    research_run_id: int,
):
    return (
        db.query(ResearchRun)
        .filter(ResearchRun.id == research_run_id)
        .first()
    )


# ============================================================
# GET AGENT RESULTS
# ============================================================

def get_agent_results(
    db: Session,
    research_run_id: int,
):
    return (
        db.query(AgentResult)
        .filter(
            AgentResult.research_run_id == research_run_id
        )
        .all()
    )
# ============================================================
# GET COMPANY
# ============================================================

def get_company(
    db: Session,
    ticker: str,
):
    return (
        db.query(Company)
        .filter(Company.ticker == ticker.upper().strip())
        .first()
    )


# ============================================================
# GET FINANCIAL METRICS
# ============================================================

def get_financial_metrics(
    db: Session,
    company_id: int,
):
    return (
        db.query(FinancialMetric)
        .filter(FinancialMetric.company_id == company_id)
        .all()
    )

import json
def save_final_report(
    db: Session,
    research_run_id: int,
    report: dict,
):
    research_run = (
        db.query(ResearchRun)
        .filter(
            ResearchRun.id == research_run_id
        )
        .first()
    )

    if not research_run:
        raise ValueError(
            f"Research run {research_run_id} not found"
        )

    research_run.final_report = json.dumps(
        report,
        default=str
    )

    db.commit()
    db.refresh(research_run)

    return research_run