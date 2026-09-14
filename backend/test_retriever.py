from app.rag.pdf_loader import extract_text_from_pdf
from app.rag.chunker import chunk_text
from app.rag.vector_store import create_vector_store
from app.rag.retriever import retrieve_chunks


PDF_PATH = "data/reports/sample.pdf"

QUERY = "What was Apple's total net sales in 2025?"


text = extract_text_from_pdf(PDF_PATH)

chunks = chunk_text(text)

index, model = create_vector_store(chunks)

results = retrieve_chunks(
    query=QUERY,
    chunks=chunks,
    index=index,
    model=model,
    top_k=5,
)


print("===================================")
print("RAG SOURCE RETRIEVAL TEST")
print("===================================")

print(f"Query: {QUERY}")
print(f"Retrieved chunks: {len(results)}")

for i, result in enumerate(results, start=1):

    print(f"\n========== RESULT {i} ==========")
    print(f"Source Page: {result['page']}")
    print("\nText:")
    print(result["text"][:1000])

print("\n===================================")
print("Source tracking successful!")
print("===================================")