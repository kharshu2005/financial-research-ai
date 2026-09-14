import ollama

from app.rag.rag_service import build_rag_context


MODEL_NAME = "llama3.2"


def generate_rag_answer(
    ticker: str,
    query: str,
) -> dict:
    """
    Generate an AI answer using retrieved annual-report evidence.
    """

    results = build_rag_context(
        ticker=ticker,
        query=query,
        top_k=3,
    )

    if not results:
        return {
            "answer": "No relevant information was found in the annual report.",
            "sources": [],
        }

    evidence_parts = []

    for result in results:
        evidence_parts.append(
            f"""
--- SOURCE PAGE {result['page']} ---

{result['text'][:1800]}
"""
        )

    evidence = "\n".join(evidence_parts)

    prompt = f"""
You are an AI financial research assistant.

Your task is to answer the question using the
annual report evidence below.

IMPORTANT:
1. The answer IS contained in the evidence.
2. Carefully read the evidence before answering.
3. Use the exact financial figures from the evidence.
4. Do not invent or estimate numbers.
5. Give a direct answer in 1-3 sentences.
6. Include the source page number.
7. Do NOT say that you cannot answer if the evidence
   contains the requested information.

QUESTION:
{query}

ANNUAL REPORT EVIDENCE:
{evidence}

Now answer the question directly.
"""

    response = ollama.chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    answer = response["message"]["content"].strip()

    sources = [
        {
            "page": result["page"],
            "text": result["text"][:500],
        }
        for result in results
    ]

    return {
        "answer": answer,
        "sources": sources,
    }