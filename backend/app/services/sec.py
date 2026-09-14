import os
from typing import Any

import httpx


SEC_USER_AGENT = os.getenv(
    "SEC_USER_AGENT",
    "FinancialResearchAI/1.0 contact@example.com",
)

COMPANY_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"


async def get_company_by_ticker(ticker: str) -> dict[str, Any]:
    ticker = ticker.strip().upper()

    headers = {
        "User-Agent": SEC_USER_AGENT,
        "Accept-Encoding": "gzip, deflate",
    }

    async with httpx.AsyncClient(timeout=20.0, headers=headers) as client:
        # ------------------------------------------------------------
        # 1. Get SEC company ticker information
        # ------------------------------------------------------------
        response = await client.get(COMPANY_TICKERS_URL)
        response.raise_for_status()

        companies = response.json()

        company = None

        for item in companies.values():
            if item["ticker"].upper() == ticker:
                company = item
                break

        if company is None:
            raise ValueError(f"Company ticker '{ticker}' was not found.")

        # SEC CIK must be 10 digits
        cik = str(company["cik_str"]).zfill(10)

        # ------------------------------------------------------------
        # 2. Get SEC company submissions / filings
        # ------------------------------------------------------------
        submissions_response = await client.get(
            SUBMISSIONS_URL.format(cik=cik)
        )
        submissions_response.raise_for_status()

        submissions = submissions_response.json()

    # ------------------------------------------------------------
    # 3. Extract recent 10-K annual filings
    # ------------------------------------------------------------
    recent_filings = []

    recent = submissions.get("filings", {}).get("recent", {})

    forms = recent.get("form", [])
    filing_dates = recent.get("filingDate", [])
    accession_numbers = recent.get("accessionNumber", [])
    primary_documents = recent.get("primaryDocument", [])

    # Search through all recent SEC filings and keep only
    # annual 10-K filings. This avoids missing the 10-K when
    # recent filings contain many Forms 4, 144, etc.
    for i in range(len(forms)):
        form = forms[i].upper()

        if form.startswith("10-K"):
            recent_filings.append(
                {
                    "form": forms[i],
                    "filing_date": filing_dates[i],
                    "accession_number": accession_numbers[i],
                    "primary_document": primary_documents[i],
                }
            )

            # Keep the latest 5 annual filings
            if len(recent_filings) >= 5:
                break

    # ------------------------------------------------------------
    # 4. Return company information
    # ------------------------------------------------------------
    return {
        "ticker": ticker,
        "company_name": company["title"],
        "cik": cik,
        "sic": submissions.get("sic"),
        "sic_description": submissions.get("sicDescription"),
        "exchange": submissions.get("exchanges", [None])[0],
        "fiscal_year_end": submissions.get("fiscalYearEnd"),
        "state_of_incorporation": submissions.get("stateOfIncorporation"),
        "recent_filings": recent_filings,
    }