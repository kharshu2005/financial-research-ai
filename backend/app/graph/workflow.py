from langgraph.graph import StateGraph, START, END

from app.state import FinancialResearchState

from app.services.sec import get_company_by_ticker
from app.services.financial_data import get_financial_data
from app.services.financial_analysis import analyze_company_financials
from app.services.news import get_company_news
from app.services.risk_analysis import build_risk_analysis
from app.services.reviewer import review_analysis
from app.services.final_report import build_final_report


# ============================================================
# AGENT 1 — COMPANY RESEARCH
# ============================================================

async def company_research_agent(state: FinancialResearchState):
    ticker = state["ticker"]

    try:
        company = await get_company_by_ticker(ticker)

        return {
            "company_data": company
        }

    except Exception as exc:
        return {
            "errors": [
                f"Company Research Agent error: {str(exc)}"
            ]
        }


# ============================================================
# AGENT 2 — FINANCIAL DATA
# ============================================================

async def financial_data_agent(state: FinancialResearchState):
    ticker = state["ticker"]

    try:
        data = await get_financial_data(ticker)

        return {
            "financial_data": data
        }

    except Exception as exc:
        return {
            "errors": [
                f"Financial Data Agent error: {str(exc)}"
            ]
        }


# ============================================================
# AGENT 3 — FINANCIAL ANALYSIS
# ============================================================

async def financial_analysis_agent(state: FinancialResearchState):
    ticker = state["ticker"]

    try:
        analysis = await analyze_company_financials(ticker)

        return {
            "financial_analysis": analysis
        }

    except Exception as exc:
        return {
            "errors": [
                f"Financial Analysis Agent error: {str(exc)}"
            ]
        }


# ============================================================
# AGENT 4 — NEWS & DEVELOPMENTS
# ============================================================

async def news_agent(state: FinancialResearchState):
    ticker = state["ticker"]

    try:
        company_data = state.get("company_data", {})

        company_name = (
            company_data.get("company_name")
            or company_data.get("name")
        )

        news = await get_company_news(
            ticker=ticker,
            company_name=company_name,
        )

        return {
            "news_data": news
        }

    except Exception as exc:
        return {
            "errors": [
                f"News & Developments Agent error: {str(exc)}"
            ]
        }
# ============================================================
# AGENT 5 — RISK ANALYSIS
# ============================================================

async def risk_analysis_agent(state: FinancialResearchState):

    try:
        financial_analysis = state.get(
            "financial_analysis",
            {}
        )

        news_data = state.get(
            "news_data",
            {}
        )

        risk_analysis = build_risk_analysis(
            financial_analysis=financial_analysis,
            news_data=news_data,
        )

        return {
            "risk_analysis": risk_analysis
        }

    except Exception as exc:
        return {
            "errors": [
                f"Risk Analysis Agent error: {str(exc)}"
            ]
        }
# ============================================================
# AGENT 6 — REVIEWER
# ============================================================

async def reviewer_agent(state: FinancialResearchState):

    try:
        review = review_analysis(
            company_data=state.get("company_data", {}),
            financial_data=state.get("financial_data", {}),
            financial_analysis=state.get(
                "financial_analysis",
                {}
            ),
            news_data=state.get("news_data", {}),
            risk_analysis=state.get(
                "risk_analysis",
                {}
            ),
        )

        return {
            "reviewer_result": review
        }

    except Exception as exc:
        return {
            "errors": [
                f"Reviewer Agent error: {str(exc)}"
            ]
        }

# ============================================================
# AGENT 7 — FINAL REPORT
# ============================================================

async def final_report_agent(state: FinancialResearchState):

    try:

        report = build_final_report(
            company_data=state.get(
                "company_data",
                {},
            ),

            financial_data=state.get(
                "financial_data",
                {},
            ),

            financial_analysis=state.get(
                "financial_analysis",
                {},
            ),

            news_data=state.get(
                "news_data",
                {},
            ),

            risk_analysis=state.get(
                "risk_analysis",
                {},
            ),

            reviewer_result=state.get(
                "reviewer_result",
                {},
            ),
        )

        return {
            "final_report": report
        }

    except Exception as exc:

        return {
            "errors": [
                f"Final Report Agent error: {str(exc)}"
            ]
        }
    
# ============================================================
# BUILD LANGGRAPH WORKFLOW
# ============================================================

def build_financial_research_graph():

    graph = StateGraph(FinancialResearchState)

    # Register agents
    graph.add_node(
        "company_research_agent",
        company_research_agent
    )

    graph.add_node(
        "financial_data_agent",
        financial_data_agent
    )

    graph.add_node(
        "financial_analysis_agent",
        financial_analysis_agent
    )

    graph.add_node(
        "news_agent",
        news_agent
    )

    graph.add_node(
        "risk_analysis_agent",
        risk_analysis_agent
    )

    graph.add_node(
        "reviewer_agent",
        reviewer_agent
    )

    graph.add_node(
       "final_report_agent",
       final_report_agent
    )

    # Connect workflow
    graph.add_edge(
        START,
        "company_research_agent"
    )

    graph.add_edge(
        "company_research_agent",
        "financial_data_agent"
    )

    graph.add_edge(
        "financial_data_agent",
        "financial_analysis_agent"
    )

    graph.add_edge(
        "financial_analysis_agent",
        "news_agent"
    )

    graph.add_edge(
        "news_agent",
        "risk_analysis_agent"
    )

    graph.add_edge(
        "risk_analysis_agent",
        "reviewer_agent"
    )

    graph.add_edge(
        "reviewer_agent",
        "final_report_agent"
    )

    graph.add_edge(
        "final_report_agent",
         END
    )

    return graph.compile()


# Compiled graph used by the application
financial_research_graph = build_financial_research_graph()