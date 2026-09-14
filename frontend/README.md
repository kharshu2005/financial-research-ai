# 🤖 Agentic AI Financial Research & Company Analysis System

<p align="center">

<img src="https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4?logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/LangGraph-Agentic_AI-1C3C3C?logo=langchain&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-7+-DC382D?logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/FAISS-Vector_Search-FF6F00?logo=meta&logoColor=white" />

</p>

An end-to-end **Agentic AI financial research platform** that uses specialized AI agents to research companies, retrieve financial information, calculate financial indicators, analyze recent developments, identify business risks, and generate structured evidence-based reports.

The system combines **LangGraph multi-agent orchestration, financial data retrieval, web search, annual-report RAG, FAISS vector search, PostgreSQL persistence, Redis caching, and a React + TypeScript dashboard** to provide a unified financial research experience.

---

## 📌 Table of Contents

- [Key Highlights](#-key-highlights)
- [System Architecture](#-system-architecture)
- [Agentic Workflow](#-agentic-workflow)
- [Specialized Agents](#-specialized-agents)
- [Financial Analysis](#-financial-analysis)
- [Annual Report RAG](#-annual-report-rag)
- [Evidence & Source Traceability](#-evidence--source-traceability)
- [Database & Caching](#-database--caching)
- [Frontend](#-frontend)
- [Backend API](#-backend-api)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Example Workflow](#-example-workflow)
- [Disclaimer](#-disclaimer)

---

# 🚀 Key Highlights

- 🤖 **6 specialized AI agents** coordinated using LangGraph
- 🏢 Automated company research using public financial information
- 💰 Financial data extraction and structured financial metrics
- 📈 Revenue growth and profitability analysis
- 💵 Cash-flow and Free Cash Flow analysis
- ⚖️ Debt and Debt-to-Equity analysis
- 📰 Recent company news and development discovery
- 🛡️ Financial and business risk identification
- 🔍 AI reviewer for validating analytical claims
- 📄 Annual report PDF processing
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔎 FAISS vector search for document retrieval
- 🗄️ PostgreSQL persistence for research results
- ⚡ Redis caching for repeated research requests
- 📚 Traceable financial calculations and supporting sources
- 🎨 Modern React + TypeScript + Tailwind CSS interface

---

# 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
              ┌─────────────────────────┐
              │     React Frontend      │
              │ React + TypeScript +    │
              │      Tailwind CSS       │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │       FastAPI           │
              │       Backend           │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │      LangGraph          │
              │   Agent Orchestration   │
              └────────────┬────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Company Research   Financial Data   Financial Analysis
       Agent             Agent              Agent
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                 News & Developments
                       Agent
                           │
                           ▼
                   Risk Analysis
                       Agent
                           │
                           ▼
                  Decision / Reviewer
                       Agent
                           │
                           ▼
                   Final Research
                       Report

       ┌──────────────────────────────────────────┐
       │ External Data & Storage Components       │
       │                                          │
       │ SEC / Public Data │ Tavily Web Search    │
       │ Annual Reports    │ FAISS Vector Store   │
       │ PostgreSQL        │ Redis Cache           │
       └──────────────────────────────────────────┘