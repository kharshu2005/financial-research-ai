from pathlib import Path

import numpy as np

from app.rag.pdf_loader import extract_text_from_pdf
from app.rag.chunker import chunk_text
from app.rag.vector_store import load_vector_store


REPORT_DIR = Path("data/reports")


def build_rag_context(
    ticker: str,
    query: str,
    top_k: int = 5,
) -> list[dict]:

    ticker = ticker.strip().upper()

    pdf_path = REPORT_DIR / f"{ticker}.pdf"

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"Annual report not found for {ticker}"
        )

    text = extract_text_from_pdf(
        str(pdf_path)
    )

    chunks = chunk_text(text)

    index, model = load_vector_store(
        ticker
    )

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
    )

    query_embedding = np.asarray(
        query_embedding,
        dtype="float32",
    )

    distances, indices = index.search(
        query_embedding,
        top_k,
    )

    results = []

    for index_position in indices[0]:

        if index_position != -1:

            results.append(
                chunks[index_position]
            )

    return results