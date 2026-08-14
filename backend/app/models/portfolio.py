from sqlalchemy import Column, Integer, String, Float

from app.database.database import Base


class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)

    ticker = Column(String(10), nullable=False)

    shares = Column(Float, nullable=False)