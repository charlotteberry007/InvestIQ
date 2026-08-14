from sqlalchemy.orm import Session

from app.services.portfolio_service import (
    get_all_portfolios,
    get_portfolio_summary,
)

from app.services.market_service import (
    get_portfolio_history_service,
)

from app.risk.risk_service import (
    calculate_portfolio_risk,
)

from app.services.recommendation_service import (
    generate_recommendation,
)


def get_dashboard(db: Session):

    return {

        "summary":
            get_portfolio_summary(db),

        "holdings":
            get_all_portfolios(db),

        "history":
            get_portfolio_history_service(db),

        "risk":
            calculate_portfolio_risk(db),

        "recommendation":
            generate_recommendation(db)["recommendation"]

    }