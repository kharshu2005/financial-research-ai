from pathlib import Path

from app.rag.pdf_loader import extract_text_from_pdf
from app.rag.chunker import chunk_text
from app.rag.vector_store import (
    create_vector_store,
    save_vector_store,
)


TICKER = "AAPL"

PDF_PATH = Path(
    f"data/reports/{TICKER}.pdf"
)


print("===================================")
print("BUILDING COMPANY VECTOR STORE")
print("===================================")

print(f"Company: {TICKER}")
print(f"PDF: {PDF_PATH}")

if not PDF_PATH.exists():
    raise FileNotFoundError(
        f"Annual report not found: {PDF_PATH}"
    )


print("\nReading PDF...")

text = extract_text_from_pdf(
    str(PDF_PATH)
)

print(f"Characters extracted: {len(text):,}")


print("\nCreating chunks...")

chunks = chunk_text(text)

print(f"Chunks created: {len(chunks)}")


print("\nCreating embeddings and FAISS index...")

index, model = create_vector_store(
    chunks
)

print(
    f"Vectors created: {index.ntotal}"
)


save_vector_store(
    index,
    TICKER,
)


print("\n===================================")
print("COMPANY VECTOR STORE COMPLETE")
print("===================================")