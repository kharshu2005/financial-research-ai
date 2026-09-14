from typing import Any


def build_final_report(
    company_data: dict[str, Any],
    financial_data: dict[str, Any],
    financial_analysis: dict[str, Any],
    news_data: dict[str, Any],
    risk_analysis: dict[str, Any],
    reviewer_result: dict[str, Any],
) -> dict[str, Any]:

    # ============================================================
    # COMPANY
    # ============================================================

    company_name = (
        company_data.get("name")
        or company_data.get("company_name")
        or company_data.get("ticker")
        or "Unknown Company"
    )

    ticker = (
        company_data.get("ticker")
        or financial_data.get("ticker")
        or "Unknown"
    )

    # ============================================================
    # FINANCIAL DATA
    # ============================================================

    financial_inner = financial_data.get(
        "financial_data",
        {},
    )

    annual = financial_inner.get(
        "annual",
        {},
    )

    balance_sheet = financial_inner.get(
        "balance_sheet",
        {},
    )

    # ============================================================
    # FINANCIAL ANALYSIS
    # ============================================================

    metrics = financial_analysis.get(
        "metrics",
        {},
    )

    # ============================================================
    # NEWS
    # ============================================================

    articles = news_data.get(
        "articles",
        [],
    )

    # ============================================================
    # RISKS
    # ============================================================

    risks = risk_analysis.get(
        "risks",
        [],
    )

    # ============================================================
    # OPPORTUNITIES
    # ============================================================

    opportunities = []

    if metrics.get("revenue_growth_percent") is not None:
        growth = metrics["revenue_growth_percent"]

        if growth > 0:
            opportunities.append({
                "title": "Revenue Growth",
                "description": (
                    f"Revenue increased by {growth:.2f}%, "
                    "indicating potential for continued business expansion."
                ),
                "basis": "Financial analysis",
            })

    if metrics.get("free_cash_flow") is not None:
        if metrics["free_cash_flow"] > 0:
            opportunities.append({
                "title": "Positive Free Cash Flow",
                "description": (
                    "Positive free cash flow provides financial flexibility "
                    "for investments, innovation and strategic initiatives."
                ),
                "basis": "Cash flow analysis",
            })

    if metrics.get("net_profit_margin_percent") is not None:
        margin = metrics["net_profit_margin_percent"]

        if margin > 0:
            opportunities.append({
                "title": "Profitability",
                "description": (
                    f"A positive net profit margin of {margin:.2f}% "
                    "indicates an opportunity to sustain profitable growth."
                ),
                "basis": "Profitability analysis",
            })

    if len(articles) > 0:
        opportunities.append({
            "title": "Recent Business Developments",
            "description": (
                f"{len(articles)} recent developments were identified "
                "through web research and may provide opportunities "
                "for future business analysis."
            ),
            "basis": "News research",
        })

    # ============================================================
    # EXECUTIVE SUMMARY
    # ============================================================

    reviewer_status = reviewer_result.get(
        "overall_status",
        "needs_review",
    )

    executive_summary = (
        f"{company_name} ({ticker}) was analyzed using financial data, "
        f"financial calculations, recent developments, risk analysis "
        f"and evidence validation. The reviewer status is "
        f"{reviewer_status.replace('_', ' ')}."
    )

    # ============================================================
    # FINANCIAL SUMMARY
    # ============================================================

    financial_summary = {
        "revenue": metrics.get("latest_revenue"),
        "previous_revenue": metrics.get("previous_revenue"),
        "revenue_growth_percent": metrics.get(
            "revenue_growth_percent"
        ),
        "net_income": metrics.get("net_income"),
        "net_profit_margin_percent": metrics.get(
            "net_profit_margin_percent"
        ),
        "operating_cash_flow": metrics.get(
            "operating_cash_flow"
        ),
        "capital_expenditure": metrics.get(
            "capital_expenditure"
        ),
        "free_cash_flow": metrics.get(
            "free_cash_flow"
        ),
        "total_debt": metrics.get(
            "total_debt"
        ),
        "equity": metrics.get(
            "equity"
        ),
        "debt_to_equity": metrics.get(
            "debt_to_equity"
        ),
    }

    # ============================================================
    # NEWS SUMMARY
    # ============================================================

    news_summary = {
        "articles_count": len(articles),
        "overall_summary": news_data.get(
            "overall_summary",
            "",
        ),
        "articles": articles,
    }

    # ============================================================
    # REVIEW SUMMARY
    # ============================================================

    review_summary = {
        "status": reviewer_result.get(
            "overall_status"
        ),
        "verified_checks": reviewer_result.get(
            "verified_checks"
        ),
        "total_checks": reviewer_result.get(
            "total_checks"
        ),
        "summary": reviewer_result.get(
            "reviewer_summary"
        ),
    }

    # ============================================================
    # FINAL REPORT
    # ============================================================

    return {
        "company": {
            "name": company_name,
            "ticker": ticker,
        },

        "executive_summary": executive_summary,

        "financial_summary": financial_summary,

        "major_developments": news_summary,

        "key_risks": risks,

        "future_opportunities": opportunities,

        "reviewer_assessment": review_summary,

        "disclaimer": (
            "This report is an AI-assisted financial research tool "
            "for informational and research purposes only. It is not "
            "personalized investment advice or a recommendation to "
            "buy or sell securities."
        ),
    }