from app.rag.pdf_loader import extract_text_from_pdf
from app.rag.chunker import chunk_text


PDF_PATH = "data/reports/sample.pdf"


text = extract_text_from_pdf(PDF_PATH)

chunks = chunk_text(text)


print("===================================")
print("TEXT CHUNKING TEST")
print("===================================")

print(f"Total characters: {len(text):,}")
print(f"Total chunks: {len(chunks):,}")

print("\nFirst chunk:\n")
print(chunks[0][:1500])

print("\n===================================")
print("Chunking successful!")
print("===================================")