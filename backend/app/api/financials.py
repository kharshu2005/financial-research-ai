from fastapi import APIRouter, HTTPException

from app.services.financial_data import get_financial_data


router = APIRouter(
    prefix="/api/financials",
    tags=["Financial Data"],
)


@router.get("/{ticker}")
async def financials(ticker: str):
    try:
        data = await get_financial_data(ticker)

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
            detail=f"Unable to retrieve financial data: {exc}",
        )