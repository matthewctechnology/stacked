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
            html, body {{
                min-height: 100vh;
                margin: 0;
                padding: 0;
                font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
                background: #000000;
                color: #fafafa;
            }}
            .container {{
                # display: grid;
                align-items: center;
                justify-items: center;
                padding: 32px 32px 32px 32px;
            }}
            @media (min-width: 640px) {{
                .container {{
                    padding: 32px 32px 32px 32px;
                }}
                .main {{
                    align-items: flex-start;
                }}
            }}
            .main {{
                display: flex;
                flex-direction: column;
                gap: 32px;
                grid-row: 2;
                align-items: center;
            }}
            .idea {{
                background: rgba(255,255,255,1);
                color: rgba(0,0,0,1);
                font-family: 'Fira Mono', 'Menlo', 'Monaco', monospace;
                font-weight: 300;
                padding: 4px 8px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 1rem;
                max-width: 600px;
                text-align: center;
                box-shadow: 0 2px 8px #0002;
            }}
            .footer {{
                background: rgba(0,0,0,0.05);
                color: rgba(255,255,255,0.25);
                font-size: 9px;
                font-family: 'Fira Mono', 'Menlo', 'Monaco', monospace;
                font-weight: 300;
                grid-row: 3;
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                padding: 2px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <main class="main">
                <div class="idea">{idea}</div>
            </main>
            <footer class="footer">
                <p>unvalidated responses inferred at individual risk</p>
            </footer>
        </div>
    </body>
    </html>
    """

    return HTMLResponse(content=html, status_code=200)
