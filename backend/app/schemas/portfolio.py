from pydantic import BaseModel


class PortfolioCreate(BaseModel):
    ticker: str
    shares: float


class PortfolioResponse(BaseModel):
    id: int
    ticker: str
    shares: float

    class Config:
        from_attributes = True