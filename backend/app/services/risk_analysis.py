from typing import Any


def build_risk_analysis(
    financial_analysis: dict[str, Any],
    news_data: dict[str, Any],
) -> dict[str, Any]:

    metrics = financial_analysis.get("metrics", {})

    revenue_growth = metrics.get("revenue_growth_percent")
    net_margin = metrics.get("net_profit_margin_percent")
    free_cash_flow = metrics.get("free_cash_flow")
    debt_to_equity = metrics.get("debt_to_equity")
    cash = metrics.get("cash")
    liabilities = metrics.get("liabilities")

    risks = []

    # -----------------------------
    # Revenue Risk
    # -----------------------------
    if revenue_growth is not None:

        if revenue_growth < 0:
            risks.append({
                "category": "Revenue Risk",
                "severity": "high",
                "finding": "Revenue declined compared with the previous year.",
                "description": "Revenue declined compared with the previous year.",
                "evidence": {
                    "revenue_growth_percent": revenue_growth
                }
            })

        elif revenue_growth < 5:
            risks.append({
                "category": "Revenue Risk",
                "severity": "medium",
                "finding": "Revenue growth is relatively modest.",
                "evidence": {
                    "revenue_growth_percent": revenue_growth
                }
            })

        else:
            risks.append({
                "category": "Revenue Risk",
                "severity": "low",
                "finding": "Revenue increased compared with the previous year.",
                "evidence": {
                    "revenue_growth_percent": revenue_growth
                }
            })

    # -----------------------------
    # Profitability Risk
    # -----------------------------
    if net_margin is not None:

        if net_margin < 10:
            severity = "high"
            finding = "Net profit margin is relatively low."

        elif net_margin < 20:
            severity = "medium"
            finding = "Net profit margin is moderate."

        else:
            severity = "low"
            finding = "The company has a strong net profit margin."

        risks.append({
            "category": "Profitability Risk",
            "severity": severity,
            "finding": finding,
            "evidence": {
                "net_profit_margin_percent": net_margin
            }
        })

    # -----------------------------
    # Debt Risk
    # -----------------------------
    if debt_to_equity is not None:

        if debt_to_equity > 2:
            severity = "high"
            finding = "Debt is high relative to shareholders' equity."

        elif debt_to_equity > 1:
            severity = "medium"
            finding = "Debt exceeds shareholders' equity."

        else:
            severity = "low"
            finding = "Debt is below shareholders' equity."

        risks.append({
            "category": "Debt Risk",
            "severity": severity,
            "finding": finding,
            "evidence": {
                "debt_to_equity": debt_to_equity
            }
        })

    # -----------------------------
    # Cash Flow Risk
    # -----------------------------
    if free_cash_flow is not None:

        if free_cash_flow < 0:
            severity = "high"
            finding = "Free cash flow is negative."

        else:
            severity = "low"
            finding = "The company generated positive free cash flow."

        risks.append({
            "category": "Cash Flow Risk",
            "severity": severity,
            "finding": finding,
            "evidence": {
                "free_cash_flow": free_cash_flow
            }
        })

    # -----------------------------
    # Balance Sheet Risk
    # -----------------------------
    if cash is not None and liabilities is not None:

        if liabilities > cash * 5:
            severity = "medium"
            finding = "Liabilities are substantially larger than cash reserves."

        else:
            severity = "low"
            finding = "Cash reserves provide some balance-sheet support."

        risks.append({
            "category": "Balance Sheet Risk",
            "severity": severity,
            "finding": finding,
            "evidence": {
                "cash": cash,
                "liabilities": liabilities
            }
        })

    # -----------------------------
    # News / Development Risk
    # -----------------------------
    articles = news_data.get("articles", [])

    news_risk_items = []

    for article in articles:

        title = article.get("title", "")
        summary = article.get("summary", "")

        text = f"{title} {summary}".lower()

        risk_keywords = [
            "lawsuit",
            "regulatory",
            "antitrust",
            "investigation",
            "fine",
            "recall",
            "layoff",
            "decline",
            "risk",
            "geopolitical",
            "tariff",
        ]

        matched_keywords = [
            keyword
            for keyword in risk_keywords
            if keyword in text
        ]

        if matched_keywords:
            news_risk_items.append({
                "title": title,
                "url": article.get("url"),
                "matched_keywords": matched_keywords,
            })

    if news_risk_items:

        risks.append({
            "category": "Recent Developments Risk",
            "severity": "medium",
            "finding": (
                "Recent search results contain developments "
                "that may require further review."
            ),
            "evidence": news_risk_items,
        })

    else:

        risks.append({
            "category": "Recent Developments Risk",
            "severity": "low",
            "finding": "No major risk-related keywords were detected in retrieved developments.",
            "evidence": {
                "articles_reviewed": len(articles)
            }
        })

    # -----------------------------
    # Overall Risk
    # -----------------------------

    severity_score = {
        "low": 1,
        "medium": 2,
        "high": 3,
    }

    total_score = sum(
        severity_score.get(item["severity"], 1)
        for item in risks
    )

    if total_score >= 12:
        overall_risk = "high"
    elif total_score >= 8:
        overall_risk = "medium"
    else:
        overall_risk = "low"

    return {
        "risks": risks,
        "overall_risk": overall_risk,
        "risk_score": total_score,
        "methodology": (
            "Risk levels are derived from financial metrics "
            "and retrieved company developments using "
            "deterministic rules. The result is intended "
            "for financial research and is not investment advice."
        ),
    }