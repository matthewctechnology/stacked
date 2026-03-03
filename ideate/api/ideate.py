"""
FastAPI app for ideate web API, matching CLI logic and supporting fallback.
"""
from fastapi import FastAPI, Response, Query
from fastapi.responses import HTMLResponse

from ideate.ai.ai_provider import get_ai_idea
from ideate.fallback.fallback_provider import get_fallback_idea
from ideate.option.option_provider import normalize_topic


app = FastAPI()

@app.get("/ideate", response_class=HTMLResponse)
async def ideate(
    topic: str = Query(default=None, description="Optional topic"),
    fallback: bool = Query(default=False, description="Force fallback idea"),
) -> Response:
    """
    Serves a basic HTML page with a creative idea, using AI provider with fallback.
    """
    canonical_topic = normalize_topic(topic) if topic else None

    if fallback:
        idea = get_fallback_idea()
    else:
        idea, _, status = get_ai_idea(canonical_topic)
        if status != 200 or not idea:
            idea = get_fallback_idea()
    if canonical_topic:
        idea = f"{canonical_topic} Idea: {idea}"

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>ideate - Creative Idea</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{
                background: #18181b;
                color: #fafafa;
                font-family: sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }}
            .idea {{
                background: #27272a;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 2px 8px #0002;
                font-size: 1.5rem;
                max-width: 600px;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="idea">{idea}</div>
    </body>
    </html>
    """

    return HTMLResponse(content=html, status_code=200)
