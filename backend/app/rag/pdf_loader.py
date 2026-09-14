import fitz


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF document.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        Complete extracted text.
    """

    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document):
        text = page.get_text("text")

        if text.strip():
            pages.append(
                f"\n--- Page {page_number + 1} ---\n{text}"
            )

    document.close()

    return "\n".join(pages)