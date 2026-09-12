from fastapi import FastAPI

app = FastAPI(
    title="Financial Research AI",
    description="Agentic AI Financial Research and Company Analysis System",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Financial Research AI Backend is running!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "financial-research-ai-backend"
    }