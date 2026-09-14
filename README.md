\# Agentic AI Financial Research \& Company Analysis System



An AI-powered multi-agent financial research platform that analyzes public company information, financial performance, recent developments, risks, and opportunities to generate a structured research report.



\## 🚀 Overview



This project uses a multi-agent workflow to automate financial company research.



A user provides a company ticker such as `AAPL`, `MSFT`, `NFLX`, `MCD`, or `JPM`. The system collects relevant company and financial information, performs financial calculations, researches recent developments, identifies risks and opportunities, and finally reviews the analysis before generating the final report.



> \*\*Note:\*\* This project is designed as a financial research and analysis tool, not as personalized investment advice.



\---



\## ✨ Key Features



\- 🤖 Multi-agent financial research workflow

\- 🏢 Company overview and business research

\- 📊 Financial metrics and trend analysis

\- 📈 Revenue growth and profitability analysis

\- 💰 Cash-flow analysis

\- 🏦 Debt and leverage analysis

\- 📰 Recent news and company developments

\- ⚠️ Risk identification and analysis

\- 💡 Future opportunities

\- 🔎 Annual report / PDF-based RAG

\- 📚 Source and evidence traceability

\- 🧮 Traceable financial calculations

\- 🧠 AI-generated analytical insights

\- 🔄 LangGraph-based agent orchestration

\- ⚡ Redis caching

\- 🗄️ PostgreSQL persistence

\- 📄 Final report generation

\- 🖥️ React + TypeScript frontend

\- 🚀 Ready for Render + Vercel deployment



\---



\## 🧠 Multi-Agent Architecture



The system consists of six specialized agents:



\### 1. Company Research Agent

Collects company information such as business description, sector, industry, headquarters, and company profile.



\### 2. Financial Data Agent

Retrieves and structures financial information including revenue, net income, free cash flow, debt, and other key metrics.



\### 3. Financial Analysis Agent

Calculates and interprets important financial indicators such as:



\- Revenue growth

\- Net profit margin

\- Free cash flow

\- Debt-to-equity ratio

\- Year-over-year trends



\### 4. News \& Development Agent

Researches recent company developments and relevant news using web search.



\### 5. Risk Analysis Agent

Identifies major business and financial risks based on available financial information and recent developments.



\### 6. Decision / Reviewer Agent

Reviews the outputs from the previous agents, checks whether important evidence is present, and evaluates the overall quality of the research.



\---



\## 🔄 Research Workflow



```text

User Query

&#x20;   ↓

Company Research Agent

&#x20;   ↓

Financial Data Agent

&#x20;   ↓

Financial Analysis Agent

&#x20;   ↓

News \& Development Agent

&#x20;   ↓

Risk Analysis Agent

&#x20;   ↓

Reviewer Agent

&#x20;   ↓

Final Research Report

