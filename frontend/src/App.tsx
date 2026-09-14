import FinalReport from "./FinalReport";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileSearch,
  FileText,
  Info,
  Link2,
  Globe2,
  Loader2,
  Menu,
  Newspaper,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
  ShieldCheck,
  Wallet,
  Scale,
  Lightbulb,
} from "lucide-react";

import axios from "axios";
import { useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ============================================================
// TYPES
// ============================================================

interface Filing {
  form: string;
  filing_date: string;
  accession_number: string;
  primary_document: string;
}

interface CompanyData {
  ticker: string;
  company_name: string;
  cik: string;
  sic?: string | null;
  sic_description?: string | null;
  exchange?: string | null;
  fiscal_year_end?: string | null;
  state_of_incorporation?: string | null;
  recent_filings: Filing[];
}

interface FinancialRow {
  fy: number;
  filed?: string | null;
  form?: string | null;
  start?: string | null;
  end?: string | null;
  value: number | null;
  frame?: string | null;
}

interface BalanceValue {
  date?: string | null;
  value?: number | null;
  form?: string | null;
}

interface FinancialData {
  ticker: string;
  cik: string;
  data_source: string;

  financial_data: {
    annual: {
      revenue: FinancialRow[];
      net_income: FinancialRow[];
      operating_cash_flow: FinancialRow[];
      capital_expenditure: FinancialRow[];
    };

    balance_sheet: {
      assets: BalanceValue | null;
      liabilities: BalanceValue | null;
      cash: BalanceValue | null;
      equity: BalanceValue | null;
      long_term_debt: BalanceValue | null;
      current_debt: BalanceValue | null;
    };

    source_tags: Record<string, string | null>;
  };
}

interface FinancialAnalysisData {
  ticker: string;

  metrics: {
    latest_revenue: number | null;
    previous_revenue: number | null;
    revenue_growth_percent: number | null;

    net_income: number | null;
    net_profit_margin_percent: number | null;

    operating_cash_flow: number | null;
    capital_expenditure: number | null;
    free_cash_flow: number | null;

    total_debt: number | null;
    debt_to_equity: number | null;

    assets: number | null;
    liabilities: number | null;
    cash: number | null;
    equity: number | null;

    return_on_assets_percent: number | null;
    return_on_equity_percent: number | null;
  };

  observations: string[];

  source_tags: Record<string, string | null>;

  methodology: Record<string, string>;

  data_source: string;

  disclaimer: string;
}

// ============================================================
// APP
// ============================================================

function App() {
  const [company, setCompany] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [activePage, setActivePage] =
    useState<"research" | "reports" | "sources" | "about">(
      "research"
    );

  const [companyData, setCompanyData] =
    useState<CompanyData | null>(null);

  const [financialData, setFinancialData] =
    useState<FinancialData | null>(null);

  const [analysisData, setAnalysisData] =
    useState<FinancialAnalysisData | null>(null);

  const [newsData, setNewsData] =
    useState<any>(null);  

  const [riskData, setRiskData] =
    useState<any>(null);

  const [reviewerData, setReviewerData] =
    useState<any>(null);  
  
  const [finalReport, setFinalReport] =
    useState<any>(null);

  const [finalReportLoading, setFinalReportLoading] =
    useState(false);  

  const displayedNews = newsData; 

  const [loading, setLoading] =
    useState(false);

  const [financialLoading, setFinancialLoading] =
    useState(false);

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [newsLoading, setNewsLoading] =
    useState(false);

  const [riskLoading, setRiskLoading] =
    useState(false);

  const [reviewerLoading, setReviewerLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigateToPage = (
    page: "research" | "reports" | "sources" | "about"
  ) => {
    setActivePage(page);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const annualReports =
  companyData?.recent_filings?.filter((filing) =>
    filing.form?.toUpperCase().startsWith("10-K")
  ) ?? [];

  // ==========================================================
  // AGENTS
  // ==========================================================

  const agents = [
    {
      name: "Company Research",
      icon: Globe2,
    },
    {
      name: "Financial Data",
      icon: BarChart3,
    },
    {
      name: "Financial Analysis",
      icon: TrendingUp,
    },
    {
      name: "News & Developments",
      icon: Newspaper,
    },
    {
      name: "Risk Analysis",
      icon: ShieldAlert,
    },
    {
      name: "AI Reviewer",
      icon: BrainCircuit,
    },
  ];


  // ==========================================================
// RUN COMPLETE AI RESEARCH WORKFLOW
// ==========================================================

const analyzeCompany = async () => {
    const ticker = company.trim().toUpperCase();

    if (!ticker) {
      setError(
        "Please enter a company ticker, for example AAPL."
      );
      return;
    }

    setCompany(ticker);
    setError("");

    // Start a fresh step-by-step research session.
    setCompanyData(null);
    setFinancialData(null);
    setAnalysisData(null);
    setNewsData(null);
    setRiskData(null);
    setReviewerData(null);
    setFinalReport(null);

    setLoading(false);
    setFinancialLoading(false);
    setAnalysisLoading(false);
    setNewsLoading(false);
    setRiskLoading(false);
    setReviewerLoading(false);

    // Keep the user at the agent pipeline.
    setTimeout(() => {
      document
        .getElementById("agent-pipeline")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const generateFinalReport = async () => {
  const ticker = company.trim().toUpperCase();

  if (!ticker) {
    setError("Please enter a company ticker first.");
    return;
  }

  setFinalReportLoading(true);
  setError("");

  try {
    const response = await axios.get(
      `${API_URL}/api/research/${encodeURIComponent(
        ticker
      )}`,
      {
        timeout: 180000,
      }
    );

    if (
      response.data?.success &&
      response.data?.data?.final_report
    ) {
      setFinalReport(
        response.data.data.final_report
      );

      setNewsData(
        response.data.data.final_report.major_developments
      );

      setTimeout(() => {
        document
          .getElementById("final-report")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } else {
      throw new Error(
        "Final report was not returned."
      );
    }
  } catch (err) {
    console.error(
      "Final report error:",
      err
    );

    setError(
      "Unable to generate the final research report. Please make sure the backend is running."
    );
  } finally {
    setFinalReportLoading(false);
  }
};


  // ==========================================================
  // COMPANY RESEARCH AGENT CLICK
  // ==========================================================

  const handleCompanyResearchClick = async () => {
    const ticker = company.trim().toUpperCase();

    if (!ticker) {
      setError(
        "Please enter a company ticker first."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/company/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 30000,
        }
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        setCompanyData(response.data.data);

        setTimeout(() => {
          document
            .getElementById("company-research")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      } else {
        throw new Error(
          "Invalid company research response."
        );
      }
    } catch (err) {
      console.error(
        "Company research error:",
        err
      );

      setError(
        axios.isAxiosError(err) && err.response?.status === 404
          ? `We couldn't find "${ticker}". Please enter a valid ticker.`
          : "Unable to retrieve company research."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // NEWS & DEVELOPMENTS AGENT CLICK
  // ==========================================================

  const handleNewsAgentClick = async () => {
    const ticker =
      companyData?.ticker ||
      company.trim().toUpperCase();

    if (!ticker) {
      setError(
        "Please enter a company ticker first."
      );
      return;
    }

    setNewsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/news/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 60000,
        }
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        setNewsData(response.data.data);

        setTimeout(() => {
          document
            .getElementById("news-developments")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      } else {
        throw new Error(
          "Invalid news response."
        );
      }
    } catch (err) {
      console.error(
        "News agent error:",
        err
      );

      setError(
        "Unable to retrieve recent company news."
      );
    } finally {
      setNewsLoading(false);
    }
  };


  // ==========================================================
  // RISK ANALYSIS AGENT CLICK
  // ==========================================================

  const handleRiskAgentClick = async () => {
    const ticker =
      companyData?.ticker ||
      company.trim().toUpperCase();

    if (!ticker) {
      setError(
        "Please enter a company ticker first."
      );
      return;
    }

    setRiskLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/risk/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 90000,
        }
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        setRiskData(response.data.data);

        setTimeout(() => {
          document
            .getElementById("risk-analysis")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      } else {
        throw new Error(
          "Invalid risk analysis response."
        );
      }
    } catch (err) {
      console.error(
        "Risk analysis error:",
        err
      );

      setError(
        "Unable to generate the risk analysis."
      );
    } finally {
      setRiskLoading(false);
    }
  };


  // ==========================================================
  // AI REVIEWER AGENT CLICK
  // ==========================================================

  const handleReviewerAgentClick = async () => {
    const ticker =
      companyData?.ticker ||
      company.trim().toUpperCase();

    if (!ticker) {
      setError(
        "Please enter a company ticker first."
      );
      return;
    }

    setReviewerLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/reviewer/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 120000,
        }
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        setReviewerData(response.data.data);

        setTimeout(() => {
          document
            .getElementById("ai-reviewer")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      } else {
        throw new Error(
          "Invalid reviewer response."
        );
      }
    } catch (err) {
      console.error(
        "Reviewer agent error:",
        err
      );

      setError(
        "Unable to complete the AI reviewer validation."
      );
    } finally {
      setReviewerLoading(false);
    }
  };


  // ==========================================================
  // FETCH FINANCIAL DATA
  // ==========================================================

  const fetchFinancialData = async (
    ticker: string
  ) => {

    setFinancialLoading(true);
    setError("");

    try {

      const response = await axios.get(
        `${API_URL}/api/financials/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 30000,
        }
      );

      console.log(
        "Financial data response:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {

        setFinancialData(
          response.data.data
        );

        return true;
      }

      throw new Error(
        "Invalid financial data received from backend."
      );

    } catch (err) {

      console.error(
        "Financial data error:",
        err
      );

      if (axios.isAxiosError(err)) {

        if (err.code === "ECONNABORTED") {

          setError(
            "Financial data request timed out. Please try again."
          );

        } else if (
          err.response?.status === 404
        ) {

          setError(
            `Financial data for "${ticker}" could not be found.`
          );

        } else if (
          err.response?.status
        ) {

          setError(
            `Financial Data Agent returned an error (${err.response.status}).`
          );

        } else {

          setError(
            "Unable to connect to the Financial Data Agent. Please make sure FastAPI is running on port 8000."
          );
        }

      } else {

        setError(
          "Something went wrong while retrieving financial data."
        );
      }

      return false;

    } finally {

      setFinancialLoading(false);
    }
  };


  // ==========================================================
  // FETCH FINANCIAL ANALYSIS
  // ==========================================================

  const fetchFinancialAnalysis = async (
    ticker: string
  ) => {

    setAnalysisLoading(true);
    setError("");

    try {

      const response = await axios.get(
        `${API_URL}/api/analysis/${encodeURIComponent(
          ticker
        )}`,
        {
          timeout: 30000,
        }
      );

      console.log(
        "Financial analysis response:",
        response.data
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {

        setAnalysisData(
          response.data.data
        );

        return true;
      }

      throw new Error(
        "Invalid financial analysis received from backend."
      );

    } catch (err) {

      console.error(
        "Financial analysis error:",
        err
      );

      if (axios.isAxiosError(err)) {

        if (err.code === "ECONNABORTED") {

          setError(
            "Financial analysis request timed out. Please try again."
          );

        } else if (
          err.response?.status === 404
        ) {

          setError(
            `Financial analysis for "${ticker}" could not be found.`
          );

        } else if (
          err.response?.status
        ) {

          setError(
            `Financial Analysis Agent returned an error (${err.response.status}).`
          );

        } else {

          setError(
            "Unable to connect to the Financial Analysis Agent. Please make sure FastAPI is running on port 8000."
          );
        }

      } else {

        setError(
          "Something went wrong while running financial analysis."
        );
      }

      return false;

    } finally {

      setAnalysisLoading(false);
    }
  };


  // ==========================================================
  // FINANCIAL DATA AGENT CLICK
  // ==========================================================

  const handleFinancialAgentClick =
    async () => {

      const ticker =
        companyData?.ticker ||
        company.trim().toUpperCase();

      if (!ticker) {

        setError(
          "Please enter a company ticker first."
        );

        return;
      }

      setError("");

      if (!financialData) {

        await fetchFinancialData(
          ticker
        );
      }

      setTimeout(() => {

        document
          .getElementById(
            "financial-data"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

      }, 100);
    };


  // ==========================================================
  // FINANCIAL ANALYSIS AGENT CLICK
  // ==========================================================

  const handleAnalysisAgentClick =
    async () => {

      const ticker =
        companyData?.ticker ||
        company.trim().toUpperCase();

      if (!ticker) {

        setError(
          "Please enter a company ticker first."
        );

        return;
      }

      setError("");

      if (!analysisData) {

        await fetchFinancialAnalysis(
          ticker
        );
      }

      setTimeout(() => {

        document
          .getElementById(
            "financial-analysis"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

      }, 100);
    };


  // ==========================================================
  // KEYBOARD
  // ==========================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (event.key === "Enter") {
      analyzeCompany();
    }
  };


  // ==========================================================
  // FINANCIAL DATA PREPARATION
  // ==========================================================

  const annualRevenue =
    financialData
      ?.financial_data
      .annual
      .revenue
      ?.filter(
        (row) =>
          row.value !== null
      )
      .slice()
      .sort(
        (a, b) =>
          a.fy - b.fy
      )
      .map((row) => ({
        year: String(row.fy),
        revenue:
          Number(row.value) /
          1_000_000_000,
      })) ?? [];


  const latestRevenue =
    annualRevenue.length > 0
      ? annualRevenue[
          annualRevenue.length - 1
        ].revenue
      : null;


  const latestNetIncomeRows =
    financialData
      ?.financial_data
      .annual
      .net_income
      ?.filter(
        (row) =>
          row.value !== null
      )
      .slice()
      .sort(
        (a, b) =>
          a.fy - b.fy
      ) ?? [];


  const latestNetIncome =
    latestNetIncomeRows.length > 0
      ? Number(
          latestNetIncomeRows[
            latestNetIncomeRows.length - 1
          ].value
        ) / 1_000_000_000
      : null;


  const latestOcfRows =
    financialData
      ?.financial_data
      .annual
      .operating_cash_flow
      ?.filter(
        (row) =>
          row.value !== null
      )
      .slice()
      .sort(
        (a, b) =>
          a.fy - b.fy
      ) ?? [];


  const latestOcf =
    latestOcfRows.length > 0
      ? Number(
          latestOcfRows[
            latestOcfRows.length - 1
          ].value
        ) / 1_000_000_000
      : null;


  const latestCapexRows =
    financialData
      ?.financial_data
      .annual
      .capital_expenditure
      ?.filter(
        (row) =>
          row.value !== null
      )
      .slice()
      .sort(
        (a, b) =>
          a.fy - b.fy
      ) ?? [];


  const latestCapex =
    latestCapexRows.length > 0
      ? Number(
          latestCapexRows[
            latestCapexRows.length - 1
          ].value
        ) / 1_000_000_000
      : null;


  const latestFcf =
    latestOcf !== null &&
    latestCapex !== null
      ? latestOcf - latestCapex
      : null;


  // ==========================================================
  // FORMATTING
  // ==========================================================

  const formatBillions = (
    value: number | null
  ) => {

    if (value === null) {
      return "N/A";
    }

    return `$${value.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 1,
      }
    )}B`;
  };


  const formatBalance = (
    item: BalanceValue | null
  ) => {

    if (
      item?.value === null ||
      item?.value === undefined
    ) {
      return "N/A";
    }

    return `$${(
      Number(item.value) /
      1_000_000_000
    ).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 1,
      }
    )}B`;
  };


  // ==========================================================
  // ANALYSIS DISPLAY VALUES
  // ==========================================================

  const revenueGrowth =
    analysisData?.metrics
      .revenue_growth_percent;

  const netMargin =
    analysisData?.metrics
      .net_profit_margin_percent;

  const debtEquity =
    analysisData?.metrics
      .debt_to_equity;

  const freeCashFlow =
    analysisData?.metrics
      .free_cash_flow;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b14] text-slate-100">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

        <div className="absolute right-[-100px] top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-150px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/5 blur-3xl" />

      </div>


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="relative z-20 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">

              <CircleDollarSign size={23} />

            </div>

            <div>

              <h1 className="text-lg font-bold tracking-tight">

                FINOVA
                <span className="text-cyan-400">
                  AI
                </span>

              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Financial Intelligence
              </p>

            </div>

          </div>


          {/* Desktop navigation */}

          <div className="hidden items-center gap-8 md:flex">

            <button
              onClick={() => navigateToPage("research")}
              className={`text-sm transition ${
                activePage === "research"
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Research
            </button>

            <button
              onClick={() => navigateToPage("reports")}
              className={`text-sm transition ${
                activePage === "reports"
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Reports
            </button>

            <button
              onClick={() => navigateToPage("sources")}
              className={`text-sm transition ${
                activePage === "sources"
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sources
            </button>

            <button
              onClick={() => navigateToPage("about")}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                activePage === "about"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              About
            </button>

          </div>


          {/* Mobile menu */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="rounded-lg border border-white/10 p-2 md:hidden"
            aria-label="Toggle menu"
          >

            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}

          </button>

        </div>


        {menuOpen && (

          <div className="border-t border-white/10 px-6 py-4 md:hidden">

            <div className="flex flex-col gap-4 text-sm text-slate-300">

              <button
                onClick={() => navigateToPage("research")}
                className="text-left"
              >
                Research
              </button>

              <button
                onClick={() => navigateToPage("reports")}
                className="text-left"
              >
                Reports
              </button>

              <button
                onClick={() => navigateToPage("sources")}
                className="text-left"
              >
                Sources
              </button>

              <button
                onClick={() => navigateToPage("about")}
                className="text-left"
              >
                About
              </button>

            </div>

          </div>

        )}

      </nav>


      {/* ======================================================
          MAIN
      ====================================================== */}

      {activePage === "research" ? (

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-2 text-xs font-medium text-indigo-300">

            <Sparkles size={14} />

            Agentic AI Financial Research

          </div>


          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">

            Research companies with

            <span className="block bg-gradient-to-r from-indigo-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">

              intelligent AI agents.

            </span>

          </h2>


          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">

            Analyze financial performance, business developments, risks and
            opportunities using multiple specialized research agents.

          </p>


          {/* Search */}

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="flex flex-1 items-center gap-3 px-4">

                <Search
                  className="text-slate-500"
                  size={21}
                />

                <input
                  value={company}
                  onChange={(e) => {

                    setCompany(
                      e.target.value
                    );

                    if (error) {
                      setError("");
                    }

                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter company ticker..."
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
                />

              </div>


              <button
                onClick={analyzeCompany}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Researching...
                  </>

                ) : (

                  <>
                    Analyze Company

                    <ArrowUpRight
                      size={18}
                    />
                  </>

                )}

              </button>

            </div>
            <div className="mx-auto mt-4 max-w-3xl">
  <button
    onClick={generateFinalReport}
    disabled={finalReportLoading}
    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {finalReportLoading ? (
      <>
        <Loader2
          size={17}
          className="animate-spin"
        />
        Generating Final Report...
      </>
    ) : (
      <>
        <Sparkles size={17} />
        Generate Final Research Report
      </>
    )}
  </button>
</div>

          </div>


          <p className="mt-4 text-xs text-slate-600">

            Try: AAPL · MSFT · TSLA · NVDA

          </p>


          {/* Error */}

          {error && (

            <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-left text-sm text-red-300">

              {error}

            </div>

          )}

        </section>


        {/* ====================================================
            AGENT PIPELINE
        ==================================================== */}

        <section id="agent-pipeline" className="mt-20">

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Research Engine
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Six specialized AI agents
              </h3>

            </div>


            <span
              className={`hidden rounded-full border px-3 py-1.5 text-xs sm:block ${loading ||
                financialLoading ||
                analysisLoading ||
                newsLoading ||
                riskLoading ||
                reviewerLoading
                  ? "border-amber-400/20 bg-amber-400/5 text-amber-300"
                  : reviewerData
                    ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                    : companyData ||
                      financialData ||
                      analysisData ||
                      newsData ||
                      riskData
                      ? "border-indigo-400/20 bg-indigo-400/5 text-indigo-300"
                      : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"}`}
            >

              {loading ||
              financialLoading ||
              analysisLoading ||
              newsLoading ||
              riskLoading ||
              reviewerLoading
                ? "Agent running"
                : reviewerData
                  ? "Research complete"
                  : companyData ||
                    financialData ||
                    analysisData ||
                    newsData ||
                    riskData
                    ? "Agent ready"
                    : "Ready"}

            </span>

          </div>


                                        <div className="space-y-8">

            {agents.map((agent, index) => {

              const Icon = agent.icon;

              const isCompanyResearch = index === 0;
              const isFinancialData = index === 1;
              const isFinancialAnalysis = index === 2;
              const isNews = index === 3;
              const isRisk = index === 4;
              const isReviewer = index === 5;

              const isActive =
                (loading && isCompanyResearch) ||
                (financialLoading && isFinancialData) ||
                (analysisLoading && isFinancialAnalysis) ||
                (newsLoading && isNews) ||
                (riskLoading && isRisk) ||
                (reviewerLoading && isReviewer);

              const isComplete =
                (isCompanyResearch && Boolean(companyData)) ||
                (isFinancialData && Boolean(financialData)) ||
                (isFinancialAnalysis && Boolean(analysisData)) ||
                (isNews && Boolean(newsData)) ||
                (isRisk && Boolean(riskData)) ||
                (isReviewer && Boolean(reviewerData));

              const handleAgentClick =
                isCompanyResearch
                  ? handleCompanyResearchClick
                  : isFinancialData
                    ? handleFinancialAgentClick
                    : isFinancialAnalysis
                      ? handleAnalysisAgentClick
                      : isNews
                        ? handleNewsAgentClick
                        : isRisk
                          ? handleRiskAgentClick
                          : handleReviewerAgentClick;

              const statusText = isComplete
                ? "Completed"
                : isActive
                  ? index === 0
                    ? "Researching company..."
                    : index === 1
                      ? "Retrieving financials..."
                      : index === 2
                        ? "Analyzing financials..."
                        : index === 3
                          ? "Searching recent news..."
                          : index === 4
                            ? "Analyzing risks..."
                            : "Reviewing results..."
                  : "Click to run";

              return (

                <div key={agent.name} className="space-y-5">

                <div
                  onClick={handleAgentClick}
                  className={`group cursor-pointer rounded-2xl border p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.06] ${
                    isActive
                      ? "border-indigo-400/40 bg-indigo-500/[0.08]"
                      : "border-white/10 bg-white/[0.035]"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isComplete
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-indigo-500/10 text-indigo-300"
                      }`}
                    >

                      {isComplete ? (

                        <CheckCircle2 size={20} />

                      ) : isActive ? (

                        <Loader2
                          size={20}
                          className="animate-spin"
                        />

                      ) : (

                        <Icon size={20} />

                      )}

                    </div>

                    <span className="text-xs text-slate-600">
                      0{index + 1}
                    </span>

                  </div>

                  <h4 className="mt-5 font-semibold">
                    {agent.name}
                  </h4>

                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">

                    {statusText}

                    <ChevronRight size={13} />

                  </div>

                </div>

        {/* ====================================================
            COMPANY RESULT
        ==================================================== */}

        {isCompanyResearch && companyData && (

          <section id="company-research" className="mx-auto mt-0 max-w-5xl">

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                <div>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-300">

                    <CheckCircle2 size={13} />

                    SEC company identified

                  </div>


                  <h3 className="text-3xl font-bold tracking-tight">

                    {companyData.company_name}

                  </h3>


                  <p className="mt-2 text-sm text-slate-400">

                    {companyData.sic_description ||
                      "Public company"}

                  </p>

                </div>


                <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/5 px-7 py-4 text-center">

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Ticker
                  </p>

                  <p className="mt-1 text-2xl font-bold text-indigo-300">
                    {companyData.ticker}
                  </p>

                </div>

              </div>


              {/* Company metadata */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">

                  <p className="text-xs text-slate-500">
                    Exchange
                  </p>

                  <p className="mt-2 font-semibold">
                    {companyData.exchange ||
                      "N/A"}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/20 p-4">

                  <p className="text-xs text-slate-500">
                    SEC CIK
                  </p>

                  <p className="mt-2 font-semibold">
                    {companyData.cik}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/20 p-4">

                  <p className="text-xs text-slate-500">
                    Fiscal Year End
                  </p>

                  <p className="mt-2 font-semibold">
                    {companyData.fiscal_year_end ||
                      "N/A"}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/20 p-4">

                  <p className="text-xs text-slate-500">
                    Incorporated
                  </p>

                  <p className="mt-2 font-semibold">
                    {companyData.state_of_incorporation ||
                      "N/A"}
                  </p>

                </div>

              </div>


              {/* Recent SEC filings */}

              {companyData.recent_filings &&
                companyData.recent_filings.length > 0 && (

                  <div className="mt-8">

                    <div className="mb-4 flex items-center justify-between">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                          SEC Evidence
                        </p>

                        <h4 className="mt-1 text-lg font-semibold">
                          Recent filings
                        </h4>

                      </div>

                      <FileSearch
                        size={20}
                        className="text-cyan-400"
                      />

                    </div>


                    <div className="space-y-2">

                      {companyData.recent_filings
                        .slice(0, 5)
                        .map((filing) => (

                          <div
                            key={`${filing.accession_number}-${filing.form}`}
                            className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                          >

                            <div className="flex items-center gap-3">

                              <span className="rounded-lg bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                                {filing.form}
                              </span>

                              <span className="text-sm text-slate-300">
                                {filing.primary_document}
                              </span>

                            </div>

                            <span className="text-xs text-slate-500">
                              {filing.filing_date}
                            </span>

                          </div>

                        ))}

                    </div>

                  </div>

                )}

            </div>

          </section>

        )}



        {/* ====================================================
            FINANCIAL DATA
        ==================================================== */}

        {isFinancialData && financialData && (

          <section
            id="financial-data"
            className="mt-20 scroll-mt-8"
          >

            <div className="mb-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Financial Data Agent
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Verified financial information
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Financial information retrieved from SEC company filings.
              </p>

            </div>


            {/* Financial cards */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-sm text-slate-500">
                  Latest Revenue
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {formatBillions(
                    latestRevenue
                  )}
                </p>

                <p className="mt-2 text-xs text-emerald-400">
                  SEC reported
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-sm text-slate-500">
                  Net Income
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {formatBillions(
                    latestNetIncome
                  )}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Latest fiscal year
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-sm text-slate-500">
                  Operating Cash Flow
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {formatBillions(
                    latestOcf
                  )}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Cash generated from operations
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-sm text-slate-500">
                  Free Cash Flow
                </p>

                <p className="mt-3 text-2xl font-bold text-emerald-300">
                  {formatBillions(
                    latestFcf
                  )}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  OCF minus capital expenditure
                </p>

              </div>

            </div>


            {/* Revenue chart */}

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Revenue Trend
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    Historical annual revenue
                  </p>

                </div>

                <BarChart3
                  className="text-indigo-400"
                  size={22}
                />

              </div>


              {annualRevenue.length > 0 ? (

                <div className="mt-8 h-72 w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={annualRevenue}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.08)"
                      />

                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        tick={{
                          fill: "#64748b",
                          fontSize: 12,
                        }}
                      />

                      <YAxis
                        stroke="#64748b"
                        tick={{
                          fill: "#64748b",
                          fontSize: 12,
                        }}
                        tickFormatter={(value) =>
                          `$${value}B`
                        }
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            "#0f172a",
                          border:
                            "1px solid rgba(255,255,255,0.1)",
                          borderRadius:
                            "12px",
                          color:
                            "#ffffff",
                        }}
                        formatter={(value) => [
                          `$${Number(value).toFixed(
                            1
                          )}B`,
                          "Revenue",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="mt-8 flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10">

                  <p className="text-sm text-slate-500">
                    No historical revenue data available.
                  </p>

                </div>

              )}

            </div>


            {/* Balance sheet */}

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6">

              <div className="flex items-center gap-3">

                <CircleDollarSign
                  className="text-cyan-400"
                  size={21}
                />

                <div>

                  <p className="font-semibold">
                    Balance Sheet Snapshot
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest available balance sheet values
                  </p>

                </div>

              </div>


              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Assets
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .assets
                    )}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Liabilities
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .liabilities
                    )}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Cash
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .cash
                    )}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Equity
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .equity
                    )}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Long-Term Debt
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .long_term_debt
                    )}
                  </p>

                </div>


                <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                  <p className="text-xs text-slate-500">
                    Current Debt
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatBalance(
                      financialData
                        .financial_data
                        .balance_sheet
                        .current_debt
                    )}
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}


{isFinancialAnalysis && analysisData && (
  <>
        {/* ====================================================
            ANALYSIS PREVIEW
        ==================================================== */}

        <section className="mt-0 scroll-mt-8">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Analysis Preview
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              One report. Every important signal.
            </h3>

          </div>


          {/* Financial metrics */}

          <div className="grid gap-4 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

              <p className="text-sm text-slate-500">
                Revenue Growth
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold">

                  {revenueGrowth !== null &&
                  revenueGrowth !== undefined
                    ? `${revenueGrowth.toFixed(2)}%`
                    : "Pending"}

                </p>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-500">

                  {analysisData
                    ? "Calculated"
                    : "Awaiting analysis"}

                </span>

              </div>

            </div>


            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

              <p className="text-sm text-slate-500">
                Net Margin
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold">

                  {netMargin !== null &&
                  netMargin !== undefined
                    ? `${netMargin.toFixed(2)}%`
                    : "Pending"}

                </p>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-500">

                  {analysisData
                    ? "Calculated"
                    : "Awaiting analysis"}

                </span>

              </div>

            </div>


            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

              <p className="text-sm text-slate-500">
                Debt / Equity
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold">

                  {debtEquity !== null &&
                  debtEquity !== undefined
                    ? debtEquity.toFixed(2)
                    : "Pending"}

                </p>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-500">

                  {analysisData
                    ? "Calculated"
                    : "Awaiting analysis"}

                </span>

              </div>

            </div>


            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

              <p className="text-sm text-slate-500">
                Free Cash Flow
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">

                <p className="text-2xl font-bold">

                  {freeCashFlow !== null &&
                  freeCashFlow !== undefined
                    ? `$${(
                        freeCashFlow /
                        1_000_000_000
                      ).toFixed(1)}B`
                    : "Pending"}

                </p>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-500">

                  {analysisData
                    ? "Calculated"
                    : "Awaiting analysis"}

                </span>

              </div>

            </div>

          </div>



          </section>

          {/* ==================================================
              FINANCIAL ANALYSIS DETAILS
          ================================================== */}

          {analysisData && (

            <div
              id="financial-analysis"
              className="mt-0 scroll-mt-8"
            >

              <div className="grid gap-4 lg:grid-cols-3">


                {/* Profitability */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                  <div className="flex items-center gap-3">

                    <TrendingUp
                      className="text-cyan-400"
                      size={21}
                    />

                    <p className="font-semibold">
                      Profitability
                    </p>

                  </div>


                  <div className="mt-6 space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Net Income
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.net_income !== null

                          ? formatBillions(
                              analysisData.metrics.net_income /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Net Margin
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.net_profit_margin_percent !== null

                          ? `${analysisData.metrics.net_profit_margin_percent.toFixed(
                              2
                            )}%`

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Return on Assets
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.return_on_assets_percent !== null

                          ? `${analysisData.metrics.return_on_assets_percent.toFixed(
                              2
                            )}%`

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Return on Equity
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.return_on_equity_percent !== null

                          ? `${analysisData.metrics.return_on_equity_percent.toFixed(
                              2
                            )}%`

                          : "N/A"}

                      </span>

                    </div>

                  </div>

                </div>


                {/* Cash Flow */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                  <div className="flex items-center gap-3">

                    <CircleDollarSign
                      className="text-emerald-400"
                      size={21}
                    />

                    <p className="font-semibold">
                      Cash Flow
                    </p>

                  </div>


                  <div className="mt-6 space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Operating Cash Flow
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.operating_cash_flow !== null

                          ? formatBillions(
                              analysisData.metrics.operating_cash_flow /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Capital Expenditure
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.capital_expenditure !== null

                          ? formatBillions(
                              analysisData.metrics.capital_expenditure /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Free Cash Flow
                      </span>

                      <span className="font-semibold text-emerald-300">

                        {analysisData.metrics.free_cash_flow !== null

                          ? formatBillions(
                              analysisData.metrics.free_cash_flow /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>

                  </div>

                </div>


                {/* Balance & Leverage */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                  <div className="flex items-center gap-3">

                    <ShieldAlert
                      className="text-indigo-400"
                      size={21}
                    />

                    <p className="font-semibold">
                      Balance & Leverage
                    </p>

                  </div>


                  <div className="mt-6 space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Total Debt
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.total_debt !== null

                          ? formatBillions(
                              analysisData.metrics.total_debt /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Debt / Equity
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.debt_to_equity !== null

                          ? analysisData.metrics.debt_to_equity.toFixed(
                              2
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Assets
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.assets !== null

                          ? formatBillions(
                              analysisData.metrics.assets /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-sm text-slate-500">
                        Cash
                      </span>

                      <span className="font-medium">

                        {analysisData.metrics.cash !== null

                          ? formatBillions(
                              analysisData.metrics.cash /
                                1_000_000_000
                            )

                          : "N/A"}

                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* ==================================================
                  OBSERVATIONS
              ================================================== */}

              {analysisData.observations &&
                analysisData.observations.length > 0 && (

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                    <div className="flex items-center gap-3">

                      <BrainCircuit
                        className="text-cyan-400"
                        size={21}
                      />

                      <div>

                        <p className="font-semibold">
                          Financial Analysis Insights
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Calculated from verified financial data
                        </p>

                      </div>

                    </div>


                    <div className="mt-5 grid gap-3 md:grid-cols-2">

                      {analysisData.observations.map(
                        (
                          observation,
                          index
                        ) => (

                          <div
                            key={index}
                            className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-4"
                          >

                            <CheckCircle2
                              size={18}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <p className="text-sm leading-6 text-slate-300">
                              {observation}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}


              {/* Methodology */}

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                <div className="flex items-center gap-3">

                  <FileSearch
                    className="text-indigo-400"
                    size={21}
                  />

                  <div>

                    <p className="font-semibold">
                      Calculation Methodology
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Transparent and traceable financial calculations
                    </p>

                  </div>

                </div>


                <div className="mt-5 grid gap-3 md:grid-cols-2">

                  {Object.entries(
                    analysisData.methodology ||
                    {}
                  ).map(
                    (
                      [key, value]
                    ) => (

                      <div
                        key={key}
                        className="rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          {key.replace(
                            /_/g,
                            " "
                          )}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {value}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}


  </>
)}

          {/* ====================================================
              NEWS & DEVELOPMENTS
          ==================================================== */}

          {isNews && newsData && (

            <section
              id="news-developments"
              className="mt-0 scroll-mt-8"
            >

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  News & Developments Agent
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Recent company developments
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Recent web-search results related to the company.
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="font-semibold">
                      Research Summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {displayedNews?.overall_summary ||
                        `Recent developments retrieved for ${displayedNews?.ticker || company}.`}
                    </p>

                  </div>

                  <Newspaper
                    className="shrink-0 text-cyan-400"
                    size={22}
                  />

                </div>

                {Array.isArray(displayedNews?.articles) &&
                   displayedNews.articles.length > 0 ? (
                  <div className="mt-6 space-y-3">

                    {displayedNews.articles.map(
                      (article: any, index: number) => (

                        <div
                          key={`${article.url || article.title}-${index}`}
                          className="rounded-xl border border-white/5 bg-black/10 p-4"
                        >

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div className="min-w-0">

                              <p className="font-medium text-slate-200">
                                {article.title || "Untitled article"}
                              </p>

                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                {article.summary ||
                                  "No article summary available."}
                              </p>

                            </div>

                            <span className="shrink-0 rounded-full bg-indigo-400/10 px-2.5 py-1 text-[10px] text-indigo-300">
                              {article.source || "Web source"}
                            </span>

                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">

                            {article.date && (
                              <span>
                                {article.date}
                              </span>
                            )}

                            {article.url && (

                              <a
                                href={article.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                className="inline-flex items-center gap-1 text-cyan-400 transition hover:text-cyan-300"
                              >
                                Open source
                                <ArrowUpRight size={12} />
                              </a>

                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-slate-500">
                    No recent news results were returned.
                  </div>

                )}

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-600">

                  <span>
                    Source: {displayedNews?.source || "Tavily Web Search"}
                  </span>

                  <span>
                    {displayedNews?.status || "completed"}
                  </span>

                </div>

              </div>

            </section>

          )}



          {/* ====================================================
              RISK ANALYSIS
          ==================================================== */}

          {isRisk && riskData && (

            <section
              id="risk-analysis"
              className="mt-0 scroll-mt-8"
            >

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Risk Analysis Agent
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Key business and financial risks
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Risks are derived from the verified financial analysis and recent developments.
                </p>

              </div>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                  <p className="text-sm text-slate-500">
                    Overall Risk
                  </p>

                  <p className="mt-3 text-3xl font-bold capitalize">
                    {riskData.overall_risk || "N/A"}
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    Rule-based assessment using available evidence
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                  <p className="text-sm text-slate-500">
                    Risk Score
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {riskData.risk_score ?? "N/A"}
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    Combined severity score
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

                <div className="flex items-center gap-3">

                  <ShieldAlert
                    className="text-amber-400"
                    size={21}
                  />

                  <p className="font-semibold">
                    Risk Breakdown
                  </p>

                </div>

                {Array.isArray(riskData.risks) &&
                  riskData.risks.length > 0 ? (

                  <div className="mt-5 grid gap-3 md:grid-cols-2">

                    {riskData.risks.map(
                      (risk: any, index: number) => (

                        <div
                          key={`${risk.category || "risk"}-${index}`}
                          className="rounded-xl border border-white/5 bg-black/10 p-4"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <p className="font-medium text-slate-200">
                              {risk.category || `Risk ${index + 1}`}
                            </p>

                            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase text-slate-400">
                              {risk.severity || "unknown"}
                            </span>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-400">
                            {risk.finding ||
                             risk.reason ||
                             risk.description ||
                             risk.details ||
                                "No additional explanation provided."}
                          </p>
                          {risk.evidence && (

                            <p className="mt-3 text-xs leading-5 text-slate-600">
                              Evidence:{" "}
                              {typeof risk.evidence === "object"
                                ? JSON.stringify(risk.evidence)
                                : risk.evidence}
                            </p>

                          )}

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-slate-500">
                    No detailed risk items were returned.
                  </div>

                )}

              </div>

            </section>

          )}



          {/* ====================================================
              AI REVIEWER
          ==================================================== */}
          {isReviewer && reviewerData && (
          <section
                   id="ai-reviewer"
                  className="mt-0 scroll-mt-8"
  >
                   <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        AI Reviewer Agent
      </p>

      <h3 className="mt-2 text-2xl font-semibold">
        Evidence and calculation validation
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        The reviewer checks whether important calculations and evidence are present.
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

      {/* Review status */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm text-slate-500">
            Review Status
          </p>

          <p className="mt-2 text-2xl font-bold capitalize">
            {(reviewerData.overall_status || "unknown").replace(/_/g, " ")}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-4 text-center">
          <p className="text-2xl font-bold text-emerald-300">
            {reviewerData.verified_checks ?? 0}

            <span className="text-slate-600">
              {" / "}
              {reviewerData.total_checks ?? 0}
            </span>
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Checks passed
          </p>
        </div>

      </div>

      {/* Reviewer summary */}
      <p className="mt-6 rounded-xl border border-white/5 bg-black/10 p-4 text-sm leading-6 text-slate-300">
        {reviewerData.reviewer_summary ||
          "No reviewer summary was returned."}
      </p>

      {/* Validation checks */}
      {Array.isArray(reviewerData.checks) &&
        reviewerData.checks.length > 0 && (
          <div className="mt-5 space-y-3">

            {reviewerData.checks.map(
              (check: any, index: number) => {

                const isVerified =
                  check.status === "verified" ||
                  check.passed === true;

                return (
                  <div
                    key={`${check.claim || check.check || "check"}-${index}`}
                    className="rounded-xl border border-white/5 bg-black/10 p-4"
                  >

                    <div className="flex gap-3">

                      {/* Status icon */}
                      <CheckCircle2
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          isVerified
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      />

                      <div className="min-w-0 flex-1">

                        {/* Claim */}
                        <p className="font-medium text-slate-200">
                          {check.claim ||
                            check.check ||
                            check.name ||
                            `Validation check ${index + 1}`}
                        </p>

                        {/* Status message */}
                        <p
                          className={`mt-1 text-sm leading-6 ${
                            isVerified
                              ? "text-emerald-400/80"
                              : "text-amber-400/80"
                          }`}
                        >
                          {isVerified
                            ? "Evidence and calculation verified."
                            : "Needs review — required supporting evidence is incomplete."}
                        </p>

                        {/* Evidence */}
                        {check.evidence &&
                          typeof check.evidence === "object" && (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">

                              {Object.entries(check.evidence).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                                  >
                                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                                      {key.replace(/_/g, " ")}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {value === null ||
                                      value === undefined
                                        ? "Unavailable"
                                        : typeof value === "number"
                                          ? value.toLocaleString(
                                              undefined,
                                              {
                                                maximumFractionDigits: 2,
                                              }
                                            )
                                          : String(value)}
                                    </p>
                                  </div>
                                )
                              )}

                            </div>
                          )}

                      </div>
                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

    </div>
  </section>
)}
                  </div>
                );
              })}

          </div>

        </section>

        {/* ====================================================
            ANNUAL REPORTS
        ==================================================== */}

        <section
          id="annual-reports"
          className="mt-20 scroll-mt-8"
        >

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Annual Report Check
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                SEC annual filings
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Recent Form 10-K filings are checked as part of the evidence layer.
              </p>

            </div>

            <FileText
              className="hidden text-cyan-400 sm:block"
              size={24}
            />

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

            {annualReports.length > 0 ? (

              <div className="space-y-3">

                {annualReports.slice(0, 5).map(
                  (filing, index) => {

                    const accessionPath =
                      filing.accession_number.replace(
                        /-/g,
                        ""
                      );

                    const cikNumber =
                      companyData?.cik
                        ? String(
                            Number(companyData.cik)
                          )
                        : "";

                    const filingUrl =
                      cikNumber &&
                      filing.primary_document
                        ? `https://www.sec.gov/Archives/edgar/data/${cikNumber}/${accessionPath}/${filing.primary_document}`
                        : "";

                    return (

                      <div
                        key={`${filing.accession_number}-${index}`}
                        className="rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <div className="flex items-center gap-2">

                              <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
                                {filing.form}
                              </span>

                              <span className="text-xs text-slate-500">
                                Filed {filing.filing_date}
                              </span>

                            </div>

                            <p className="mt-3 font-medium text-slate-200">
                              {filing.primary_document}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              Accession: {filing.accession_number}
                            </p>

                          </div>

                          {filingUrl && (

                            <a
                              href={filingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/10"
                            >
                              View SEC filing
                              <ArrowUpRight size={13} />
                            </a>

                          )}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10 text-center">

                <div>

                  <FileSearch
                    size={28}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                      No recent 10-K annual reports were found.
                  </p>

                </div>

              </div>

            )}

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs">

              <span className="text-slate-600">
                Source: U.S. SEC filings
              </span>

              <span
                className={
                  annualReports.length > 0
                    ? "text-emerald-400"
                    : "text-slate-600"
                }
              >
                {annualReports.length > 0
                  ? `${annualReports.length} annual filing(s) checked`
                  : "Ready"}
              </span>

            </div>

          </div>

        </section>



          {finalReport && (
            <FinalReport report={finalReport} />
          )}


          {/* ==================================================
              CHART + EVIDENCE
          ================================================== */}

          <div className="mt-4 grid gap-4 lg:grid-cols-3">

            {/* Revenue chart summary */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 lg:col-span-2">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Revenue Trend
                  </p>

                  <p className="mt-1 text-xl font-semibold">

                    {financialData
                      ? "Historical financial performance"
                      : "Waiting for financial data"}

                  </p>

                </div>

                <BarChart3
                  className="text-indigo-400"
                  size={22}
                />

              </div>


              {annualRevenue.length > 0 ? (

                <div className="mt-6 h-52">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={annualRevenue}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />

                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        stroke="#64748b"
                        tick={{
                          fontSize: 11,
                        }}
                        tickFormatter={(value) =>
                          `$${value}B`
                        }
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            "#0f172a",
                          border:
                            "1px solid rgba(255,255,255,0.1)",
                          borderRadius:
                            "10px",
                        }}
                        formatter={(value) => [
                          `$${Number(value).toFixed(
                            1
                          )}B`,
                          "Revenue",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="mt-8 flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10">

                  <div className="text-center">

                    <BarChart3
                      size={28}
                      className="mx-auto text-slate-700"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Financial chart will appear after analysis
                    </p>

                  </div>

                </div>

              )}


              <div className="mt-4 flex justify-between text-[10px] text-slate-600">

                <span>
                  Historical
                </span>

                <span>
                  Financial data
                </span>

                <span>
                  Analysis
                </span>

              </div>

            </div>


            {/* Evidence */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">

              <div className="flex items-center gap-3">

                <FileSearch
                  className="text-cyan-400"
                  size={21}
                />

                <p className="font-semibold">
                  Evidence Layer
                </p>

              </div>


              <p className="mt-5 text-sm leading-6 text-slate-400">

                Every important claim will be connected to financial
                filings, company documents and trusted news sources.

              </p>


              <div className="mt-6 space-y-3">

                {[
                  [
                    "SEC Filings",
                    companyData
                      ? "Connected"
                      : "Ready",
                  ],

                  [
                    "Financial Data",
                    financialData
                      ? "Connected"
                      : "Ready",
                  ],

                  [
                    "Financial Analysis",
                    analysisData
                      ? "Connected"
                      : "Ready",
                  ],

                  [
                    "Annual Reports",
                    companyData
                      ? "Connected"
                      : "Ready",
                  ],


                  [
                    "Market News",
                    newsData
                      ? "Connected"
                      : "Ready",
                  ],

                  [
                    "Risk Analysis",
                    riskData
                      ? "Connected"
                      : "Ready",
                  ],

                  [
                    "AI Reviewer",
                    reviewerData
                      ? "Connected"
                      : "Ready",
                  ],

                ].map(
                  ([item, status]) => (

                    <div
                      key={item}
                      onClick={() => {
                        if (item === "Annual Reports") {
                          document
                            .getElementById("annual-reports")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }
                      }}
                      className={`flex items-center justify-between rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm ${
                        item === "Annual Reports"
                          ? "cursor-pointer transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
                          : ""
                      }`}
                    >

                      <span className="text-slate-300">
                        {item}
                      </span>

                      <span
                        className={
                          status ===
                          "Connected"
                            ? "text-emerald-400"
                            : "text-slate-600"
                        }
                      >
                        {status}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>




        {/* ====================================================
            DISCLAIMER
        ==================================================== */}

        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-amber-400/10 bg-amber-400/[0.03] px-5 py-4 text-center text-xs leading-5 text-slate-500">

          FINOVA AI provides research and analytical information for
          informational purposes only. It is not personalized investment
          advice or a recommendation to buy or sell securities.

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-600">

          FINOVA AI · Evidence-based financial research · Powered by
          specialized AI agents

        </footer>

      </main>

    ) : activePage === "reports" ? (

            <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">

        {/* ====================================================
            REPORTS HERO
        ==================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/20 sm:p-10">

          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300">
                <FileText size={14} />
                Research Reports
              </div>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Financial intelligence,
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  organized into one report.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Review financial performance, calculated metrics, business
                observations, risk signals and AI reviewer validation in one
                structured research report.
              </p>

            </div>

            {analysisData && (
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Research status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-300">
                    Analysis available
                  </p>
                </div>
              </div>
            )}

          </div>


          {!analysisData ? (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="relative mt-12 overflow-hidden rounded-3xl border border-dashed border-white/10 bg-black/20 p-10 text-center sm:p-16">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10">
                <FileSearch
                  size={28}
                  className="text-indigo-300"
                />
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                No research report yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Start a company analysis from the Research page. Once the
                Financial Analysis Agent completes, your report will appear
                here automatically.
              </p>

              <button
                onClick={() => navigateToPage("research")}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
              >
                Start Research
                <ArrowUpRight size={16} />
              </button>

            </div>

          ) : (

            /* ==================================================
               REPORT CONTENT
            ================================================== */

            <div className="relative mt-12 space-y-6">

              {/* ================================================
                  REPORT HEADER
              ================================================= */}

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-8">

                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Company under analysis
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">

                      <h3 className="text-2xl font-bold sm:text-3xl">
                        {companyData?.company_name ||
                          company ||
                          "Unknown Company"}
                      </h3>

                      <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {analysisData.ticker}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Evidence-based financial research and analysis
                    </p>

                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">

                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />

                    Data processed

                  </div>

                </div>

              </div>


              {/* ================================================
                  KEY METRICS
              ================================================= */}

              <div>

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      Key Metrics
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Financial performance snapshot
                    </h3>
                  </div>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Revenue Growth */}

                  <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/20">

                    <div className="flex items-center justify-between">

                      <p className="text-xs text-slate-500">
                        Revenue Growth
                      </p>

                      <TrendingUp
                        size={17}
                        className="text-cyan-400"
                      />

                    </div>

                    <p className="mt-4 text-2xl font-bold">

                      {analysisData.metrics.revenue_growth_percent != null
                        ? `${analysisData.metrics.revenue_growth_percent.toFixed(2)}%`
                        : "N/A"}

                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Year-over-year change
                    </p>

                  </div>


                  {/* Net Profit Margin */}

                  <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/20">

                    <div className="flex items-center justify-between">

                      <p className="text-xs text-slate-500">
                        Net Profit Margin
                      </p>

                      <CircleDollarSign
                        size={17}
                        className="text-emerald-400"
                      />

                    </div>

                    <p className="mt-4 text-2xl font-bold">

                      {analysisData.metrics.net_profit_margin_percent != null
                        ? `${analysisData.metrics.net_profit_margin_percent.toFixed(2)}%`
                        : "N/A"}

                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Profitability indicator
                    </p>

                  </div>


                  {/* Free Cash Flow */}

                  <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/20">

                    <div className="flex items-center justify-between">

                      <p className="text-xs text-slate-500">
                        Free Cash Flow
                      </p>

                      <Wallet
                        size={17}
                        className="text-indigo-400"
                      />

                    </div>

                    <p className="mt-4 text-2xl font-bold">

                      {analysisData.metrics.free_cash_flow != null
                        ? `$${(
                            analysisData.metrics.free_cash_flow / 1e9
                          ).toFixed(2)}B`
                        : "N/A"}

                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Operating cash flow minus capex
                    </p>

                  </div>


                  {/* Debt / Equity */}

                  <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-amber-400/20">

                    <div className="flex items-center justify-between">

                      <p className="text-xs text-slate-500">
                        Debt / Equity
                      </p>

                      <Scale
                        size={17}
                        className="text-amber-400"
                      />

                    </div>

                    <p className="mt-4 text-2xl font-bold">

                      {analysisData.metrics.debt_to_equity != null
                        ? analysisData.metrics.debt_to_equity.toFixed(2)
                        : "N/A"}

                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      Capital structure indicator
                    </p>

                  </div>

                </div>

              </div>


              {/* ================================================
                  FINANCIAL OVERVIEW
              ================================================= */}

              <div className="grid gap-6 lg:grid-cols-2">

                {/* Revenue */}

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                      <BarChart3
                        size={19}
                        className="text-cyan-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Revenue
                      </p>

                      <h3 className="mt-1 font-semibold">
                        Latest financial performance
                      </h3>

                    </div>

                  </div>

                  <div className="mt-6 space-y-4">

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">

                      <span className="text-sm text-slate-500">
                        Latest Revenue
                      </span>

                      <span className="text-lg font-semibold">

                        {analysisData.metrics.latest_revenue != null
                          ? `$${(
                              analysisData.metrics.latest_revenue / 1e9
                            ).toFixed(2)}B`
                          : "N/A"}

                      </span>

                    </div>

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">

                      <span className="text-sm text-slate-500">
                        Previous Revenue
                      </span>

                      <span className="text-lg font-semibold">

                        {analysisData.metrics.previous_revenue != null
                          ? `$${(
                              analysisData.metrics.previous_revenue / 1e9
                            ).toFixed(2)}B`
                          : "N/A"}

                      </span>

                    </div>

                    <div className="flex items-end justify-between">

                      <span className="text-sm text-slate-500">
                        Growth
                      </span>

                      <span className="text-lg font-semibold text-cyan-300">

                        {analysisData.metrics.revenue_growth_percent != null
                          ? `${analysisData.metrics.revenue_growth_percent.toFixed(2)}%`
                          : "N/A"}

                      </span>

                    </div>

                  </div>

                </div>


                {/* Cash Flow */}

                <div className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                      <Wallet
                        size={19}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Cash Flow
                      </p>

                      <h3 className="mt-1 font-semibold">
                        Cash generation profile
                      </h3>

                    </div>

                  </div>

                  <div className="mt-6 space-y-4">

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">

                      <span className="text-sm text-slate-500">
                        Operating Cash Flow
                      </span>

                      <span className="text-lg font-semibold">

                        {analysisData.metrics.operating_cash_flow != null
                          ? `$${(
                              analysisData.metrics.operating_cash_flow / 1e9
                            ).toFixed(2)}B`
                          : "N/A"}

                      </span>

                    </div>

                    <div className="flex items-end justify-between border-b border-white/5 pb-4">

                      <span className="text-sm text-slate-500">
                        Capital Expenditure
                      </span>

                      <span className="text-lg font-semibold">

                        {analysisData.metrics.capital_expenditure != null
                          ? `$${(
                              analysisData.metrics.capital_expenditure / 1e9
                            ).toFixed(2)}B`
                          : "N/A"}

                      </span>

                    </div>

                    <div className="flex items-end justify-between">

                      <span className="text-sm text-slate-500">
                        Free Cash Flow
                      </span>

                      <span className="text-lg font-semibold text-emerald-300">

                        {analysisData.metrics.free_cash_flow != null
                          ? `$${(
                              analysisData.metrics.free_cash_flow / 1e9
                            ).toFixed(2)}B`
                          : "N/A"}

                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================================================
                  KEY OBSERVATIONS
              ================================================= */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10">
                    <Lightbulb
                      size={19}
                      className="text-indigo-300"
                    />
                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-wider text-indigo-300">
                      AI Analysis
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Key observations
                    </h3>

                  </div>

                </div>


                <div className="mt-6 grid gap-3">

                  {analysisData.observations?.length > 0 ? (

                    analysisData.observations.map(
                      (observation, index) => (

                        <div
                          key={`${observation}-${index}`}
                          className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-5 transition hover:border-indigo-400/20"
                        >

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-400/10 text-xs font-semibold text-indigo-300">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <p className="text-sm leading-7 text-slate-400">
                            {observation}
                          </p>

                        </div>

                      )
                    )

                  ) : (

                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-600">
                      No observations available.
                    </div>

                  )}

                </div>

              </section>


              {/* ================================================
                  REVIEWER VALIDATION
              ================================================= */}

              <section className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6 sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <ShieldCheck
                        size={23}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-emerald-400">
                        AI Reviewer
                      </p>

                      <h3 className="mt-1 font-semibold">
                        Research validation
                      </h3>

                    </div>

                  </div>

                  <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">

                    {reviewerData
                      ? "Validation completed"
                      : "Validation pending"}

                  </div>

                </div>


                <div className="mt-6 border-t border-emerald-400/10 pt-5">

                  <p className="text-sm leading-7 text-slate-400">

                    {reviewerData?.reviewer_summary ||
                      "Reviewer validation will appear here after the AI Reviewer Agent completes its checks."}

                  </p>

                </div>

              </section>


              {/* ================================================
                  REPORT COMPONENTS
              ================================================= */}

              <section className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-8">

                <div className="mb-6">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Report Coverage
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    What this research includes
                  </h3>

                </div>


                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {[
                    [
                      "Company Research",
                      "Company identity, filings and business information.",
                      Globe2,
                    ],
                    [
                      "Financial Data",
                      "Historical financial facts from public filings.",
                      BarChart3,
                    ],
                    [
                      "Financial Analysis",
                      "Transparent calculations and financial indicators.",
                      TrendingUp,
                    ],
                    [
                      "News & Developments",
                      "Recent company developments and market events.",
                      Newspaper,
                    ],
                    [
                      "Risk Analysis",
                      "Potential financial and business risk signals.",
                      ShieldAlert,
                    ],
                    [
                      "AI Reviewer",
                      "Validation of evidence, calculations and coverage.",
                      BrainCircuit,
                    ],
                  ].map(
                    ([title, description, Icon]) => {

                      const AgentIcon = Icon as React.ElementType;

                      return (

                        <div
                          key={title as string}
                          className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-cyan-400/15 hover:bg-white/[0.035]"
                        >

                          <AgentIcon
                            size={18}
                            className="text-cyan-400"
                          />

                          <p className="mt-4 text-sm font-semibold">
                            {title as string}
                          </p>

                          <p className="mt-2 text-xs leading-6 text-slate-600">
                            {description as string}
                          </p>

                        </div>

                      );

                    }
                  )}

                </div>

              </section>


              {/* ================================================
                  REPORT DISCLAIMER
              ================================================= */}

              <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] px-5 py-4">

                <div className="flex gap-3">

                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />

                  <p className="text-xs leading-6 text-slate-500">
                    FINOVA AI provides research and analytical information
                    for informational purposes only. It is not personalized
                    investment advice or a recommendation to buy or sell
                    securities.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-600">
          FINOVA AI · Evidence-based financial research · Powered by
          specialized AI agents
        </footer>

      </main>

    ) : activePage === "sources" ? (
            <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">

        {/* ====================================================
            SOURCES HERO
        ==================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/20 sm:p-10">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-2 text-xs font-medium text-indigo-300">
                  <Link2 size={14} />
                  Evidence Center
                </div>

                <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                  Every insight should have
                  <span className="block bg-gradient-to-r from-indigo-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                    a research trail.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  FINOVA AI separates retrieved source evidence from
                  calculated financial metrics and AI-generated interpretation,
                  making the research process easier to inspect and validate.
                </p>

              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <CheckCircle2
                    size={20}
                    className="text-cyan-400"
                  />
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Evidence status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-cyan-300">
                    Traceable research
                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                SOURCE STATISTICS
            ================================================== */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-500">
                    SEC Filings
                  </p>

                  <FileText
                    size={17}
                    className="text-cyan-400"
                  />

                </div>

                <p className="mt-4 text-2xl font-bold">
                  {companyData?.recent_filings?.length || 0}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Recent public filings
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-500">
                    Annual Reports
                  </p>

                  <FileSearch
                    size={17}
                    className="text-indigo-400"
                  />

                </div>

                <p className="mt-4 text-2xl font-bold">
                  {annualReports.length}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  10-K filings available
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-500">
                    Web Sources
                  </p>

                  <Newspaper
                    size={17}
                    className="text-cyan-400"
                  />

                </div>

                <p className="mt-4 text-2xl font-bold">
                  {newsData?.articles?.length || 0}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Recent news articles
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-500">
                    Active Company
                  </p>

                  <Globe2
                    size={17}
                    className="text-emerald-400"
                  />

                </div>

                <p className="mt-4 text-2xl font-bold">
                  {companyData?.ticker || "—"}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Current research target
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            HOW EVIDENCE FLOWS
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <BrainCircuit
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Evidence Pipeline
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                From source data to research insight
              </h3>

            </div>

          </div>


          <div className="mt-7 grid gap-3 md:grid-cols-4">

            {[
              [
                "01",
                "Source Facts",
                "Retrieve company filings, financial facts and recent developments.",
              ],
              [
                "02",
                "Financial Data",
                "Normalize and organize the information used by analysis agents.",
              ],
              [
                "03",
                "Calculations",
                "Derive metrics such as growth, margins, cash flow and leverage.",
              ],
              [
                "04",
                "AI Interpretation",
                "Specialized agents interpret the evidence and identify risks and opportunities.",
              ],
            ].map(
              ([number, title, description]) => (

                <div
                  key={number}
                  className="relative rounded-2xl border border-white/5 bg-black/20 p-5"
                >

                  <span className="text-xs font-semibold text-cyan-400">
                    {number}
                  </span>

                  <h4 className="mt-4 text-sm font-semibold">
                    {title}
                  </h4>

                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    {description}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* ====================================================
            SOURCE TYPES
        ==================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Research Infrastructure
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Sources used by FINOVA AI
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Different source types serve different stages of the research
              pipeline, from factual company identification to recent
              developments and document-based evidence.
            </p>

          </div>


          <div className="grid gap-5 lg:grid-cols-3">

            {/* SEC */}

            <div className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-cyan-400/20">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">
                  <FileText
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  Primary
                </span>

              </div>

              <h4 className="mt-5 text-lg font-semibold">
                SEC EDGAR
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Used for company identification, SEC filings and XBRL
                financial facts. These filings provide the factual foundation
                for the financial research pipeline.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4">

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    Filing records
                  </span>

                  <span className="text-slate-400">
                    {companyData?.recent_filings?.length || 0}
                  </span>

                </div>

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    Company
                  </span>

                  <span className="text-slate-400">
                    {companyData?.ticker || "Not loaded"}
                  </span>

                </div>

              </div>

              <a
                href="https://www.sec.gov/edgar/search/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Explore SEC EDGAR
                <ArrowUpRight size={13} />
              </a>

            </div>


            {/* WEB SEARCH */}

            <div className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-indigo-400/20">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/10">
                  <Newspaper
                    size={22}
                    className="text-indigo-400"
                  />
                </div>

                <span className="rounded-full border border-indigo-400/10 bg-indigo-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  Recent
                </span>

              </div>

              <h4 className="mt-5 text-lg font-semibold">
                Web News Search
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Recent company developments are retrieved through the
                configured web-search provider and filtered for company
                relevance.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4">

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    Results loaded
                  </span>

                  <span className="text-slate-400">
                    {newsData?.articles?.length || 0}
                  </span>

                </div>

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    Provider
                  </span>

                  <span className="text-slate-400">
                    Tavily Web Search
                  </span>

                </div>

              </div>

            </div>


            {/* ANNUAL REPORT */}

            <div className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-emerald-400/20">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                  <FileSearch
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  Document
                </span>

              </div>

              <h4 className="mt-5 text-lg font-semibold">
                Annual Reports
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Annual filings provide detailed company disclosures and can
                support document-based research and evidence retrieval.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4">

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    10-K filings
                  </span>

                  <span className="text-slate-400">
                    {annualReports.length}
                  </span>

                </div>

                <div className="flex justify-between text-xs">

                  <span className="text-slate-600">
                    Status
                  </span>

                  <span className="text-emerald-300">
                    {annualReports.length > 0
                      ? "Available"
                      : "Ready"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            CURRENT SOURCES
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Live Evidence
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Current research sources
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Sources retrieved for the current company analysis.
              </p>

            </div>

            {newsData?.articles?.length > 0 && (
              <span className="w-fit rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-300">
                {newsData.articles.length} source
                {newsData.articles.length === 1 ? "" : "s"} loaded
              </span>
            )}

          </div>


          {newsData?.articles?.length > 0 ? (

            <div className="mt-6 space-y-3">

              {newsData.articles.map(
                (article: any, index: number) => (

                  <a
                    key={`${article.url || article.title}-${index}`}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-black/20 p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                          Web Source
                        </span>

                        {article.source && (
                          <span className="text-xs text-slate-600">
                            {article.source}
                          </span>
                        )}

                      </div>

                      <p className="mt-3 text-sm font-medium leading-6 text-slate-300 transition group-hover:text-white">
                        {article.title || "Untitled source"}
                      </p>

                      {article.date && (
                        <p className="mt-2 text-xs text-slate-600">
                          Published: {article.date}
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-cyan-400">

                      Open source

                      <ArrowUpRight
                        size={14}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />

                    </div>

                  </a>

                )
              )}

            </div>

          ) : (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-10 text-center">

              <Newspaper
                size={30}
                className="mx-auto text-slate-700"
              />

              <p className="mt-4 text-sm text-slate-500">
                No web sources loaded yet.
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Run the News & Developments Agent from the Research page
                to populate current sources.
              </p>

            </div>

          )}

        </section>


        {/* ====================================================
            EVIDENCE CLASSIFICATION
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-indigo-400/10 bg-indigo-400/[0.025] p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10">
              <BrainCircuit
                size={20}
                className="text-indigo-300"
              />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Evidence Classification
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                What the system does with each source
              </h3>

            </div>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />

                <p className="text-sm font-semibold text-cyan-300">
                  Source Fact
                </p>

              </div>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                Direct information retrieved from SEC filings, financial
                data or recent web sources.
              </p>

            </div>


            <div className="rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.025] p-5">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />

                <p className="text-sm font-semibold text-indigo-300">
                  Calculated Value
                </p>

              </div>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                A metric derived from available financial data using
                deterministic calculation logic.
              </p>

            </div>


            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                <p className="text-sm font-semibold text-emerald-300">
                  AI Interpretation
                </p>

              </div>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                An analytical conclusion produced by specialized agents
                using the retrieved evidence and calculated metrics.
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            TRANSPARENCY NOTE
        ==================================================== */}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

          <Info
            size={17}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <p className="text-xs leading-6 text-slate-600">
            Source availability depends on the company selected and the
            public information returned by the configured data providers.
            FINOVA AI presents source evidence separately from calculated
            metrics and AI interpretation to improve transparency and
            traceability.
          </p>

        </div>


        <footer className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-600">
          FINOVA AI · Transparent evidence · Traceable financial research
        </footer>

      </main>

      

    ) : (
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">

  {/* ============================================================
      ABOUT HERO
  ============================================================ */}

  <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-12">

    <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

    <div className="relative max-w-4xl">

      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-2 text-xs font-medium text-indigo-300">
        <Sparkles size={14} />
        Intelligent Financial Research
      </div>

      <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
        Smarter financial research,
        <span className="block bg-gradient-to-r from-indigo-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
          all in one place.
        </span>
      </h2>

      <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
        FINOVA AI is an agentic financial research platform that helps
        users understand companies by combining financial performance,
        recent developments, business risks and future opportunities
        into one structured research experience.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          <Search size={16} className="text-indigo-400" />
          Research companies
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          <BarChart3 size={16} className="text-cyan-400" />
          Analyze financials
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          <Newspaper size={16} className="text-emerald-400" />
          Track developments
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          <ShieldAlert size={16} className="text-amber-400" />
          Identify risks
        </div>

      </div>
    </div>
  </section>


  {/* ============================================================
      WHAT USERS CAN DO
  ============================================================ */}

  <section className="mt-16">

    <div className="mb-8">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        What FINOVA AI does
      </p>

      <h3 className="mt-2 text-3xl font-semibold tracking-tight">
        Everything needed for company research
      </h3>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
        FINOVA AI brings the most important parts of financial research
        together so users can build a clear understanding of a company
        from multiple perspectives.
      </p>

    </div>


    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      {/* Company Research */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
          <Search size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Research a Company
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Start with a company ticker and obtain relevant company
          information and recent filings for the research process.
        </p>

      </div>


      {/* Financial Performance */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
          <BarChart3 size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Understand Financial Performance
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Examine revenue growth, profitability, debt, cash flow,
          margins and other important financial indicators.
        </p>

      </div>


      {/* News */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
          <Newspaper size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Track Major Developments
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Review recent company-related developments and news that
          may influence the company&apos;s business outlook.
        </p>

      </div>


      {/* Risks */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-rose-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
          <ShieldAlert size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Identify Key Risks
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Highlight potential revenue, profitability, debt, cash-flow,
          balance-sheet and development-related risks.
        </p>

      </div>


      {/* Opportunities */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-amber-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
          <TrendingUp size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Explore Opportunities
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Use financial trends and recent developments to identify
          potential areas of business growth and opportunity.
        </p>

      </div>


      {/* Reports */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.05]">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <FileText size={21} />
        </div>

        <h4 className="mt-5 font-semibold">
          Generate Research Reports
        </h4>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Bring the findings together into a structured report covering
          financial performance, developments, risks and opportunities.
        </p>

      </div>

    </div>
  </section>


  {/* ============================================================
      WHY FINOVA AI
  ============================================================ */}

  <section className="mt-16 grid gap-5 lg:grid-cols-2">

    {/* Problem */}
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-slate-300">
        <Info size={21} />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        The challenge
      </p>

      <h3 className="mt-2 text-2xl font-semibold">
        Financial research can take time
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        Understanding a company often requires reviewing financial
        statements, company filings, recent news, risks and business
        developments across different sources.
      </p>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        Manually bringing this information together can make research
        slower and harder to organize.
      </p>

    </div>


    {/* Solution */}
    <div className="rounded-3xl border border-indigo-400/10 bg-indigo-400/[0.04] p-8">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
        <Sparkles size={21} />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
        The FINOVA approach
      </p>

      <h3 className="mt-2 text-2xl font-semibold">
        One structured research workflow
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        FINOVA AI brings these research activities together into a
        single workflow. Specialized AI agents focus on different
        aspects of a company before the findings are reviewed and
        combined into a final report.
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-300">
        <CheckCircle2 size={17} />
        Faster and more organized research
      </div>

    </div>

  </section>


  {/* ============================================================
      HOW IT WORKS
  ============================================================ */}

  <section className="mt-16">

    <div className="mb-8">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        How it works
      </p>

      <h3 className="mt-2 text-3xl font-semibold tracking-tight">
        A multi-agent research process
      </h3>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
        FINOVA AI divides the research process into specialized stages,
        allowing each agent to focus on a specific part of company analysis.
      </p>

    </div>


    <div className="rounded-3xl border border-white/10 bg-white/[0.035] overflow-hidden">

      <div className="grid md:grid-cols-2 lg:grid-cols-3">

        {/* Agent 1 */}
        <div className="border-b border-white/10 p-6 lg:border-r">
          <span className="text-xs font-semibold text-indigo-400">
            01
          </span>

          <h4 className="mt-4 font-semibold">
            Company Research
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Collects company information and relevant public filings.
          </p>
        </div>


        {/* Agent 2 */}
        <div className="border-b border-white/10 p-6 lg:border-r">
          <span className="text-xs font-semibold text-cyan-400">
            02
          </span>

          <h4 className="mt-4 font-semibold">
            Financial Data
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Retrieves important financial metrics such as revenue,
            profit, debt, cash and cash flow.
          </p>
        </div>


        {/* Agent 3 */}
        <div className="border-b border-white/10 p-6">
          <span className="text-xs font-semibold text-emerald-400">
            03
          </span>

          <h4 className="mt-4 font-semibold">
            Financial Analysis
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Calculates and interprets financial ratios, trends,
            margins and performance indicators.
          </p>
        </div>


        {/* Agent 4 */}
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
          <span className="text-xs font-semibold text-violet-400">
            04
          </span>

          <h4 className="mt-4 font-semibold">
            News &amp; Developments
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Finds recent company-related developments and relevant
            information from current sources.
          </p>
        </div>


        {/* Agent 5 */}
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
          <span className="text-xs font-semibold text-rose-400">
            05
          </span>

          <h4 className="mt-4 font-semibold">
            Risk Analysis
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Evaluates financial and business information to identify
            important risk areas.
          </p>
        </div>


        {/* Agent 6 */}
        <div className="p-6">
          <span className="text-xs font-semibold text-amber-400">
            06
          </span>

          <h4 className="mt-4 font-semibold">
            AI Reviewer
          </h4>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Reviews findings and checks evidence, calculations and
            source coverage before reporting.
          </p>
        </div>

      </div>


      {/* Workflow */}
      <div className="border-t border-white/10 bg-black/10 px-6 py-5">

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400">

          <span>Research</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span>Financial Data</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span>Analysis</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span>News</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span>Risk</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span>Review</span>
          <ChevronRight size={14} className="text-slate-600" />

          <span className="text-cyan-300">
            Final Report
          </span>

        </div>

      </div>

    </div>

  </section>


  {/* ============================================================
      EVIDENCE & TRUST
  ============================================================ */}

  <section className="mt-16">

    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 sm:p-10">

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Transparency
          </p>

          <h3 className="mt-2 text-3xl font-semibold">
            Separate facts from analysis
          </h3>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            FINOVA AI distinguishes between information obtained from
            sources, values calculated from financial data and
            AI-generated interpretations.
          </p>


          <div className="mt-7 space-y-3">

            <div className="flex gap-4 rounded-2xl border border-white/5 bg-black/10 p-4">

              <FileSearch
                size={20}
                className="mt-1 shrink-0 text-indigo-400"
              />

              <div>
                <h4 className="font-semibold">
                  Source Facts
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Information obtained from company filings and
                  research sources.
                </p>
              </div>

            </div>


            <div className="flex gap-4 rounded-2xl border border-white/5 bg-black/10 p-4">

              <CircleDollarSign
                size={20}
                className="mt-1 shrink-0 text-emerald-400"
              />

              <div>
                <h4 className="font-semibold">
                  Calculated Values
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Financial metrics and ratios calculated from
                  available financial data.
                </p>
              </div>

            </div>


            <div className="flex gap-4 rounded-2xl border border-white/5 bg-black/10 p-4">

              <BrainCircuit
                size={20}
                className="mt-1 shrink-0 text-violet-400"
              />

              <div>
                <h4 className="font-semibold">
                  AI Interpretation
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  AI-generated insights that help users interpret
                  the collected evidence.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Disclaimer */}
        <div className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-7">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <ShieldAlert size={21} />
          </div>

          <h4 className="mt-6 text-xl font-semibold">
            Research, not financial advice
          </h4>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            FINOVA AI is designed as a financial research and analysis
            tool. Its outputs are intended to support research and
            understanding and should not be treated as personalized
            investment, financial or trading advice.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/5 bg-black/10 p-4">

            <Info
              size={17}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <p className="text-xs leading-6 text-slate-500">
              Users should independently verify important information
              before making financial decisions.
            </p>

          </div>

        </div>

      </div>

    </div>

  </section>


  {/* ============================================================
      TECHNOLOGIES USED
  ============================================================ */}

  <section className="mt-16">

    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Behind the application
      </p>

      <h3 className="mt-2 text-2xl font-semibold">
        Technologies used
      </h3>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        FINOVA AI is built using modern AI, data processing, backend
        and frontend technologies to support its research experience.
      </p>


      <div className="mt-7 flex flex-wrap justify-center gap-2">

        {[
          "Python",
          "FastAPI",
          "LangGraph",
          "OpenAI",
          "Pandas",
          "PostgreSQL",
          "Redis",
          "FAISS",
          "React",
          "TypeScript",
          "Tailwind CSS",
        ].map((technology) => (

          <span
            key={technology}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-indigo-400/20 hover:text-slate-200"
          >
            {technology}
          </span>

        ))}

      </div>

    </div>

  </section>


  {/* ============================================================
      FOOTER
  ============================================================ */}

  <footer className="mt-14 border-t border-white/10 pt-8 text-center">

    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">

      <Sparkles size={13} className="text-indigo-400" />

      FINOVA AI · Intelligent Financial Research

    </div>

  </footer>

</main>

      

              
              

           

    )}


    </div>
  );
}

export default App;