from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.recommendation_service import generate_recommendation

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)

@router.get("/")
def recommendation(
    db: Session = Depends(get_db)
):
    return generate_recommendation(db)