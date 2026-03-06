"""
Provides AI-powered creative idea generation via GitHub Models API.
"""
import os
from typing import Optional, Tuple

from openai import OpenAI, APIConnectionError, AuthenticationError, BadRequestError, OpenAIError


def get_ai_idea(topic: Optional[str] = None) -> Tuple[Optional[str], Optional[str], int]:
    """
    Returns a creative idea from the GitHub Models API, or error and status code.

    :param topic: string
    :return: (idea, error, status_code)
    """
    token = os.environ.get("GITHUB_TOKEN")
    if not token:

        return None, "server misconfigured", 500

    endpoint = "https://models.github.ai/inference"
    model = "openai/gpt-4.1"
    system_message = (
        f"You are a safe creative {topic.lower() if topic else ''} assistant. "
        "Generate a novel, viable, and valuable idea. "
        + "Respond in one clear, concise sentence "
        + "with about ten to fifteen words."
    )
    user_message = f"Generate a creative idea{f' about {topic}' if topic else ''}."

    try:
        openai = OpenAI(
            base_url=endpoint,
            api_key=token,
        )
        response = openai.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            temperature=0.8,
            top_p=1.0,
            max_tokens=64,
            n=1,
            stream=False,
        )
        content = response.choices[0].message.content

        return content.strip() if content else None, None, 200

    except AuthenticationError:

        return None, "authentication failed", 401

    except APIConnectionError:

        return None, "connection error", 502

    except BadRequestError:

        return None, "invalid request", 400

    except OpenAIError as e:

        return None, str(e), 502
