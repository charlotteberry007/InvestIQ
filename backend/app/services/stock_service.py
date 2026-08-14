from yahooquery import search
import yfinance as yf


def search_stocks(query: str):

    if len(query) < 2:
        return []

    result = search(query)

    quotes = result.get("quotes", [])

    stocks = []

    for item in quotes:

        if item.get("quoteType") != "EQUITY":
            continue

        stocks.append({
            "ticker": item.get("symbol"),
            "company": item.get("shortname", item.get("longname", "")),
        })

    return stocks[:10]


def get_stock_details(ticker: str):

    stock = yf.Ticker(ticker)

    info = stock.info

    return {

        "ticker": ticker,

        "company": info.get("longName"),

        "price": info.get("currentPrice"),

        "sector": info.get("sector"),

        "currency": info.get("currency")
    }