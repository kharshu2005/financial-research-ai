import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Newspaper,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { generateResearchPDF } from "./pdfGenerator";

interface FinalReportProps {
  report: any;
}

const formatMoney = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `$${(Number(value) / 1_000_000_000).toFixed(2)}B`;
};

const formatPercent = (
  value: number | null | undefined
) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${Number(value).toFixed(2)}%`;
};

const formatNumber = (
  value: number | null | undefined
) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return Number(value).toFixed(2);
};

const formatRiskEvidence = (evidence: any) => {
  if (!evidence) {
    return "No evidence available.";
  }

  if (Array.isArray(evidence)) {
    return `${evidence.length} related development${
      evidence.length === 1 ? "" : "s"
    } identified.`;
  }

  if (typeof evidence !== "object") {
    return String(evidence);
  }

  const parts = Object.entries(evidence).map(
    ([key, value]) => {
      const label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );

      if (
        typeof value === "number" &&
        [
          "cash",
          "liabilities",
          "free_cash_flow",
        ].includes(key)
      ) {
        return `${label}: $${(
          value / 1_000_000_000
        ).toFixed(2)}B`;
      }

      if (typeof value === "number") {
        return `${label}: ${value.toFixed(2)}`;
      }

      return `${label}: ${String(value)}`;
    }
  );

  return parts.join(" · ");
};

export default function FinalReport({
  report,
}: FinalReportProps) {
  if (!report) {
    return null;
  }

  const financial = report.financial_summary || {};
  const developments =
    report.major_developments || {};
  const risks = Array.isArray(report.key_risks)
    ? report.key_risks
    : [];
  const opportunities = Array.isArray(
    report.future_opportunities
  )
    ? report.future_opportunities
    : [];

  const reviewer =
    report.reviewer_assessment || {};

  const articles = Array.isArray(
    developments.articles
  )
    ? developments.articles
    : [];

  return (
    <section
      id="final-report"
      className="mt-20 scroll-mt-8"
    >
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          <span className="inline-flex items-center gap-2">
            <Sparkles size={14} />
            Final AI Research Report
          </span>
        </p>

        <h3 className="mt-2 text-3xl font-semibold tracking-tight">
          {report.company?.name || "Company"}{" "}
          <span className="text-cyan-400">
            ({report.company?.ticker || "N/A"})
          </span>
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Consolidated analysis from financial data,
          developments, risks and reviewer validation.
        </p>
        <div className="mt-5">
          <button
            onClick={() =>
              generateResearchPDF(report)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            <ArrowUpRight size={16} />
           Download PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <BrainCircuit size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Executive Summary
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {report.executive_summary ||
                "No executive summary available."}
            </p>
          </div>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-3">
          <CircleDollarSign
            className="text-emerald-400"
            size={21}
          />

          <div>
            <p className="font-semibold">
              Financial Summary
            </p>

            <p className="text-xs text-slate-500">
              Key calculated financial indicators
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Revenue",
              formatMoney(financial.revenue),
            ],
            [
              "Revenue Growth",
              formatPercent(
                financial.revenue_growth_percent
              ),
            ],
            [
              "Net Income",
              formatMoney(financial.net_income),
            ],
            [
              "Net Profit Margin",
              formatPercent(
                financial.net_profit_margin_percent
              ),
            ],
            [
              "Operating Cash Flow",
              formatMoney(
                financial.operating_cash_flow
              ),
            ],
            [
              "Free Cash Flow",
              formatMoney(
                financial.free_cash_flow
              ),
            ],
            [
              "Total Debt",
              formatMoney(financial.total_debt),
            ],
            [
              "Debt / Equity",
              formatNumber(
                financial.debt_to_equity
              ),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="text-xs text-slate-500">
                {label}
              </p>

              <p className="mt-3 text-xl font-bold">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DEVELOPMENTS */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper
              className="text-cyan-400"
              size={21}
            />

            <div>
              <p className="font-semibold">
                Major Developments
              </p>

              <p className="text-xs text-slate-500">
                Recent company-related developments
              </p>
            </div>
          </div>

          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
            {developments.articles_count ?? 0}{" "}
            {(developments.articles_count ?? 0) === 1
              ? "article"
              : "articles"}
          </span>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-400">
          {developments.overall_summary ||
            "No recent developments summary available."}
        </p>

        {articles.length > 0 && (
          <div className="mt-5 space-y-3">
            {articles.map(
              (article: any, index: number) => (
                <div
                  key={`${article.url || article.title}-${index}`}
                  className="rounded-xl border border-white/5 bg-black/10 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-200">
                        {article.title ||
                          "Untitled article"}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {article.summary ||
                          "No summary available."}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-indigo-400/10 px-2.5 py-1 text-[10px] text-indigo-300">
                      {article.importance ||
                        "medium"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    {article.source && (
                      <span>
                        {article.source}
                      </span>
                    )}

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
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
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
        )}
      </div>

      {/* RISKS */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex items-center gap-3">
          <ShieldAlert
            className="text-amber-400"
            size={21}
          />

          <div>
            <p className="font-semibold">
              Key Risks
            </p>

            <p className="text-xs text-slate-500">
              Risks identified from available evidence
            </p>
          </div>
        </div>

        {risks.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {risks.map(
              (risk: any, index: number) => (
                <div
                  key={`${risk.category || "risk"}-${index}`}
                  className="rounded-xl border border-white/5 bg-black/10 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-200">
                      {risk.category ||
                        `Risk ${index + 1}`}
                    </p>

                    <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] uppercase text-amber-300">
                      {risk.severity || "unknown"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {risk.finding||
                      risk.reason ||
                      risk.description ||
                      risk.details ||
                      "No additional explanation provided."}
                  </p>

                  {risk.evidence && (
                    <p className="mt-3 text-xs leading-5 text-slate-600">
                      Evidence: {formatRiskEvidence(risk.evidence)}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No key risks were returned.
          </p>
        )}
      </div>

      {/* OPPORTUNITIES */}
      <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
        <div className="flex items-center gap-3">
          <TrendingUp
            className="text-emerald-400"
            size={21}
          />

          <div>
            <p className="font-semibold">
              Future Opportunities
            </p>

            <p className="text-xs text-slate-500">
              Potential areas identified from the research
            </p>
          </div>
        </div>

        {opportunities.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {opportunities.map(
              (opportunity: any, index: number) => (
                <div
                  key={`${opportunity.title || "opportunity"}-${index}`}
                  className="rounded-xl border border-white/5 bg-black/10 p-4"
                >
                  <p className="font-medium text-slate-200">
                    {opportunity.title ||
                      `Opportunity ${index + 1}`}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {opportunity.description ||
                      "No description available."}
                  </p>

                  {opportunity.basis && (
                    <p className="mt-3 text-xs text-slate-600">
                      Basis: {opportunity.basis}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No future opportunities were identified.
          </p>
        )}
      </div>

      {/* REVIEWER */}
      <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2
            className="text-emerald-400"
            size={21}
          />

          <div>
            <p className="font-semibold">
              Reviewer Assessment
            </p>

            <p className="text-xs text-slate-500">
              Evidence and calculation validation
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-black/10 p-4">
            <p className="text-xs text-slate-500">
              Status
            </p>

            <p className="mt-2 font-semibold capitalize text-emerald-300">
              {(reviewer.status ||
                "unknown").replace(
                /_/g,
                " "
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/10 p-4">
            <p className="text-xs text-slate-500">
              Checks Passed
            </p>

            <p className="mt-2 text-xl font-bold">
              {reviewer.verified_checks ?? 0}
              <span className="text-slate-600">
                {" / "}
                {reviewer.total_checks ?? 0}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/10 p-4">
            <p className="text-xs text-slate-500">
              Validation
            </p>

            <p className="mt-2 font-semibold text-emerald-300">
              Evidence Checked
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-xl border border-white/5 bg-black/10 p-4 text-sm leading-6 text-slate-400">
          {reviewer.summary ||
            "No reviewer summary available."}
        </p>
      </div>

      {/* DISCLAIMER */}
      <div className="mt-8 rounded-xl border border-amber-400/10 bg-amber-400/[0.03] p-5 text-center">
        <p className="text-xs leading-5 text-slate-500">
          {report.disclaimer ||
            "This report is for informational and research purposes only and is not personalized investment advice."}
        </p>
      </div>
    </section>
  );
}