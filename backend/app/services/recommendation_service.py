from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio
from app.services.market_service import get_market_value
from app.risk.risk_service import calculate_portfolio_risk


def generate_recommendation(db: Session):

    portfolios = db.query(Portfolio).all()

    if not portfolios:
        return {
            "recommendation":
            "Your portfolio is empty. Add some stocks to begin."
        }

    total_value = 0
    values = {}

    for stock in portfolios:

        market = get_market_value(
            stock.ticker,
            stock.shares
        )

        value = market["market_value"]

        values[stock.ticker] = value

        total_value += value

    largest_stock = max(values, key=values.get)

    largest_percent = (
        values[largest_stock] / total_value
    ) * 100

    risk = calculate_portfolio_risk(db)

    sharpe = risk["sharpe_ratio"]
    volatility = risk["annual_volatility"]

    recommendations = []

    if len(portfolios) < 5:
        recommendations.append(
            "Your portfolio has few holdings. Consider adding more stocks for diversification."
        )

    if largest_percent > 40:
        recommendations.append(
            f"{largest_stock} represents {largest_percent:.1f}% of your portfolio. Consider reducing concentration."
        )

    if sharpe > 1:
        recommendations.append(
            "Risk-adjusted performance is strong."
        )
    elif sharpe < 0.5:
        recommendations.append(
            "Risk-adjusted performance is weak."
        )

    if volatility > 0.30:
        recommendations.append(
            "Portfolio volatility is relatively high."
        )

    if not recommendations:
        recommendations.append(
            "Portfolio appears balanced based on the current analysis."
        )

    return {
        "recommendation": " ".join(recommendations)
    }