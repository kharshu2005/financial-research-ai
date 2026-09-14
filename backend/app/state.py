from typing import Any, Annotated, TypedDict
import operator


class FinancialResearchState(TypedDict, total=False):
    ticker: str

    company_data: dict[str, Any]
    financial_data: dict[str, Any]
    financial_analysis: dict[str, Any]

    news_data: dict[str, Any]
    risk_analysis: dict[str, Any]

    reviewer_result: dict[str, Any]

    errors: Annotated[list[str], operator.add]

    final_report: dict[str, Any]