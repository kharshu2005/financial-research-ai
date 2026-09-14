from app.db.database import SessionLocal
from app.db.repository import (
    get_or_create_company,
    create_research_run,
    save_agent_result,
    get_agent_results,
)


db = SessionLocal()

try:
    # Create/get company
    company = get_or_create_company(
        db=db,
        ticker="AAPL",
        name="Apple Inc.",
    )

    print("✅ Company:", company.ticker)

    # Create research run
    research_run = create_research_run(
        db=db,
        company_id=company.id,
        query="Analyze Apple's financial performance",
    )

    print("✅ Research Run ID:", research_run.id)

    # Save an agent result
    result = save_agent_result(
        db=db,
        research_run_id=research_run.id,
        agent_name="Company Research Agent",
        result="Apple is a technology company with strong revenue and profitability.",
    )

    print("✅ Agent Result ID:", result.id)

    # Retrieve results
    results = get_agent_results(
        db=db,
        research_run_id=research_run.id,
    )

    print("✅ Stored Agent Results:", len(results))

finally:
    db.close()