from pathlib import Path

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


MODEL_NAME = "all-MiniLM-L6-v2"

VECTOR_DIR = Path("data/vector_store")


def get_index_path(ticker: str) -> Path:
    """
    Get the FAISS index path for a company.
    """

    ticker = ticker.strip().upper()

    company_dir = VECTOR_DIR / ticker
    company_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    return company_dir / "index.faiss"


def create_vector_store(chunks: list[dict]):
    """
    Create a FAISS vector store from text chunks.
    """

    model = SentenceTransformer(MODEL_NAME)

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=True,
    )

    embeddings = np.asarray(
        embeddings,
        dtype="float32",
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    return index, model


def save_vector_store(
    index,
    ticker: str,
):
    """
    Save the FAISS index for a specific company.
    """

    index_path = get_index_path(ticker)

    faiss.write_index(
        index,
        str(index_path),
    )

    print(
        f"Vector store saved to: {index_path}"
    )


def load_vector_store(ticker: str):
    """
    Load the FAISS vector store for a company.
    """

    index_path = get_index_path(ticker)

    if not index_path.exists():
        raise FileNotFoundError(
            f"No vector store found for {ticker}: "
            f"{index_path}"
        )

    index = faiss.read_index(
        str(index_path)
    )

    model = SentenceTransformer(MODEL_NAME)

    return index, model