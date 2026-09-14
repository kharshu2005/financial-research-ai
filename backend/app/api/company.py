from fastapi import APIRouter, HTTPException

from app.services.sec import get_company_by_ticker


router = APIRouter(
    prefix="/api/company",
    tags=["Company Research"],
)


@router.get("/{ticker}")
async def company_research(ticker: str):
    try:
        company = await get_company_by_ticker(ticker)
        return {
            "success": True,
            "data": company,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve SEC data: {str(exc)}",
        )