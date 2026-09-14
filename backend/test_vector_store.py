from app.rag.pdf_loader import extract_text_from_pdf
from app.rag.chunker import chunk_text
from app.rag.vector_store import create_vector_store


PDF_PATH = "data/reports/sample.pdf"


text = extract_text_from_pdf(PDF_PATH)

chunks = chunk_text(text)

print("===================================")
print("VECTOR STORE TEST")
print("===================================")

print(f"Total chunks: {len(chunks)}")

index, model = create_vector_store(chunks)

print("\nVector dimension:", index.d)
print("Vectors stored:", index.ntotal)

print("\n===================================")
print("Vector store created successfully!")
print("===================================")