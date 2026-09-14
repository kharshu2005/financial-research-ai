from app.rag.answer_generator import generate_rag_answer


query = "What was Apple's total net sales in 2025?"


print("===================================")
print("RAG AI ANSWER TEST")
print("===================================")

result = generate_rag_answer(query)


print("\nAI ANSWER:")
print(result["answer"])

print("\nSOURCES:")

for source in result["sources"]:
    print(f"- Page {source['page']}")

print("\n===================================")
print("RAG AI answer generated successfully!")
print("===================================")