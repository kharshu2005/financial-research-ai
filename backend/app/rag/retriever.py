import numpy as np


def retrieve_chunks(
    query: str,
    chunks: list[dict],
    index,
    model,
    top_k: int = 5,
) -> list[dict]:
    """
    Retrieve the most relevant chunks and their source pages.
    """

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
            results.append(chunks[index_position])

    return results