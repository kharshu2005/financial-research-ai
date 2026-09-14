from typing import Any


def review_analysis(
    company_data: dict[str, Any],
    financial_data: dict[str, Any],
    financial_analysis: dict[str, Any],
    news_data: dict[str, Any],
    risk_analysis: dict[str, Any],
) -> dict[str, Any]:

    checks = []

    metrics = financial_analysis.get("metrics", {})

    # ========================================================
    # CHECK 1 — REVENUE GROWTH
    # ========================================================

    revenue_growth = metrics.get("revenue_growth_percent")

    revenue_supported = (
        revenue_growth is not None
        and metrics.get("latest_revenue") is not None
        and metrics.get("previous_revenue") is not None
    )

    checks.append({
        "claim": "Revenue growth calculation",
        "status": "verified" if revenue_supported else "needs_review",
        "evidence": {
            "latest_revenue": metrics.get("latest_revenue"),
            "previous_revenue": metrics.get("previous_revenue"),
            "calculated_growth_percent": revenue_growth,
        },
    })

    # ========================================================
    # CHECK 2 — PROFITABILITY
    # ========================================================

    net_margin = metrics.get("net_profit_margin_percent")

    profitability_supported = (
        net_margin is not None
        and metrics.get("net_income") is not None
        and metrics.get("latest_revenue") is not None
    )

    checks.append({
        "claim": "Net profit margin calculation",
        "status": (
            "verified"
            if profitability_supported
            else "needs_review"
        ),
        "evidence": {
            "net_income": metrics.get("net_income"),
            "revenue": metrics.get("latest_revenue"),
            "calculated_margin_percent": net_margin,
        },
    })

    # ========================================================
    # CHECK 3 — FREE CASH FLOW
    # ========================================================

    free_cash_flow = metrics.get("free_cash_flow")

    fcf_supported = (
        free_cash_flow is not None
        and metrics.get("operating_cash_flow") is not None
        and metrics.get("capital_expenditure") is not None
    )

    checks.append({
        "claim": "Free cash flow calculation",
        "status": (
            "verified"
            if fcf_supported
            else "needs_review"
        ),
        "evidence": {
            "operating_cash_flow": metrics.get(
                "operating_cash_flow"
            ),
            "capital_expenditure": metrics.get(
                "capital_expenditure"
            ),
            "calculated_free_cash_flow": free_cash_flow,
        },
    })

    # ========================================================
    # CHECK 4 — DEBT TO EQUITY
    # ========================================================

    debt_to_equity = metrics.get("debt_to_equity")

    debt_supported = (
        debt_to_equity is not None
        and metrics.get("total_debt") is not None
        and metrics.get("equity") is not None
    )

    checks.append({
        "claim": "Debt-to-equity calculation",
        "status": (
            "verified"
            if debt_supported
            else "needs_review"
        ),
        "evidence": {
            "total_debt": metrics.get("total_debt"),
            "equity": metrics.get("equity"),
            "calculated_debt_to_equity": debt_to_equity,
        },
    })

    # ========================================================
    # CHECK 5 — RISK ANALYSIS
    # ========================================================

    risks = risk_analysis.get("risks", [])

    risk_evidence_supported = True

    for risk in risks:

        if not risk.get("evidence"):
            risk_evidence_supported = False
            break

    checks.append({
        "claim": "Risk analysis evidence",
        "status": (
            "verified"
            if risk_evidence_supported
            else "needs_review"
        ),
        "evidence": {
            "risk_count": len(risks),
        },
    })

    # ========================================================
    # CHECK 6 — NEWS SOURCES
    # ========================================================

    articles = news_data.get("articles", [])

    news_sources_valid = True

    for article in articles:

        if not article.get("title"):
            news_sources_valid = False

        if not article.get("url"):
            news_sources_valid = False

        if not article.get("source"):
            news_sources_valid = False

    checks.append({
        "claim": "News source validation",
        "status": (
            "verified"
            if news_sources_valid
            else "needs_review"
        ),
        "evidence": {
            "articles_checked": len(articles),
        },
    })

    # ========================================================
    # OVERALL REVIEW
    # ========================================================

    verified_count = sum(
        1
        for check in checks
        if check["status"] == "verified"
    )

    review_count = len(checks)

    if verified_count == review_count:
        overall_status = "approved"

    elif verified_count >= review_count * 0.7:
        overall_status = "approved_with_warnings"

    else:
        overall_status = "needs_review"

    return {
        "overall_status": overall_status,
        "verified_checks": verified_count,
        "total_checks": review_count,
        "checks": checks,
        "reviewer_summary": (
            f"{verified_count} of {review_count} "
            "validation checks passed."
        ),
    }