


<div align="center">

🤖 Agentic AI Financial Research & Company Analysis System
Multi-agent AI platform for company research, financial analysis, risk assessment, and evidence-based reporting
<p> <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" /> <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" /> <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> </p>

<p> <img src="https://img.shields.io/badge/LangGraph-Agent%20Orchestration-7B61FF?style=for-the-badge" /> <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis&logoColor=white" /> <img src="https://img.shields.io/badge/FAISS-Vector%20Search-FF6F00?style=for-the-badge" /> </p>

<strong>Research → Analyze → Validate → Report</strong>

</div>

📌 Overview
The Agentic AI Financial Research & Company Analysis System is an end-to-end platform that automates company research using specialized AI agents.

A user provides a company ticker such as AAPL, MSFT, NFLX, MCD, or JPM. The system researches the company, collects financial information, calculates financial indicators, analyzes recent developments, identifies risks and opportunities, validates the findings, and generates a structured research report.

The platform combines Agentic AI, financial data processing, web research, annual-report RAG, vector search, PostgreSQL, Redis, and a React dashboard in one workflow.

Disclaimer: This is a financial research and educational tool, not personalized investment advice.

🎯 Problem Statement
Company research normally requires information from multiple sources and several manual steps:

Understanding the company's business

Collecting financial information

Calculating financial ratios

Studying revenue and profitability trends

Reviewing debt and cash flow

Researching recent developments

Identifying risks and opportunities

Verifying supporting evidence

Preparing a final report

This project automates that process through a coordinated multi-agent workflow, reducing repetitive research work while keeping financial calculations and supporting evidence visible.

✨ Key Features
Feature	What it does
🤖 Multi-Agent Research	Coordinates six specialized research agents
🏢 Company Research	Builds the company and business context
💰 Financial Data	Collects and structures financial information
📊 Financial Analysis	Calculates and interprets key indicators
📈 Trend Analysis	Examines revenue and profitability trends
📰 News & Developments	Researches relevant recent developments
⚠️ Risk Analysis	Identifies important business and financial risks
💡 Opportunities	Highlights potential future opportunities
📚 Annual Report RAG	Retrieves evidence from company annual reports
🔎 Source Traceability	Keeps findings connected to supporting sources
🧮 Traceable Calculations	Separates calculations from AI interpretation
🔍 Reviewer Agent	Validates research completeness and evidence
⚡ Redis Caching	Reuses suitable cached research results
🗄️ PostgreSQL	Persists research runs, metrics, sources, and outputs
📄 Final Reports	Produces a structured analytical report
🖥️ React Dashboard	Provides an interactive research interface
🤖 Multi-Agent Architecture
1. 🏢 Company Research Agent
Establishes the basic company context, including company profile, business description, sector, industry, and relevant company information.

2. 💰 Financial Data Agent
Collects and structures financial information such as revenue, net income, free cash flow, debt, equity, and other relevant metrics.

3. 📊 Financial Analysis Agent
Calculates and evaluates indicators including:

Revenue growth

Net profit margin

Free cash flow

Debt-to-equity ratio

Year-over-year trends

4. 📰 News & Development Agent
Researches relevant recent company developments, announcements, strategic changes, market developments, and news.

5. ⚠️ Risk Analysis Agent
Uses financial information and recent developments to identify financial, business, operational, market, and competitive risks.

6. 🔍 Decision / Reviewer Agent
Acts as a quality-control layer. It checks important analytical areas such as revenue growth, profitability, free cash flow, debt-to-equity, risk evidence, and news sources before the final report is produced.

🔄 Agentic Workflow
User
  │
  ▼
Company Ticker
  │
  ▼
Company Research Agent
  │
  ▼
Financial Data Agent
  │
  ▼
Financial Analysis Agent
  │
  ▼
News & Development Agent
  │
  ▼
Risk Analysis Agent
  │
  ▼
Decision / Reviewer Agent
  │
  ▼
Final Research Report
The workflow is orchestrated using LangGraph.

📊 Financial Analysis & Traceability
The system deliberately separates three types of information:

Type	Meaning
📌 Source Facts	Information retrieved from financial, company, or research sources
🧮 Calculated Values	Metrics calculated from structured financial data
🧠 AI Interpretation	Analytical conclusions generated from available evidence
This makes it easier to understand where a number came from and distinguish financial calculations from AI-generated conclusions.

📚 Annual Report RAG
The application supports Retrieval-Augmented Generation (RAG) for company annual reports.

Annual Report PDF
       │
       ▼
PDF Text Extraction
       │
       ▼
Page-Aware Chunking
       │
       ▼
Text Embeddings
       │
       ▼
FAISS Vector Store
       │
       ▼
Similarity Retrieval
       │
       ▼
Relevant Evidence
       │
       ▼
AI Answer Generation
RAG Components
PyMuPDF — extracts text from PDF documents

Page-aware chunking — preserves document context

Sentence Transformers — generates embeddings

FAISS — performs vector similarity search

Retriever — finds relevant passages

LLM — generates answers using retrieved evidence

This provides a document-grounded research path instead of relying only on model knowledge.

🗄️ PostgreSQL & Redis
PostgreSQL
PostgreSQL provides persistent storage for:

Companies

Research runs

Agent results

Financial metrics

Sources

Final research outputs

Redis
Redis acts as the caching layer for suitable repeated research requests.

Caching helps reduce repeated processing and unnecessary external API calls while improving response time.

🖥️ Dashboard
The React + TypeScript dashboard provides dedicated views for:

Company analysis

Financial metrics

Revenue and profitability trends

News and developments

Risks

Opportunities

Supporting sources

Final analytical report

The interface allows users to move through individual research stages and view the final combined analysis.

⚙️ Technology Stack
Backend
Technology	Purpose
Python	Backend application
FastAPI	REST API
LangGraph	Agent orchestration
OpenAI	LLM capabilities
Tavily	Web research
Pydantic	Data validation
Pandas	Data processing
PyMuPDF	PDF processing
Sentence Transformers	Embeddings
FAISS	Vector search
SQLAlchemy	Database access
PostgreSQL	Persistent storage
Redis	Caching
Frontend
Technology	Purpose
React	User interface
TypeScript	Type-safe development
Vite	Frontend tooling
Tailwind CSS	Styling
Recharts	Data visualization
Axios	API communication
Lucide React	UI icons
jsPDF	PDF report generation
📡 API Endpoints
Endpoint	Purpose
/api/company/{ticker}	Company research
/api/financials/{ticker}	Financial data
/api/analysis/{ticker}	Financial analysis
/api/news/{ticker}	News and developments
/api/risk/{ticker}	Risk analysis
/api/reviewer/{ticker}	Research validation
/api/rag/{ticker}	Annual report RAG
/api/research/{ticker}	Complete multi-agent workflow
The /api/research/{ticker} endpoint coordinates the complete research pipeline.

📁 Project Structure
financial-research-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── graph/
│   │   ├── models/
│   │   ├── rag/
│   │   ├── services/
│   │   ├── main.py
│   │   └── state.py
│   │
│   ├── data/
│   │   ├── reports/
│   │   └── vector_store/
│   │
│   ├── build_vector_store.py
│   ├── requirements.txt
│   └── test_*.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
🚀 Local Setup
1. Clone the repository
git clone https://github.com/kharshu2005/financial-research-ai.git
cd financial-research-ai
2. Set up the backend
Create a virtual environment:

python -m venv .venv
Activate it:

.venv\Scripts\Activate.ps1
Install dependencies:

cd backend
pip install -r requirements.txt
Start FastAPI:

uvicorn app.main:app --reload
Backend: http://127.0.0.1:8000

3. Set up the frontend
Open a second terminal:

cd frontend
npm install
npm run dev
Frontend: http://localhost:5173

🔐 Environment Variables
Create a local .env file for the required credentials:

OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
Never commit API keys, passwords, or database credentials to GitHub.

🔎 Example Research Request
Analyze AAPL based on recent revenue growth,
profitability, debt, cash flow, recent developments,
risks, and future opportunities.
The request is processed through the complete agentic workflow and returns a structured research report.

📄 Final Research Report
The final report can contain:

Executive summary

Company overview

Financial performance

Key financial metrics

Revenue trends

Profitability analysis

Debt analysis

Cash-flow analysis

Major developments

Key risks

Future opportunities

Supporting sources

Reviewer assessment

Research disclaimer

🧪 Testing
The backend contains tests covering important application components, including:

Financial analysis

Database operations

Agent workflow

PDF processing

RAG functionality

Vector store operations

Retrieval

Redis caching

Repository operations

🌟 Engineering Highlights
This project demonstrates practical integration of:

Agentic AI

Multi-agent orchestration

LLM integration

Retrieval-Augmented Generation

Web research

Financial data processing

Financial calculations

Vector search

Document processing

PostgreSQL persistence

Redis caching

REST API development

React and TypeScript

Research validation

The architecture is designed so that individual agents and infrastructure components can be improved independently.

🔮 Future Enhancements
Additional financial data providers

Comparative company analysis

Portfolio-level research

Advanced financial ratios

Financial forecasting

Expanded document sources

Improved agent memory

Enhanced source verification

Production monitoring and observability

⚠️ Disclaimer
This project is intended for educational and financial research purposes only.

The information and analysis generated by the application should not be considered personalized financial, investment, legal, or tax advice.

Users should independently verify important information using authoritative sources before making financial decisions.

<div align="center">

👩‍💻 Author
Harshitha Kongitala

B.Tech — Computer Science & Engineering

Research smarter. Analyze deeper. Understand companies better.

</div>