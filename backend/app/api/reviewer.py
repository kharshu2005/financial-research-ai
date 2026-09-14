from fastapi import APIRouter, HTTPException

from app.services.sec import get_company_by_ticker
from app.services.financial_data import get_financial_data
from app.services.financial_analysis import analyze_company_financials
from app.services.news import get_company_news
from app.services.risk_analysis import build_risk_analysis
from app.services.reviewer import review_analysis


router = APIRouter(
    prefix="/api/reviewer",
    tags=["AI Reviewer"],
)


@router.get("/{ticker}")
async def reviewer(ticker: str):
    ticker = ticker.strip().upper()

    try:
        company_data = await get_company_by_ticker(
            ticker
        )

        financial_data = await get_financial_data(
            ticker
        )

        financial_analysis = await analyze_company_financials(
            ticker
        )

        news_data = await get_company_news(
            ticker
        )

        risk_analysis = build_risk_analysis(
            financial_analysis=financial_analysis,
            news_data=news_data,
        )

        reviewer_result = review_analysis(
            company_data=company_data,
            financial_data=financial_data,
            financial_analysis=financial_analysis,
            news_data=news_data,
            risk_analysis=risk_analysis,
        )

        return {
            "success": True,
            "data": reviewer_result,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to complete reviewer validation: {exc}",
        )