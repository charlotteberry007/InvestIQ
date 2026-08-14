import yfinance as yf
import numpy as np
import pandas as pd

from app.models.portfolio import Portfolio


def calculate_risk_metrics(ticker: str):

    stock = yf.Ticker(ticker)

    history = stock.history(period="1y", auto_adjust=True)

    if history.empty:
        return {
            "ticker": ticker.upper(),
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    returns = history["Close"].pct_change().dropna()

    if returns.empty:
        return {
            "ticker": ticker.upper(),
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    annual_return = returns.mean() * 252
    annual_volatility = returns.std() * np.sqrt(252)

    sharpe_ratio = 0

    if annual_volatility != 0:
        sharpe_ratio = annual_return / annual_volatility

    var95 = np.percentile(returns, 5)

    cumulative = (1 + returns).cumprod()
    running_max = cumulative.cummax()

    drawdown = (cumulative - running_max) / running_max

    max_drawdown = drawdown.min()

    return {
        "ticker": ticker.upper(),
        "annual_return": round(float(annual_return), 4),
        "annual_volatility": round(float(annual_volatility), 4),
        "sharpe_ratio": round(float(sharpe_ratio), 4),
        "value_at_risk_95": round(float(var95), 4),
        "maximum_drawdown": round(float(max_drawdown), 4),
    }


def calculate_portfolio_risk(db):

    portfolios = db.query(Portfolio).all()

    if not portfolios:
        return {
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    portfolio_returns = pd.DataFrame()

    weights = {}
    total_value = 0

    # -----------------------------
    # Calculate portfolio weights
    # -----------------------------
    for holding in portfolios:

        try:
            stock = yf.Ticker(holding.ticker)

            info = stock.info

            price = info.get("currentPrice")

            if price is None:
                continue

            value = price * holding.shares

            weights[holding.ticker] = value

            total_value += value

        except Exception:
            continue

    if total_value == 0:
        return {
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    for ticker in weights:
        weights[ticker] /= total_value

    # -----------------------------
    # Download return series
    # -----------------------------
    for ticker in weights.keys():

        try:

            history = yf.Ticker(ticker).history(
                period="1y",
                auto_adjust=True
            )

            if history.empty:
                continue

            returns = history["Close"].pct_change().dropna()

            if returns.empty:
                continue

            portfolio_returns[ticker] = returns

        except Exception:
            continue

    if portfolio_returns.empty:
        return {
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    # Fill missing trading days with 0% return
    portfolio_returns = portfolio_returns.fillna(0)

    weighted_returns = pd.Series(
        0.0,
        index=portfolio_returns.index
    )

    for ticker in portfolio_returns.columns:

        weighted_returns += (
            portfolio_returns[ticker] *
            weights[ticker]
        )

    weighted_returns = weighted_returns.dropna()

    if weighted_returns.empty:
        return {
            "annual_return": 0,
            "annual_volatility": 0,
            "sharpe_ratio": 0,
            "value_at_risk_95": 0,
            "maximum_drawdown": 0,
        }

    annual_return = weighted_returns.mean() * 252

    annual_volatility = (
        weighted_returns.std() * np.sqrt(252)
    )

    sharpe_ratio = 0

    if annual_volatility != 0:
        sharpe_ratio = annual_return / annual_volatility

    var95 = np.percentile(weighted_returns, 5)

    cumulative = (1 + weighted_returns).cumprod()

    running_max = cumulative.cummax()

    drawdown = (
        cumulative - running_max
    ) / running_max

    max_drawdown = drawdown.min()

    return {

        "annual_return": round(float(annual_return), 4),

        "annual_volatility": round(float(annual_volatility), 4),

        "sharpe_ratio": round(float(sharpe_ratio), 4),

        "value_at_risk_95": round(float(var95), 4),

        "maximum_drawdown": round(float(max_drawdown), 4),

    }