import os

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = None

if API_KEY:
    client = genai.Client(api_key=API_KEY)


MODEL = "gemini-3.6-flash"


def clean_response(text: str) -> str:
    """
    Remove Markdown formatting so the frontend
    receives clean plain text.
    """

    text = text.replace("###", "")
    text = text.replace("##", "")
    text = text.replace("#", "")

    text = text.replace("**", "")
    text = text.replace("*", "")

    text = text.replace("`", "")

    return text.strip()


def ask_gemini(
    prompt: str,
    use_search: bool = False
):

    if not API_KEY or client is None:
        return (
            "AI service is not configured. "
            "GEMINI_API_KEY is missing."
        )

    try:

        config = types.GenerateContentConfig(
            max_output_tokens=1500,

            thinking_config=types.ThinkingConfig(
                thinking_level="minimal"
            )
        )

        # Enable Google Search only when needed
        if use_search:

            config.tools = [
                types.Tool(
                    google_search=types.GoogleSearch()
                )
            ]

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=config
        )

        # ----------------------------------
        # Debug information
        # ----------------------------------

        if response.candidates:

            candidate = response.candidates[0]

            print(
                "Gemini finish reason:",
                candidate.finish_reason
            )

        # ----------------------------------
        # Collect ALL generated text
        # ----------------------------------

        answer_parts = []

        if response.candidates:

            candidate = response.candidates[0]

            if candidate.content:

                for part in candidate.content.parts:

                    if getattr(part, "thought", False):
                        continue

                    if part.text:
                        answer_parts.append(part.text)

        answer = "".join(answer_parts).strip()

        # ----------------------------------
        # No answer
        # ----------------------------------

        if not answer:

            return (
                "I couldn't generate an answer right now."
            )

        # ----------------------------------
        # Clean Markdown
        # ----------------------------------

        answer = clean_response(answer)

        return answer

    except Exception as e:

        error = str(e)

        print(
            f"Gemini error | "
            f"model={MODEL} | "
            f"{error}"
        )

        # Rate limit
        if (
            "429" in error
            or "RESOURCE_EXHAUSTED" in error
        ):
            return (
                "The AI service has temporarily "
                "reached its usage limit. "
                "Please try again later."
            )

        # Temporary outage
        if (
            "503" in error
            or "UNAVAILABLE" in error
        ):
            return (
                "The AI service is temporarily unavailable. "
                "Please try again shortly."
            )

        # Authentication
        if (
            "401" in error
            or "403" in error
        ):
            return (
                "The AI service authentication failed. "
                "Please check the Gemini API configuration."
            )

        # Model unavailable
        if (
            "404" in error
            or "NOT_FOUND" in error
        ):
            return (
                "The configured Gemini model is unavailable. "
                "Please check the AI model configuration."
            )

        return (
            "I'm having trouble connecting to the AI service "
            "right now. Please try again shortly."
        )