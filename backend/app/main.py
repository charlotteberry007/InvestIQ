from fastapi import FastAPI
from app.api.market import router as market_router
from app.api.risk import router as risk_router
from app.database.database import Base, engine
from app.models.portfolio import Portfolio
from fastapi.middleware.cors import CORSMiddleware
from app.api.portfolio import router as portfolio_router
from app.api.stocks import router as stock_router
from app.api.recommendation import (
    router as recommendation_router
)
from app.api.assistant import router as assistant_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="InvestIQ API",
    description="AI-powered Portfolio Risk Analysis & Investment Insights Platform",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(portfolio_router)
app.include_router(market_router)
app.include_router(risk_router)
app.include_router(stock_router)
app.include_router(recommendation_router)
app.include_router(dashboard_router)
app.include_router(assistant_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to InvestIQ API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }