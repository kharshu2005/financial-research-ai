from app.rag.pdf_loader import extract_text_from_pdf


PDF_PATH = "data/reports/sample.pdf"


text = extract_text_from_pdf(PDF_PATH)


print("===================================")
print("PDF EXTRACTION TEST")
print("===================================")

print(f"Total characters extracted: {len(text):,}")

print("\nFirst 2000 characters:\n")
print(text[:2000])

print("\n===================================")
print("PDF extraction successful!")
print("===================================")