import math
import os
from typing import Any

import httpx
import pandas as pd


# ============================================================
# SEC API URLs
# ============================================================

SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

SEC_COMPANY_FACTS_URL = (
    "https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
)


# ============================================================
# SEC USER AGENT
# ============================================================

SEC_USER_AGENT = os.getenv(
    "SEC_USER_AGENT",
    "FINOVA-AI financial research project"
)


# ============================================================
# HTTP HEADERS
# ============================================================

def get_sec_headers() -> dict[str, str]:
    """
    Headers used when communicating with SEC APIs.

    We intentionally do NOT set a fixed Host header because
    this service communicates with both www.sec.gov and
    data.sec.gov.
    """
    return {
        "User-Agent": SEC_USER_AGENT,
        "Accept-Encoding": "gzip, deflate",
    }


# ============================================================
# JSON SAFETY
# ============================================================

def clean_json_value(value: Any) -> Any:
    """
    Convert NaN and infinite float values into JSON-safe None.
    """
    if isinstance(value, float):
        if not math.isfinite(value):
            return None

    return value


def make_json_safe(data: Any) -> Any:
    """
    Recursively convert NaN and infinite values into JSON-safe
    values.

    FastAPI cannot serialize NaN or Infinity as valid JSON.
    """
    if isinstance(data, dict):
        return {
            key: make_json_safe(value)
            for key, value in data.items()
        }

    if isinstance(data, list):
        return [
            make_json_safe(value)
            for value in data
        ]

    if isinstance(data, tuple):
        return [
            make_json_safe(value)
            for value in data
        ]

    if isinstance(data, float):
        if not math.isfinite(data):
            return None

    return data


# ============================================================
# FETCH JSON
# ============================================================

async def fetch_json(url: str) -> dict[str, Any]:
    """
    Fetch JSON data from an SEC endpoint.
    """

    async with httpx.AsyncClient(
        headers=get_sec_headers(),
        timeout=30.0,
        follow_redirects=True,
    ) as client:

        response = await client.get(url)

        response.raise_for_status()

        return response.json()


# ============================================================
# FIND CIK FROM TICKER
# ============================================================

async def get_cik_from_ticker(ticker: str) -> str:
    """
    Find the SEC CIK number for a ticker.
    """

    ticker = ticker.upper().strip()

    if not ticker:
        raise ValueError("Ticker cannot be empty.")

    data = await fetch_json(SEC_TICKERS_URL)

    for company in data.values():

        company_ticker = str(
            company.get("ticker", "")
        ).upper()

        if company_ticker == ticker:

            cik = str(
                company["cik_str"]
            ).zfill(10)

            return cik

    raise ValueError(
        f"Ticker '{ticker}' was not found in SEC company data."
    )


# ============================================================
# GET COMPANY FACTS
# ============================================================

async def get_company_facts(
    ticker: str,
) -> dict[str, Any]:
    """
    Download the complete SEC Company Facts dataset
    for a company.
    """

    cik = await get_cik_from_ticker(ticker)

    url = SEC_COMPANY_FACTS_URL.format(
        cik=cik
    )

    facts = await fetch_json(url)

    return {
        "cik": cik,
        "facts": facts,
    }


# ============================================================
# FIND US GAAP FACT
# ============================================================

def find_us_gaap_fact(
    facts: dict[str, Any],
    possible_tags: list[str],
) -> tuple[
    str | None,
    dict[str, Any] | None
]:
    """
    Find the first available US-GAAP fact from
    a list of possible tags.
    """

    us_gaap = (
        facts
        .get("facts", {})
        .get("us-gaap", {})
    )

    for tag in possible_tags:

        if tag in us_gaap:
            return tag, us_gaap[tag]

    return None, None


# ============================================================
# EXTRACT ANNUAL VALUES
# ============================================================

def extract_annual_values(
    fact: dict[str, Any] | None,
    unit: str = "USD",
) -> list[dict[str, Any]]:
    """
    Extract annual values from an SEC XBRL fact.

    We prefer 10-K / 10-K/A filings because they
    represent annual financial statements.
    """

    if not fact:
        return []

    units = fact.get("units", {})

    if not units:
        return []

    if unit not in units:
        unit = next(iter(units))

    rows = units[unit]

    annual_rows = []

    for row in rows:

        form = row.get("form", "")

        if form not in {
            "10-K",
            "10-K/A",
        }:
            continue

        if not row.get("fy"):
            continue

        annual_rows.append(
            {
                "fy": row.get("fy"),
                "filed": row.get("filed"),
                "form": form,
                "start": row.get("start"),
                "end": row.get("end"),
                "value": row.get("val"),
                "frame": row.get("frame"),
            }
        )

    if not annual_rows:
        return []

    df = pd.DataFrame(annual_rows)

    df["filed"] = pd.to_datetime(
        df["filed"],
        errors="coerce",
    )

    # Keep the latest filing for each fiscal year.
    df = (
        df
        .sort_values("filed")
        .drop_duplicates(
            subset=["fy"],
            keep="last",
        )
        .sort_values(
            "fy",
            ascending=False,
        )
    )

    records = df.to_dict("records")

    # Convert pandas NaN values to None.
    safe_records = []

    for record in records:

        safe_record = {
            key: clean_json_value(value)
            for key, value in record.items()
        }

        safe_records.append(safe_record)

    return safe_records


# ============================================================
# EXTRACT LATEST BALANCE SHEET VALUE
# ============================================================

def extract_latest_instant_value(
    fact: dict[str, Any] | None,
    unit: str = "USD",
) -> dict[str, Any] | None:
    """
    Extract the latest balance-sheet style value.

    These facts are usually instantaneous values
    at a reporting date.
    """

    if not fact:
        return None

    units = fact.get("units", {})

    if not units:
        return None

    if unit not in units:
        unit = next(iter(units))

    rows = units[unit]

    valid_rows = []

    for row in rows:

        form = row.get("form", "")

        if form not in {
            "10-K",
            "10-K/A",
            "10-Q",
            "10-Q/A",
        }:
            continue

        if not row.get("end"):
            continue

        if row.get("val") is None:
            continue

        valid_rows.append(row)

    if not valid_rows:
        return None

    df = pd.DataFrame(valid_rows)

    df["end"] = pd.to_datetime(
        df["end"],
        errors="coerce",
    )

    df["filed"] = pd.to_datetime(
        df["filed"],
        errors="coerce",
    )

    df = df.dropna(
        subset=["end"]
    )

    if df.empty:
        return None

    df = df.sort_values(
        ["end", "filed"]
    )

    latest = df.iloc[-1]

    value = latest.get("val")

    try:
        value = float(value)
    except (TypeError, ValueError):
        value = None

    value = clean_json_value(value)

    end_date = latest.get("end")

    if pd.isna(end_date):
        date_value = None
    else:
        date_value = end_date.strftime(
            "%Y-%m-%d"
        )

    return {
        "date": date_value,
        "value": value,
        "form": latest.get("form"),
    }


# ============================================================
# BUILD FINANCIAL DATASET
# ============================================================

def build_financial_dataset(
    facts: dict[str, Any],
) -> dict[str, Any]:
    """
    Extract the core financial statement data required
    for the Financial Data Agent.
    """

    # --------------------------------------------------------
    # Income statement / cash flow metrics
    # --------------------------------------------------------

    fact_definitions = {

        "revenue": [
            "RevenueFromContractWithCustomerExcludingAssessedTax",
            "Revenues",
            "SalesRevenueNet",
        ],

        "net_income": [
            "NetIncomeLoss",
            "ProfitLoss",
        ],

        "operating_cash_flow": [
            "NetCashProvidedByUsedInOperatingActivities",
        ],

        "capital_expenditure": [
            "PaymentsToAcquirePropertyPlantAndEquipment",
        ],
    }

    annual_data: dict[
        str,
        list[dict[str, Any]]
    ] = {}

    source_tags: dict[
        str,
        str | None
    ] = {}

    for metric, tags in fact_definitions.items():

        tag, fact = find_us_gaap_fact(
            facts,
            tags,
        )

        source_tags[metric] = tag

        annual_data[metric] = (
            extract_annual_values(
                fact,
                unit="USD",
            )
        )

    # --------------------------------------------------------
    # Balance sheet metrics
    # --------------------------------------------------------

    balance_sheet_definitions = {

        "assets": [
            "Assets",
        ],

        "liabilities": [
            "Liabilities",
        ],

        "cash": [
            "CashAndCashEquivalentsAtCarryingValue",
            "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents",
        ],

        "equity": [
            "StockholdersEquity",
            "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest",
        ],

        "long_term_debt": [
            "LongTermDebtNoncurrent",
            "LongTermDebt",
        ],

        "current_debt": [
            "ShortTermBorrowings",
            "LongTermDebtCurrent",
            "DebtCurrent",
        ],
    }

    balance_sheet: dict[str, Any] = {}

    for metric, tags in balance_sheet_definitions.items():

        tag, fact = find_us_gaap_fact(
            facts,
            tags,
        )

        source_tags[metric] = tag

        balance_sheet[metric] = (
            extract_latest_instant_value(
                fact,
                unit="USD",
            )
        )

    # --------------------------------------------------------
    # Final dataset
    # --------------------------------------------------------

    return {
        "annual": annual_data,
        "balance_sheet": balance_sheet,
        "source_tags": source_tags,
    }


# ============================================================
# MAIN FINANCIAL DATA FUNCTION
# ============================================================

async def get_financial_data(
    ticker: str,
) -> dict[str, Any]:
    """
    Main entry point for the Financial Data Agent.
    """

    ticker = ticker.upper().strip()

    if not ticker:
        raise ValueError(
            "Ticker cannot be empty."
        )

    company_facts = await get_company_facts(
        ticker
    )

    cik = company_facts["cik"]

    facts = company_facts["facts"]

    financial_data = build_financial_dataset(
        facts
    )

    result = {
        "ticker": ticker,
        "cik": cik,
        "data_source": (
            "SEC EDGAR XBRL Company Facts"
        ),
        "financial_data": financial_data,
    }

    # Final safety check before returning to FastAPI.
    return make_json_safe(result)