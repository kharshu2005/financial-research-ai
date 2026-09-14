import jsPDF from "jspdf";

const cleanPDFText = (text: string): string => {
  if (!text) {
    return "";
  }

  let cleaned = String(text)
    .replace(/\s+/g, " ")
    .trim();

  // Fix text where individual letters are separated by spaces.
  // Example:
  // "A p p l e" → "Apple"
  // "N A S D A Q" → "NASDAQ"
  const words = cleaned.split(" ");
  const result: string[] = [];

  let i = 0;

  while (i < words.length) {
    if (/^[A-Za-z0-9]$/.test(words[i])) {
      const start = i;

      while (
        i < words.length &&
        /^[A-Za-z0-9]$/.test(words[i])
      ) {
        i++;
      }

      const runLength = i - start;

      if (runLength >= 3) {
        result.push(words.slice(start, i).join(""));
      } else {
        result.push(...words.slice(start, i));
      }
    } else {
      result.push(words[i]);
      i++;
    }
  }

  cleaned = result.join(" ");

  // Clean spaces around common punctuation that may appear
  // because of malformed web-search text.
  cleaned = cleaned
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+:/g, ":")
    .replace(/:\s+/g, ":")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".");

  return cleaned.trim();
};

const formatMoney = (
  value: number | null | undefined
): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `$${(Number(value) / 1_000_000_000).toFixed(2)}B`;
};

const formatPercent = (
  value: number | null | undefined
): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${Number(value).toFixed(2)}%`;
};

export const generateResearchPDF = (
  report: any
) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight =
    doc.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  const addPageIfNeeded = (
    requiredSpace = 15
  ) => {
    if (y + requiredSpace > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addText = (
    text: string,
    fontSize = 10,
    bold = false
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont(
      "helvetica",
      bold ? "bold" : "normal"
    );

    const lines = doc.splitTextToSize(
      text || "",
      contentWidth
    );

    addPageIfNeeded(lines.length * 5 + 5);

    doc.text(lines, margin, y);

    y += lines.length * 5 + 5;
  };

  const addSectionTitle = (
    title: string
  ) => {
    addPageIfNeeded(22);

    y += 8;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);

    y += 11;
  };

  if (!report) {
    return;
  }

  const company =
    report.company || {};

  const financial =
    report.financial_summary || {};

  const developments =
    report.major_developments || {};

  const risks = Array.isArray(
    report.key_risks
  )
    ? report.key_risks
    : [];

  const opportunities =
    Array.isArray(
      report.future_opportunities
    )
      ? report.future_opportunities
      : [];

  const reviewer =
    report.reviewer_assessment || {};

  /* =====================================================
     HEADER
  ===================================================== */

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text(
    "FINOVA AI",
    margin,
    y
  );

  y += 10;

  doc.setFontSize(17);

  doc.text(
    "Financial Research Report",
    margin,
    y
  );

  y += 10;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    `${company.name || "Company"} (${company.ticker || "N/A"})`,
    margin,
    y
  );

  y += 12;

  /* =====================================================
     EXECUTIVE SUMMARY
  ===================================================== */

  addSectionTitle(
    "Executive Summary"
  );

  addText(
    report.executive_summary ||
      "No executive summary available."
  );

  /* =====================================================
     FINANCIAL SUMMARY
  ===================================================== */

  addSectionTitle(
    "Financial Summary"
  );

  addText(
    `Revenue: ${formatMoney(
      financial.revenue
    )}`
  );

  addText(
    `Previous Revenue: ${formatMoney(
      financial.previous_revenue
    )}`
  );

  addText(
    `Revenue Growth: ${formatPercent(
      financial.revenue_growth_percent
    )}`
  );

  addText(
    `Net Income: ${formatMoney(
      financial.net_income
    )}`
  );

  addText(
    `Net Profit Margin: ${formatPercent(
      financial.net_profit_margin_percent
    )}`
  );

  addText(
    `Operating Cash Flow: ${formatMoney(
      financial.operating_cash_flow
    )}`
  );

  addText(
    `Capital Expenditure: ${formatMoney(
      financial.capital_expenditure
    )}`
  );

  addText(
    `Free Cash Flow: ${formatMoney(
      financial.free_cash_flow
    )}`
  );

  addText(
    `Total Debt: ${formatMoney(
      financial.total_debt
    )}`
  );

  addText(
    `Equity: ${formatMoney(
      financial.equity
    )}`
  );

  addText(
    `Debt / Equity: ${
      financial.debt_to_equity != null
        ? Number(
            financial.debt_to_equity
          ).toFixed(2)
        : "N/A"
    }`
  );

  /* =====================================================
     MAJOR DEVELOPMENTS
  ===================================================== */

  addSectionTitle(
    "Major Developments"
  );

  addText(
    developments.overall_summary ||
      "No recent developments summary available."
  );

  const articles =
    Array.isArray(
      developments.articles
    )
      ? developments.articles
      : [];

  articles.forEach(
    (article: any, index: number) => {
      addPageIfNeeded(20);

      addText(
        `${index + 1}. ${cleanPDFText(
          String(
            article.title ||
              "Untitled article"
          )
        )}`,
        10,
        true
      );

      if (article.date) {
        addText(
          `Date: ${cleanPDFText(
            String(article.date)
              .replace(
                /GMT$/,
                ""
              )
              .trim()
          )}`,
          9
        );
      }

      if (article.source) {
        addText(
          `Source: ${cleanPDFText(
            String(article.source)
          )}`,
          9
        );
      }

      if (article.summary) {
        addText(
          cleanPDFText(
            String(article.summary)
          ),
          9
        );
      }

      if (article.url) {
        addText(
          "Source: Online article",
          8
        );
      }
    }
  );

  /* =====================================================
     KEY RISKS
  ===================================================== */

  addSectionTitle(
    "Key Risks"
  );

  if (risks.length === 0) {
    addText(
      "No key risks were identified."
    );
  }

  risks.forEach(
    (risk: any, index: number) => {
      addPageIfNeeded(20);

      addText(
        `${index + 1}. ${
          risk.category ||
          `Risk ${index + 1}`
        }`,
        11,
        true
      );

      addText(
        `Severity: ${
          risk.severity ||
          "Unknown"
        }`,
        9
      );

      const explanation =
        risk.reason ||
        risk.description ||
        risk.details;

      if (explanation) {
        addText(
          `Explanation: ${explanation}`,
          9
        );
      }

      if (risk.evidence) {
        addText(
          `Evidence: ${
            typeof risk.evidence ===
            "object"
              ? JSON.stringify(
                  risk.evidence
                )
              : risk.evidence
          }`,
          8
        );
      }
    }
  );

  /* =====================================================
     FUTURE OPPORTUNITIES
  ===================================================== */

  addSectionTitle(
    "Future Opportunities"
  );

  if (opportunities.length === 0) {
    addText(
      "No future opportunities were identified."
    );
  }

  opportunities.forEach(
    (
      opportunity: any,
      index: number
    ) => {
      addPageIfNeeded(20);

      addText(
        `${index + 1}. ${
          opportunity.title ||
          `Opportunity ${
            index + 1
          }`
        }`,
        10,
        true
      );

      if (
        opportunity.description
      ) {
        addText(
          opportunity.description,
          9
        );
      }

      if (opportunity.basis) {
        addText(
          `Basis: ${opportunity.basis}`,
          8
        );
      }
    }
  );

  /* =====================================================
     REVIEWER ASSESSMENT
  ===================================================== */

  addSectionTitle(
    "Reviewer Assessment"
  );

  addText(
    `Status: ${
      reviewer.status ||
      "Unknown"
    }`,
    10,
    true
  );

  addText(
    `Checks Passed: ${
      reviewer.verified_checks ??
      0
    } / ${
      reviewer.total_checks ??
      0
    }`
  );

  addText(
    reviewer.summary ||
      "No reviewer summary available."
  );

  /* =====================================================
     DISCLAIMER
  ===================================================== */

  addSectionTitle(
    "Disclaimer"
  );

  addText(
    report.disclaimer ||
      "This report is for informational and research purposes only and is not personalized investment advice."
  );

  /* =====================================================
     FOOTER
  ===================================================== */

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `FINOVA AI · Financial Research Report · Page ${page} of ${totalPages}`,
      margin,
      pageHeight - 10
    );
  }

  const ticker =
    company.ticker || "COMPANY";

  doc.save(
    `FINOVA_AI_${ticker}_Research_Report.pdf`
  );
};