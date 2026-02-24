"""
Provides AI-powered creative idea generation via GitHub Models API.
"""
import os
from typing import Optional

from openai import OpenAI


def get_ai_idea(topic: Optional[str] = None) -> Optional[str]:
    """
    Returns a creative idea from the GitHub Models API, or None on failure.

    :param topic: string
    :return: Optional[str] or None
    """
    token = os.environ.get("GITHUB_TOKEN")
    if not token:

        return None

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
        client = OpenAI(
            base_url=endpoint,
            api_key=token,
        )
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            temperature=0.5,
            top_p=1.0,
            max_tokens=64,
            n=1,
            stream=False,
        )
        content = response.choices[0].message.content

        return content.strip() if content else None

    except Exception:  # pylint: disable=broad-except

        return None
