from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.research import router as research_router
from app.api.company import router as company_router
from app.api.financials import router as financial_router
from app.api.analysis import router as analysis_router
from app.api.news import router as news_router
from app.api.risk import router as risk_router
from app.api.reviewer import router as reviewer_router
from app.api.rag import router as rag_router


app = FastAPI(
    title="Financial Research AI",
    description="Agentic AI Financial Research and Company Analysis System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://financial-research-ai-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        "service": "financial-research-ai-backend",
    }


app.include_router(company_router)
app.include_router(financial_router)
app.include_router(analysis_router)
app.include_router(research_router)
app.include_router(news_router)
app.include_router(risk_router)
app.include_router(reviewer_router)
app.include_router(rag_router)