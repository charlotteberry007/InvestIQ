from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.market_service import (
    get_stock_data,
    get_price_history,
    get_portfolio_history_service
)

router = APIRouter(
    prefix="/market",
    tags=["Market"]
)


# Put this FIRST
@router.get("/portfolio/history")
def get_portfolio_history(
    db: Session = Depends(get_db)
):
    return get_portfolio_history_service(db)


# Stock history
@router.get("/{ticker}/history")
def history(ticker: str):
    return get_price_history(ticker)


# Stock details
@router.get("/{ticker}")
def market_data(ticker: str):
    return get_stock_data(ticker)