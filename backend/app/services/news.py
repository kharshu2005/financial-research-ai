import os
import re
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse

from dotenv import load_dotenv
from tavily import AsyncTavilyClient

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


# ============================================================
# HELPER — GET WEBSITE DOMAIN
# ============================================================

def get_domain(url: str) -> str:
    """Extract the website domain safely."""

    if not url:
        return ""

    try:
        return urlparse(url).netloc.replace("www.", "")
    except Exception:
        return ""


# ============================================================
# HELPER — COMPANY KEYWORDS
# ============================================================

def get_company_keywords(
    company_name: str | None
) -> list[str]:
    """Extract important words from the company name."""

    if not company_name:
        return []

    stop_words = {
        "inc",
        "incorporated",
        "corp",
        "corporation",
        "company",
        "co",
        "limited",
        "ltd",
        "plc",
        "the",
    }

    words = re.findall(
        r"[a-z0-9]+",
        company_name.lower()
    )

    return [
        word
        for word in words
        if word not in stop_words
        and len(word) > 2
    ]


# ============================================================
# HELPER — CHECK COMPANY RELEVANCE
# ============================================================

def is_relevant_article(
    title: str,
    content: str,
    ticker: str,
    company_name: str | None,
) -> bool:
    """
    Check whether the article is actually about the
    requested company.

    Matching is performed primarily against the title,
    while allowing punctuation differences such as:
    McDonald's -> MCDONALDS
    Coca-Cola -> COCA COLA
    """

    if not title:
        return False

    # --------------------------------------------------------
    # NORMALIZE TEXT
    # --------------------------------------------------------

    def normalize(text: str) -> str:
        return re.sub(
            r"[^a-z0-9]",
            "",
            text.lower(),
        )

    title_normalized = normalize(title)
    ticker_normalized = normalize(ticker)

    # --------------------------------------------------------
    # 1. TICKER IN TITLE
    # --------------------------------------------------------

    if ticker_normalized and ticker_normalized in title_normalized:
        return True

    # --------------------------------------------------------
    # 2. COMPANY NAME / BRAND IN TITLE
    # --------------------------------------------------------

    if company_name:

        keywords = get_company_keywords(company_name)

        normalized_keywords = [
            normalize(keyword)
            for keyword in keywords
            if keyword
        ]

        # ----------------------------------------------------
        # Single important company keyword
        # Example:
        # MCDONALDS -> McDonald's
        # MICROSOFT -> Microsoft
        # NVIDIA -> NVIDIA
        # ----------------------------------------------------

        if len(normalized_keywords) == 1:

            keyword = normalized_keywords[0]

            if keyword in title_normalized:
                return True

        # ----------------------------------------------------
        # Multiple important keywords
        # Example:
        # COCA COLA
        # BANK OF AMERICA
        # ----------------------------------------------------

        elif len(normalized_keywords) >= 2:

            matches = sum(
                1
                for keyword in normalized_keywords
                if keyword in title_normalized
            )

            if matches >= 2:
                return True

    return False

    


# ============================================================
# HELPER — PARSE PUBLISHED DATE
# ============================================================

def parse_published_date(
    value: str | None
):
    """Convert Tavily published date into datetime."""

    if not value:
        return None

    try:

        return datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )

    except Exception:

        return None


# ============================================================
# HELPER — NEWS IMPORTANCE
# ============================================================

def calculate_importance(
    title: str,
    content: str,
) -> str:
    """Assign deterministic importance to an article."""

    text = (
        f"{title} {content}"
    ).lower()

    high_keywords = [
        "earnings",
        "revenue",
        "profit",
        "acquisition",
        "merger",
        "lawsuit",
        "regulatory",
        "regulation",
        "investigation",
        "ceo",
        "leadership",
        "recall",
        "major",
    ]

    if any(
        keyword in text
        for keyword in high_keywords
    ):
        return "high"

    return "medium"


# ============================================================
# MAIN — NEWS & DEVELOPMENTS AGENT
# ============================================================

async def get_company_news(
    ticker: str,
    company_name: str | None = None,
) -> dict:

    if not TAVILY_API_KEY:
        raise RuntimeError(
            "TAVILY_API_KEY is not configured"
        )

    ticker = ticker.strip().upper()

    client = AsyncTavilyClient(
        api_key=TAVILY_API_KEY
    )

    current_date = datetime.now(
        timezone.utc
    )

    # --------------------------------------------------------
    # Only accept news from the last 30 days.
    # --------------------------------------------------------

    cutoff_date = (
        current_date
        - timedelta(days=30)
    )

    # --------------------------------------------------------
    # COMPANY-SPECIFIC SEARCH QUERY
    # --------------------------------------------------------

    if company_name:

        query = f"""
        "{company_name}" "{ticker}"
        latest news about the company
        recent company developments
        financial results
        earnings
        products
        partnerships
        acquisitions
        regulatory developments
        leadership changes
        """

    else:

        query = f"""
        "{ticker}"
        latest company news
        recent company developments
        financial results
        earnings
        products
        partnerships
        acquisitions
        regulatory developments
        leadership changes
        """

    try:

        response = await client.search(
            query=query,
            search_depth="basic",
            topic="news",
            max_results=10,
            include_answer=False,
            time_range="month",
        )
        print("\n========== TAVILY DEBUG ==========")
        print("QUERY:", query)
        print("TOTAL RESULTS:", len(response.get("results", [])))

        for r in response.get("results", []):
            print("TITLE:", r.get("title"))
            print("URL:", r.get("url"))
            print("DATE:", r.get("published_date"))
            print("----------------------------------")

        print("==================================\n")



        articles = []

        # ====================================================
        # PROCESS SEARCH RESULTS
        # ====================================================

        for result in response.get(
            "results",
            []
        ):

            title = result.get(
                "title",
                ""
            ).strip()

            content = result.get(
                "content",
                ""
            ).strip()

            url = result.get(
                "url",
                ""
            )

            published_date = result.get(
                "published_date"
            )

            # ------------------------------------------------
            # COMPANY RELEVANCE FILTER
            # ------------------------------------------------

            if not is_relevant_article(
                title=title,
                content=content,
                ticker=ticker,
                company_name=company_name,
            ):
                continue

            # ------------------------------------------------
            # DATE FILTER
            # ------------------------------------------------

            parsed_date = parse_published_date(
                published_date
            )

            if parsed_date is not None:

                if parsed_date.tzinfo is None:

                    parsed_date = (
                        parsed_date.replace(
                            tzinfo=timezone.utc
                        )
                    )

                if parsed_date < cutoff_date:
                    continue

            # ------------------------------------------------
            # SAVE VALID ARTICLE
            # ------------------------------------------------

            articles.append(
                {
                    "title": title,
                    "date": published_date,
                    "source": get_domain(url),
                    "url": url,
                    "summary": content,
                    "importance": calculate_importance(
                        title,
                        content,
                    ),
                }
            )

            # Maximum 5 articles
            if len(articles) >= 5:
                break

        # ====================================================
        # RETURN RESULT
        # ====================================================

        return {
            "ticker": ticker,
            "retrieved_at": current_date.isoformat(),
            "articles": articles,
            "overall_summary": (
                f"Retrieved {len(articles)} "
                f"relevant recent news results "
                f"for {ticker}."
            ),
            "source": "Tavily Web Search",
            "status": "completed",
        }

    except Exception as exc:

        raise RuntimeError(
            f"Tavily news search failed: {str(exc)}"
        )