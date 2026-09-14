import asyncio

from app.graph.workflow import financial_research_graph


async def main():

    result = await financial_research_graph.ainvoke(
        {
            "ticker": "AAPL",
            "errors": [],
        }
    )

    print(
        "\n========== LANGGRAPH RESULT ==========\n"
    )

    print("Ticker:")
    print(result.get("ticker"))

    print("\nCompany Data:")
    print(result.get("company_data"))

    print("\nFinancial Data:")
    print(result.get("financial_data"))

    print("\nFinancial Analysis:")
    print(result.get("financial_analysis"))

    print("\nNews & Developments:")
    print(result.get("news_data"))

    print("\nRisk Analysis:")
    print(result.get("risk_analysis"))

    print("\nReviewer Result:")
    print(result.get("reviewer_result"))

    print("\nErrors:")
    print(result.get("errors"))

    print(
        "\n======================================\n"
    )


if __name__ == "__main__":
    asyncio.run(main())