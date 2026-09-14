from fastapi import APIRouter, HTTPException

from app.rag.answer_generator import generate_rag_answer


router = APIRouter(
    prefix="/api/rag",
    tags=["RAG Research"],
)


@router.get("/{ticker}")
async def rag_research(
    ticker: str,
    question: str,
):
    ticker = ticker.strip().upper()

    try:
        result = generate_rag_answer(
            ticker=ticker,
            query=question,
        )

        return {
            "success": True,
            "ticker": ticker,
            "question": question,
            "answer": result["answer"],
            "sources": result["sources"],
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"RAG answer generation failed: {exc}",
        )