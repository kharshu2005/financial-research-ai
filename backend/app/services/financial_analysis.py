from typing import Any, Dict, Optional

from app.services.financial_data import get_financial_data


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(value: Any) -> Optional[float]:
    """
    Convert a value to a safe float.
    Returns None if the value is missing or invalid.
    """

    if value is None:
        return None

    try:
        number = float(value)

        if number != number:
            return None

        if number in (
            float("inf"),
            float("-inf"),
        ):
            return None

        return number

    except (TypeError, ValueError):
        return None


# ============================================================
# GET VALUE FROM ANNUAL RECORD
# ============================================================

def get_annual_value(
    records: Any,
    index: int = 0,
) -> Optional[float]:
    """
    Get the value from an annual SEC record.

    financial_data.py sorts annual records with
    the latest fiscal year first.
    """

    if not isinstance(records, list):
        return None

    if len(records) <= index:
        return None

    record = records[index]

    if not isinstance(record, dict):
        return None

    return safe_number(
        record.get("value")
    )


# ============================================================
# GET LATEST BALANCE SHEET VALUE
# ============================================================

def get_balance_value(
    balance_sheet: dict,
    metric: str,
) -> Optional[float]:
    """
    Extract the numeric value from a balance-sheet
    metric returned by the SEC data service.
    """

    record = balance_sheet.get(metric)

    if not isinstance(record, dict):
        return None

    return safe_number(
        record.get("value")
    )


# ============================================================
# REVENUE GROWTH
# ============================================================

def calculate_growth(
    current: Optional[float],
    previous: Optional[float],
) -> Optional[float]:

    if current is None or previous is None:
        return None

    if previous == 0:
        return None

    return (
        (current - previous)
        / abs(previous)
    ) * 100


# ============================================================
# NET PROFIT MARGIN
# ============================================================

def calculate_margin(
    net_income: Optional[float],
    revenue: Optional[float],
) -> Optional[float]:

    if net_income is None or revenue is None:
        return None

    if revenue == 0:
        return None

    return (
        net_income / revenue
    ) * 100


# ============================================================
# FREE CASH FLOW
# ============================================================

def calculate_free_cash_flow(
    operating_cash_flow: Optional[float],
    capital_expenditure: Optional[float],
) -> Optional[float]:

    if operating_cash_flow is None:
        return None

    if capital_expenditure is None:
        return operating_cash_flow

    return (
        operating_cash_flow
        - capital_expenditure
    )


# ============================================================
# DEBT TO EQUITY
# ============================================================

def calculate_debt_to_equity(
    total_debt: Optional[float],
    equity: Optional[float],
) -> Optional[float]:

    if total_debt is None or equity is None:
        return None

    if equity == 0:
        return None

    return total_debt / equity


# ============================================================
# ROA
# ============================================================

def calculate_roa(
    net_income: Optional[float],
    assets: Optional[float],
) -> Optional[float]:

    if net_income is None or assets is None:
        return None

    if assets == 0:
        return None

    return (
        net_income / assets
    ) * 100


# ============================================================
# ROE
# ============================================================

def calculate_roe(
    net_income: Optional[float],
    equity: Optional[float],
) -> Optional[float]:

    if net_income is None or equity is None:
        return None

    if equity == 0:
        return None

    return (
        net_income / equity
    ) * 100


# ============================================================
# MAIN FINANCIAL ANALYSIS
# ============================================================

async def analyze_company_financials(
    ticker: str,
) -> Dict[str, Any]:

    ticker = ticker.upper().strip()

    if not ticker:
        raise ValueError(
            "Ticker cannot be empty."
        )

    # --------------------------------------------------------
    # STEP 1: Retrieve SEC financial data
    # --------------------------------------------------------

    result = await get_financial_data(
        ticker
    )

    if not result:
        raise ValueError(
            f"No financial data found for {ticker}."
        )

    # --------------------------------------------------------
    # STEP 2: Get correct nested structure
    # --------------------------------------------------------

    financial_data = result.get(
        "financial_data",
        {}
    )

    annual = financial_data.get(
        "annual",
        {}
    )

    balance_sheet = financial_data.get(
        "balance_sheet",
        {}
    )

    source_tags = financial_data.get(
        "source_tags",
        {}
    )

    # --------------------------------------------------------
    # STEP 3: Extract annual financial values
    # --------------------------------------------------------

    revenue_records = annual.get(
        "revenue",
        []
    )

    net_income_records = annual.get(
        "net_income",
        []
    )

    operating_cash_flow_records = annual.get(
        "operating_cash_flow",
        []
    )

    capital_expenditure_records = annual.get(
        "capital_expenditure",
        []
    )

    # Latest year
    latest_revenue = get_annual_value(
        revenue_records,
        0,
    )

    # Previous year
    previous_revenue = get_annual_value(
        revenue_records,
        1,
    )

    latest_net_income = get_annual_value(
        net_income_records,
        0,
    )

    latest_operating_cash_flow = get_annual_value(
        operating_cash_flow_records,
        0,
    )

    latest_capital_expenditure = get_annual_value(
        capital_expenditure_records,
        0,
    )

    # --------------------------------------------------------
    # STEP 4: Extract balance sheet values
    # --------------------------------------------------------

    assets = get_balance_value(
        balance_sheet,
        "assets",
    )

    liabilities = get_balance_value(
        balance_sheet,
        "liabilities",
    )

    cash = get_balance_value(
        balance_sheet,
        "cash",
    )

    equity = get_balance_value(
        balance_sheet,
        "equity",
    )

    long_term_debt = get_balance_value(
        balance_sheet,
        "long_term_debt",
    )

    current_debt = get_balance_value(
        balance_sheet,
        "current_debt",
    )

    # --------------------------------------------------------
    # STEP 5: Calculate total debt
    # --------------------------------------------------------

    total_debt = None

    if (
        long_term_debt is not None
        or current_debt is not None
    ):

        total_debt = (
            (long_term_debt or 0)
            + (current_debt or 0)
        )

    # --------------------------------------------------------
    # STEP 6: Financial calculations
    # --------------------------------------------------------

    revenue_growth = calculate_growth(
        latest_revenue,
        previous_revenue,
    )

    net_profit_margin = calculate_margin(
        latest_net_income,
        latest_revenue,
    )

    free_cash_flow = calculate_free_cash_flow(
        latest_operating_cash_flow,
        latest_capital_expenditure,
    )

    debt_to_equity = calculate_debt_to_equity(
        total_debt,
        equity,
    )

    roa = calculate_roa(
        latest_net_income,
        assets,
    )

    roe = calculate_roe(
        latest_net_income,
        equity,
    )

    # --------------------------------------------------------
    # STEP 7: Generate observations
    # --------------------------------------------------------

    observations = []

    if revenue_growth is not None:

        if revenue_growth > 10:

            observations.append(
                "Revenue shows strong year-over-year growth."
            )

        elif revenue_growth > 0:

            observations.append(
                "Revenue increased compared with the previous year."
            )

        elif revenue_growth < 0:

            observations.append(
                "Revenue decreased compared with the previous year."
            )

        else:

            observations.append(
                "Revenue remained approximately stable."
            )

    if net_profit_margin is not None:

        if net_profit_margin > 20:

            observations.append(
                "The company has a relatively strong net profit margin."
            )

        elif net_profit_margin > 0:

            observations.append(
                "The company generated a positive net profit margin."
            )

        else:

            observations.append(
                "The company reported a negative net profit margin."
            )

    if free_cash_flow is not None:

        if free_cash_flow > 0:

            observations.append(
                "The company generated positive free cash flow."
            )

        elif free_cash_flow < 0:

            observations.append(
                "The company reported negative free cash flow."
            )

    if debt_to_equity is not None:

        if debt_to_equity < 1:

            observations.append(
                "Debt is lower than shareholders' equity."
            )

        elif debt_to_equity >= 1:

            observations.append(
                "Debt is at least as large as shareholders' equity."
            )

    # --------------------------------------------------------
    # STEP 8: Return analysis
    # --------------------------------------------------------

    return {
        "ticker": ticker,

        "metrics": {

            "latest_revenue": latest_revenue,

            "previous_revenue": previous_revenue,

            "revenue_growth_percent":
                revenue_growth,

            "net_income":
                latest_net_income,

            "net_profit_margin_percent":
                net_profit_margin,

            "operating_cash_flow":
                latest_operating_cash_flow,

            "capital_expenditure":
                latest_capital_expenditure,

            "free_cash_flow":
                free_cash_flow,

            "total_debt":
                total_debt,

            "debt_to_equity":
                debt_to_equity,

            "assets":
                assets,

            "liabilities":
                liabilities,

            "cash":
                cash,

            "equity":
                equity,

            "return_on_assets_percent":
                roa,

            "return_on_equity_percent":
                roe,
        },

        "observations":
            observations,

        "source_tags":
            source_tags,

        "methodology": {

            "revenue_growth":
                "((Current Revenue - Previous Revenue) / Previous Revenue) * 100",

            "net_profit_margin":
                "(Net Income / Revenue) * 100",

            "free_cash_flow":
                "Operating Cash Flow - Capital Expenditure",

            "debt_to_equity":
                "Total Debt / Shareholders' Equity",

            "return_on_assets":
                "(Net Income / Total Assets) * 100",

            "return_on_equity":
                "(Net Income / Shareholders' Equity) * 100",
        },

        "data_source":
            "SEC EDGAR XBRL Company Facts",

        "disclaimer":
            "This analysis is for financial research purposes only "
            "and is not personalized investment advice.",
    }