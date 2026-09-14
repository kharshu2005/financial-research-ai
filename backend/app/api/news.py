from fastapi import APIRouter, HTTPException

from app.services.news import get_company_news


router = APIRouter(
    prefix="/api/news",
    tags=["News & Developments"],
)


@router.get("/{ticker}")
async def news(ticker: str):
    ticker = ticker.strip().upper()

    try:
        data = await get_company_news(ticker)

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
            detail=f"Unable to retrieve company news: {exc}",
        )