from fastapi import APIRouter

from app.services.stock_service import (
    search_stocks,
    get_stock_details
)

router = APIRouter(
    prefix="/stocks",
    tags=["Stocks"]
)


@router.get("/search")
def search_stock(q: str):

    return search_stocks(q)


@router.get("/{ticker}")
def stock_details(ticker: str):

    return get_stock_details(ticker)