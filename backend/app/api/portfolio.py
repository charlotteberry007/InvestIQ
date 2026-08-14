from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.portfolio_service import get_portfolio_summary
from app.database.database import get_db
from app.schemas.portfolio import PortfolioCreate
from app.services.portfolio_service import (
    create_portfolio,
    get_all_portfolios,
    delete_portfolio,
)

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)


@router.post("/")
def add_portfolio(
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db)
):
    return create_portfolio(
        db,
        portfolio.ticker,
        portfolio.shares
    )


@router.get("/")
def read_portfolios(
    db: Session = Depends(get_db)
):
    return get_all_portfolios(db)

@router.get("/summary")
def portfolio_summary(
    db: Session = Depends(get_db)
):
    return get_portfolio_summary(db)


@router.delete("/{portfolio_id}")
def remove_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db)
):
    return delete_portfolio(
        db,
        portfolio_id
    )