from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio
from app.services.market_service import (
    get_market_value,
    get_daily_data
)



def create_portfolio(db: Session, ticker: str, shares: float):

    ticker = ticker.strip().upper()

    if not ticker:
        raise ValueError("Ticker cannot be empty")

    if shares <= 0:
        raise ValueError("Shares must be greater than zero")

    existing = (
        db.query(Portfolio)
        .filter(Portfolio.ticker == ticker)
        .first()
    )

    if existing:
        existing.shares += shares
        db.commit()
        db.refresh(existing)
        return existing

    portfolio = Portfolio(
        ticker=ticker,
        shares=shares
    )

    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return portfolio

def get_all_portfolios(db: Session):
    portfolios = db.query(Portfolio).all()

    result = []

    for stock in portfolios:

        # Skip invalid records
        if not stock.ticker or stock.ticker.strip() == "":
            continue

        market_data = get_market_value(
            stock.ticker,
            stock.shares
        )

        market_data["id"] = stock.id
        result.append(market_data)

    return result
    

def get_portfolio_by_id(db: Session, portfolio_id: int):
    return db.query(Portfolio).filter(
        Portfolio.id == portfolio_id
    ).first()


def delete_portfolio(db: Session, portfolio_id: int):
    portfolio = get_portfolio_by_id(db, portfolio_id)

    if portfolio:
        db.delete(portfolio)
        db.commit()

    return portfolio
def get_portfolio_summary(db: Session):
    portfolios = db.query(Portfolio).all()

    total_value = 0
    largest_stock = None
    largest_value = 0
    daily_gain = 0
    for stock in portfolios:
        market_data = get_market_value(
            stock.ticker,
            stock.shares
        )
        daily = get_daily_data(stock.ticker)

        gain = ( daily["current_price"] - daily["previous_close"]) * stock.shares

        daily_gain += gain

        value = market_data["market_value"]

        total_value += value

        if value > largest_value:
            largest_value = value
            largest_stock = stock.ticker

    return {
        "total_portfolio_value": round(total_value, 2),
        "total_holdings": len(portfolios),
        "largest_holding": largest_stock,
        "largest_value": round(largest_value, 2),
        "daily_gain": round(daily_gain, 2)
    }