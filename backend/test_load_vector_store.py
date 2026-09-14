from app.rag.vector_store import load_vector_store


print("===================================")
print("VECTOR STORE LOAD TEST")
print("===================================")

index, model = load_vector_store()

print(f"Vectors loaded: {index.ntotal}")
print(f"Vector dimension: {index.d}")

print("\n===================================")
print("Vector store loaded successfully!")
print("===================================")