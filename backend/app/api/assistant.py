from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.dashboard_service import get_dashboard
from app.services.ai_service import ask_gemini


router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)


class Question(BaseModel):
    question: str


@router.post("/")
def assistant(
    body: Question,
    db: Session = Depends(get_db)
):

    dashboard = get_dashboard(db)

    question = body.question.strip()

    # -----------------------------------------
    # Determine if external/current information
    # is required
    # -----------------------------------------

    question_lower = question.lower()

    search_keywords = [
        "latest",
        "today",
        "current",
        "news",
        "recent",
        "what happened",
        "market today",
        "search internet",
        "search online",
        "look online",
        "web search"
    ]

    use_search = any(
        keyword in question_lower
        for keyword in search_keywords
    )

    # -----------------------------------------
    # Prompt
    # -----------------------------------------

    prompt = f"""
You are InvestIQ, an AI investment assistant.

Your job is to give the user a useful, direct answer
about their investment portfolio.

PORTFOLIO SUMMARY:
{dashboard["summary"]}

HOLDINGS:
{dashboard["holdings"]}

RISK:
{dashboard["risk"]}

RECOMMENDATION:
{dashboard["recommendation"]}


USER QUESTION:
{question}


IMPORTANT RESPONSE RULES:

1. Answer the user's actual question first.

2. Do not begin with a long disclaimer.

3. If the user asks whether a stock is bad, risky,
   good, or worth considering, give a clear assessment
   based on the available portfolio data.

4. Clearly separate:
   - facts shown by the portfolio
   - reasonable conclusions from those facts
   - information that cannot be determined

5. Do not invent financial information.

6. If company fundamentals or current market information
   are required to make a definitive investment judgment,
   say that briefly AFTER giving the portfolio-based assessment.

7. If the question requires current information,
   use Google Search.

8. Give a complete answer.
   Never stop after an introduction such as
   "Here is why:".

9. Keep the answer between approximately 80 and 160 words.

10. Use plain text only.

11. Do NOT use:
    # 
    ##
    ###
    *
    **
    bullet symbols
    backticks
    Markdown formatting.

12. Use short paragraphs instead.

13. End with a clear conclusion.


Now answer the user's question.
"""

    # -----------------------------------------
    # Ask Gemini
    # -----------------------------------------

    answer = ask_gemini(
        prompt,
        use_search=use_search
    )

    return {
        "answer": answer
    }