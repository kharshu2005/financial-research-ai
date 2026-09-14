<div align="center">

<h1>🤖 Agentic AI Financial Research & Company Analysis System</h1>

<p>An intelligent multi-agent platform for automated financial research, company analysis, financial calculations, risk assessment, and evidence-based reporting.</p>

<p>
<img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript" />
</p>

<p>
<img src="https://img.shields.io/badge/LangGraph-Agent%20Orchestration-7B61FF?style=for-the-badge" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql" />
<img src="https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis" />
<img src="https://img.shields.io/badge/FAISS-Vector%20Search-FF6F00?style=for-the-badge" />
</p>

<p><strong>Research • Analyze • Validate • Explain</strong></p>

</div>

<div align="center"><h2>💡 What is this project?</h2></div>

This project is an <strong>Agentic AI-powered financial research system</strong> that automates the process of researching and analyzing publicly available company information.

Instead of manually searching multiple sources, collecting financial figures, calculating ratios, reading recent news, evaluating risks, and preparing a report, the system coordinates specialized AI agents to perform these tasks as a structured workflow.

A user can provide a company ticker such as <strong>AAPL, MSFT, NFLX, MCD, or JPM</strong>. The system researches the company, retrieves financial information, performs calculations, analyzes recent developments, identifies risks and opportunities, validates the research, and generates a structured final report.

<blockquote><strong>Important:</strong> This application is a financial research and analysis tool, not personalized investment advice.</blockquote>

<div align="center"><h2>🎯 Problem Statement</h2></div>

Financial company research requires information from multiple sources and often involves repetitive manual work. An analyst may need to understand a company's business, collect financial information, calculate indicators, study profitability and revenue trends, review debt and cash flow, search recent developments, identify risks, and verify supporting evidence.

This project addresses that challenge by creating an <strong>automated multi-agent research pipeline</strong> where every agent has a focused responsibility and the outputs are combined into a final analytical report.

<div align="center"><h2>✨ Key Capabilities</h2></div>

Capability

Description

🤖 Multi-Agent Research

Six specialized agents collaborate through a structured workflow

🏢 Company Research

Retrieves company profile and business information

📊 Financial Analysis

Analyzes revenue, profitability, debt, and cash flow

🧮 Financial Calculations

Calculates important financial indicators from source data

📰 News Research

Finds relevant recent company developments

⚠️ Risk Analysis

Identifies important business and financial risks

💡 Opportunity Analysis

Highlights potential future opportunities

📚 Annual Report RAG

Retrieves evidence directly from company annual reports

🔎 Source Traceability

Connects research findings with supporting sources

🧠 Reviewer Agent

Validates the quality and completeness of the analysis

⚡ Redis Caching

Reuses suitable results to reduce repeated processing

🗄️ PostgreSQL

Stores research runs, metrics, sources, and agent outputs

📄 Report Generation

Produces a structured final research report

🖥️ Interactive Dashboard

React-based interface for exploring company research

<div align="center"><h2>🤖 Multi-Agent Architecture</h2></div>

<h3>🏢 Company Research Agent</h3>
Establishes the company context by researching business description, industry, sector, company profile, and other relevant company information.

<h3>📊 Financial Data Agent</h3>
Collects and structures financial information such as revenue, net income, free cash flow, debt, equity, and other relevant metrics.

<h3>📈 Financial Analysis Agent</h3>
Transforms financial data into analytical indicators including revenue growth, net profit margin, free cash flow, debt-to-equity, and year-over-year trends.

<h3>📰 News & Development Agent</h3>
Researches recent company announcements, strategic changes, business developments, market developments, and other relevant news.

<h3>⚠️ Risk Analysis Agent</h3>
Examines financial information and recent developments to identify financial, business, operational, market, competitive, and other evidence-backed risks.

<h3>🔍 Decision & Reviewer Agent</h3>
Acts as a quality-control layer by checking whether important financial evidence, risk evidence, news sources, and major analytical areas are present before the final report is produced.

<div align="center"><h2>🔄 Agentic Workflow</h2></div>

User
  ↓
Company Ticker
  ↓
Company Research Agent
  ↓
Financial Data Agent
  ↓
Financial Analysis Agent
  ↓
News & Development Agent
  ↓
Risk Analysis Agent
  ↓
Decision / Reviewer Agent
  ↓
Final Research Report

The workflow is orchestrated using <strong>LangGraph</strong>, allowing the individual research stages to operate as a coordinated pipeline.

<div align="center"><h2>🧠 Why Multi-Agent AI?</h2></div>

<strong>Specialization</strong> — Each agent has a clearly defined responsibility.

<strong>Modularity</strong> — Individual research components can be improved independently.

<strong>Traceability</strong> — Research outputs can be associated with their respective stages and sources.

<strong>Validation</strong> — A dedicated reviewer provides an additional quality-control layer.

<strong>Scalability</strong> — New research capabilities can be added as additional agents or services.

<div align="center"><h2>📊 Financial Analysis & Traceability</h2></div>

The system distinguishes between three types of information:

Type

Meaning

📌 Source Facts

Information retrieved from external financial or research sources

🧮 Calculated Values

Metrics calculated from retrieved financial data

🧠 AI Interpretation

Analytical conclusions generated from available evidence

This separation makes the analysis easier to understand and helps prevent calculated financial values from being confused with AI-generated interpretations.

<div align="center"><h2>📚 Annual Report RAG</h2></div>

The project incorporates <strong>Retrieval-Augmented Generation</strong> for company annual reports. Relevant information can be retrieved directly from source documents instead of relying entirely on a language model's internal knowledge.

Annual Report PDF
       ↓
PDF Text Extraction
       ↓
Page-Aware Chunking
       ↓
Embeddings
       ↓
FAISS Vector Store
       ↓
Similarity Retrieval
       ↓
Relevant Evidence
       ↓
AI Answer Generation

<strong>PyMuPDF</strong> handles PDF text extraction. <strong>Sentence Transformers</strong> generate vector representations. <strong>FAISS</strong> provides similarity search, while the retriever selects relevant passages for the research question.

<div align="center"><h2>🗄️ Data Persistence</h2></div>

<h3>PostgreSQL</h3>

PostgreSQL stores structured research information including companies, research runs, agent results, financial metrics, sources, and final research outputs.

<h3>Redis</h3>

Redis provides a caching layer that can reuse suitable results for repeated requests, helping reduce unnecessary processing and external API calls.

<div align="center"><h2>🖥️ User Interface</h2></div>

The React dashboard provides dedicated views for company analysis, financial metrics, financial trends, news and developments, risks, opportunities, sources, and the final analytical report.

The interface is designed to make the multi-agent research process understandable to the user rather than exposing only a raw AI response.

<div align="center"><h2>⚙️ Technology Stack</h2></div>

<h3>Backend</h3>

Technology

Purpose

Python

Core backend development

FastAPI

REST API framework

LangGraph

Multi-agent workflow orchestration

OpenAI

Large language model capabilities

Tavily

Web research and search

Pydantic

Data validation

Pandas

Financial data processing

PyMuPDF

PDF processing

Sentence Transformers

Text embeddings

FAISS

Vector similarity search

SQLAlchemy

Database interaction

PostgreSQL

Persistent storage

Redis

Caching

<h3>Frontend</h3>

Technology

Purpose

React

User interface

TypeScript

Type-safe frontend development

Vite

Frontend build tooling

Tailwind CSS

UI styling

Recharts

Data visualization

Axios

API communication

Lucide React

Interface icons

jsPDF

PDF report generation

<div align="center"><h2>📡 API Endpoints</h2></div>

Endpoint

Function

/api/company/{ticker}

Company research

/api/financials/{ticker}

Financial data

/api/analysis/{ticker}

Financial analysis

/api/news/{ticker}

News and developments

/api/risk/{ticker}

Risk analysis

/api/reviewer/{ticker}

Research validation

/api/rag/{ticker}

Annual report RAG

/api/research/{ticker}

Complete agentic research workflow

The complete research endpoint combines the individual stages into the end-to-end workflow.

<div align="center"><h2>📁 Project Structure</h2></div>

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

<div align="center"><h2>🚀 Local Setup</h2></div>

<h3>Clone the repository</h3>

git clone https://github.com/kharshu2005/financial-research-ai.git
cd financial-research-ai

<h3>Backend</h3>

python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt

Start the FastAPI server from the backend directory:

cd backend
uvicorn app.main:app --reload

Backend: http://127.0.0.1:8000

<h3>Frontend</h3>

Open a second terminal:

cd frontend
npm install
npm run dev

Frontend: http://localhost:5173

<div align="center"><h2>🔐 Environment Configuration</h2></div>

Create a local .env file with the required credentials:

OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

<strong>Never commit API keys or secrets to GitHub.</strong>

<div align="center"><h2>🔎 Example Research Request</h2></div>

Analyze AAPL based on recent revenue growth,
profitability, debt, cash flow, recent developments,
risks, and future opportunities.

The system processes the request through research, financial data retrieval, financial calculations, recent-development research, risk assessment, quality review, and final report generation.

<div align="center"><h2>📄 Final Research Report</h2></div>

The final report can combine:

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

The objective is to provide a single structured view of the company's financial and business situation.

<div align="center"><h2>🧪 Testing & Validation</h2></div>

The backend includes tests covering important components such as financial analysis, database operations, the research workflow, PDF processing, RAG functionality, vector-store operations, retriever functionality, Redis caching, and repository operations.

<div align="center"><h2>🌟 Why This Project?</h2></div>

This project demonstrates how <strong>Agentic AI, LLM integration, web research, RAG, financial data processing, database persistence, caching, and full-stack development</strong> can be combined into one end-to-end application.

The core idea is simple: transform a broad financial research question into a sequence of specialized, verifiable research tasks and then combine the results into a structured report.

<div align="center"><h2>🔮 Future Enhancements</h2></div>

Additional financial data providers

More advanced financial ratios

Comparative company analysis

Portfolio-level research

Additional document sources

Improved agent memory

Advanced financial forecasting

More sophisticated source verification

Production monitoring and observability

<div align="center"><h2>⚠️ Disclaimer</h2></div>

This project is intended for <strong>educational and financial research purposes only</strong>. The information and analysis generated by the application should not be considered personalized financial, investment, legal, or tax advice.

Users should independently verify important information using authoritative sources before making financial decisions.

<div align="center">

<h2>👩‍💻 Author</h2>

<p><strong>Harshitha Kongitala</strong></p>
<p>B.Tech — Computer Science & Engineering</p>
<p>Built as an end-to-end Agentic AI financial research project.</p>

<br>

<strong>🤖 Research smarter. Analyze deeper. Make information easier to understand.</strong>

</div>