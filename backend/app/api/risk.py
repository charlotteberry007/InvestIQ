from fastapi import APIRouter
from app.database.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.risk.risk_service import (
    calculate_risk_metrics,
    calculate_portfolio_risk,
)

router = APIRouter(
    prefix="/risk",
    tags=["Risk Analysis"]
)

@router.get("/portfolio")
def portfolio_risk(
    db: Session = Depends(get_db)
):
    return calculate_portfolio_risk(db)


@router.get("/{ticker}")
def risk_analysis(ticker: str):
    return calculate_risk_metrics(ticker)
