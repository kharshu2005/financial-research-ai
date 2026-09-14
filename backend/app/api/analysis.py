from fastapi import APIRouter, HTTPException

from app.services.financial_analysis import (
    analyze_company_financials,
)


router = APIRouter(
    prefix="/api/analysis",
    tags=["Financial Analysis"],
)


@router.get("/{ticker}")
async def financial_analysis(ticker: str):
    """
    Run the Financial Analysis Agent for a company.
    """

    try:
        data = await analyze_company_financials(ticker)

        return {
            "success": True,
            "data": data,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to analyze financial data: {exc}",
        )