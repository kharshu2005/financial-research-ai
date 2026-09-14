from fastapi import APIRouter, HTTPException

from app.services.financial_analysis import analyze_company_financials
from app.services.news import get_company_news
from app.services.risk_analysis import build_risk_analysis


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk Analysis"],
)


@router.get("/{ticker}")
async def risk(ticker: str):
    ticker = ticker.strip().upper()

    try:
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

        return {
            "success": True,
            "data": risk_analysis,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to generate risk analysis: {exc}",
        )