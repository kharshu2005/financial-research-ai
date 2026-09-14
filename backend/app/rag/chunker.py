def chunk_text(
    text: str,
    chunk_size: int = 1500,
    overlap: int = 200,
) -> list[dict]:
    """
    Split extracted PDF text into chunks while preserving page numbers.
    """

    if not text.strip():
        return []

    chunks = []

    current_page = "Unknown"

    # Split text according to the page markers created by pdf_loader.py
    sections = text.split("--- Page ")

    for section in sections:
        if not section.strip():
            continue

        lines = section.split("\n", 1)

        if len(lines) != 2:
            continue

        page_number, page_text = lines

        current_page = page_number.strip().replace("---", "").strip()

        page_text = page_text.strip()

        if not page_text:
            continue

        start = 0
        text_length = len(page_text)

        while start < text_length:
            end = start + chunk_size

            chunk = page_text[start:end].strip()

            if chunk:
                chunks.append(
                    {
                        "text": chunk,
                        "page": current_page,
                    }
                )

            start = end - overlap

    return chunks