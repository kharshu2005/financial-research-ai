from app.rag.rag_service import build_rag_context


query = "What was Apple's total net sales in 2025?"


results = build_rag_context(
    query=query,
    top_k=5,
)


print("===================================")
print("SAVED VECTOR STORE RAG TEST")
print("===================================")

print(f"Query: {query}")
print(f"Retrieved chunks: {len(results)}")


for i, result in enumerate(results, start=1):

    print(f"\n========== RESULT {i} ==========")

    print(f"Source Page: {result['page']}")

    print("\nText:")
    print(result["text"][:1000])


print("\n===================================")
print("Saved vector store RAG successful!")
print("===================================")