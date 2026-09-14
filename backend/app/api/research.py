from app.services.redis_cache import (
    get_cached_result,
    set_cached_result,
)

from fastapi import APIRouter, HTTPException

from app.graph.workflow import financial_research_graph
from app.db.database import SessionLocal

from app.db.repository import (
    get_or_create_company,
    create_research_run,
    save_agent_result,
    update_research_run_status,
    save_financial_metric,
    save_source,
    save_final_report,
)

router = APIRouter(
    prefix="/api/research",
    tags=["Research Workflow"],
)


@router.get("/{ticker}")
async def run_research(ticker: str):
    ticker = ticker.strip().upper()
    cache_key = f"research:{ticker}"

    cached_result = get_cached_result(cache_key)

    if cached_result is not None:
        return {
            "success": True,
            "cached": True,
            "research_run_id": None,
            "data": cached_result,
        }

    db = SessionLocal()

    try:
        # ====================================================
        # 1. RUN THE LANGGRAPH WORKFLOW
        # ====================================================

        result = await financial_research_graph.ainvoke({
            "ticker": ticker,
            "errors": [],
        })

        # ====================================================
        # 2. GET COMPANY NAME
        # ====================================================

        company_data = result.get("company_data", {})

        company_name = (
            company_data.get("name")
            or company_data.get("company_name")
            or ticker
        )

        # ====================================================
        # 3. CREATE / GET COMPANY
        # ====================================================

        company = get_or_create_company(
            db=db,
            ticker=ticker,
            name=company_name,
        )

        # ====================================================
        # 4. CREATE RESEARCH RUN
        # ====================================================

        research_run = create_research_run(
            db=db,
            company_id=company.id,
            query=f"Analyze {ticker} based on financial performance, news, risks and developments.",
        )

        # ====================================================
        # 5. SAVE AGENT RESULTS
        # ====================================================

        agent_outputs = {
            "Company Research Agent": result.get(
                "company_data",
                {},
            ),
            "Financial Data Agent": result.get(
                "financial_data",
                {},
            ),
            "Financial Analysis Agent": result.get(
                "financial_analysis",
                {},
            ),
            "News & Developments Agent": result.get(
                "news_data",
                {},
            ),
            "Risk Analysis Agent": result.get(
                "risk_analysis",
                {},
            ),
            "Reviewer Agent": result.get(
                "reviewer_result",
                {},
            ),
        }

        for agent_name, agent_result in agent_outputs.items():

            # Convert dictionaries/lists to text
            if isinstance(agent_result, (dict, list)):
                agent_result = str(agent_result)

            save_agent_result(
                db=db,
                research_run_id=research_run.id,
                agent_name=agent_name,
                result=agent_result,
            )
        # ====================================================
        # 6. SAVE FINANCIAL METRICS
        # ====================================================

        financial_data = result.get(
            "financial_data",
            {},
        )

        financial_data_inner = financial_data.get(
            "financial_data",
            {},
        )

        annual_data = financial_data_inner.get(
            "annual",
            {},
        )

        balance_sheet = financial_data_inner.get(
            "balance_sheet",
            {},
        )

        # ----------------------------------------------------
        # Annual metrics
        # ----------------------------------------------------

        for metric_name, records in annual_data.items():

            if not records:
                continue

            latest = records[0]

            value = latest.get("value")

            if value is None:
                continue

            save_financial_metric(
                db=db,
                company_id=company.id,
                metric_name=metric_name,
                value=float(value),
                unit="USD",
                period=str(latest.get("fy")),
            )

        # ----------------------------------------------------
        # Balance sheet metrics
        # ----------------------------------------------------

        for metric_name, metric_data in balance_sheet.items():

            if not metric_data:
                continue

            value = metric_data.get("value")

            if value is None:
                continue

            save_financial_metric(
                db=db,
                company_id=company.id,
                metric_name=metric_name,
                value=float(value),
                unit="USD",
                period=metric_data.get("date"),
            )
        # ====================================================
        # 7. SAVE NEWS SOURCES
        # ====================================================

        news_data = result.get(
            "news_data",
            {},
        )

        articles = news_data.get(
            "articles",
            []
        )

        for article in articles:

            save_source(
                db=db,
                research_run_id=research_run.id,
                source_type="news",
                title=article.get("title"),
                url=article.get("url"),
            )    
        # ====================================================
        # 8. UPDATE STATUS
        # ====================================================
        final_report = result.get(
            "final_report",
            {}
        )

        save_final_report(
             db=db,
             research_run_id=research_run.id,
             report=final_report,
        )
        update_research_run_status(
            db=db,
            research_run_id=research_run.id,
            status="completed",
        )

        set_cached_result(
            key=cache_key,
            value=result,
            expire_seconds=1800,
        )

        return {
            "success": True,
            "cached": False,
            "research_run_id": research_run.id,
            "data": result,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Research workflow failed: {exc}",
        )

    finally:
        db.close()