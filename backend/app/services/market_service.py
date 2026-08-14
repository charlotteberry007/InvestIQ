from app.models.portfolio import Portfolio
from sqlalchemy.orm import Session
import pandas as pd
import yfinance as yf

def get_daily_data(ticker: str):
    stock = yf.Ticker(ticker)

    info = stock.info

    return {
        "current_price": info.get("currentPrice", 0),
        "previous_close": info.get("previousClose", 0)
    }

def get_stock_data(ticker: str):
    stock = yf.Ticker(ticker)

    info = stock.info

    return {
        "ticker": ticker.upper(),
        "company": info.get("longName"),
        "current_price": info.get("currentPrice"),
        "previous_close": info.get("previousClose"),
        "open": info.get("open"),
        "high": info.get("dayHigh"),
        "low": info.get("dayLow"),
        "volume": info.get("volume"),
        "market_cap": info.get("marketCap"),
        "currency": info.get("currency")
    }


def get_market_value(ticker: str, shares: float):
    stock = get_stock_data(ticker)

    price = stock.get("current_price")

    if price is None:
        price = 0

    return {
        "ticker": ticker.upper(),
        "company": stock.get("company"),
        "shares": shares,
        "current_price": price,
        "market_value": round(price * shares, 2),
        "currency": stock.get("currency")
    }
def get_price_history(ticker: str):
    stock = yf.Ticker(ticker)

    history = stock.history(period="6mo")

    data = []

    for date, row in history.iterrows():
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2)
        })

    return data
def get_portfolio_history_service(db: Session):

    portfolios = db.query(Portfolio).all()

    if not portfolios:
        return []

    tickers = [
        holding.ticker.upper()
        for holding in portfolios
    ]

    shares = {
        holding.ticker.upper(): holding.shares
        for holding in portfolios
    }

    try:

        history = yf.download(
            tickers=tickers,
            period="6mo",
            progress=False,
            auto_adjust=False,
            threads=False
        )

    except Exception as e:

        print(
            "Yahoo Finance history error:",
            e
        )

        return []

    if history.empty:
        return []

    try:

        # ---------------------------------
        # Multiple ticker response
        # ---------------------------------

        if len(tickers) > 1:

            close_data = history["Close"].copy()

        # ---------------------------------
        # Single ticker response
        # ---------------------------------

        else:

            close_data = history[["Close"]].copy()

            close_data.columns = [
                tickers[0]
            ]


        # ---------------------------------
        # Calculate each holding's value
        # ---------------------------------

        for ticker in tickers:

            if ticker in close_data.columns:

                close_data[ticker] = (
                    close_data[ticker]
                    * shares[ticker]
                )


        # ---------------------------------
        # Remove rows where everything
        # is unavailable
        # ---------------------------------

        close_data = close_data.dropna(
            how="all"
        )

        if close_data.empty:
            return []


        # ---------------------------------
        # Forward-fill missing prices
        # ---------------------------------

        close_data = close_data.ffill()


        # ---------------------------------
        # Calculate portfolio value
        # ---------------------------------

        close_data["Total"] = (
            close_data.sum(
                axis=1,
                skipna=True
            )
        )


        # ---------------------------------
        # Convert to API response
        # ---------------------------------

        result = []

        for date, row in close_data.iterrows():

            result.append({
                "date": date.strftime(
                    "%Y-%m-%d"
                ),
                "close": round(
                    float(row["Total"]),
                    2
                )
            })

        return result


    except Exception as e:

        print(
            "Portfolio history processing error:",
            e
        )

        return []