"""
Provides random fallback idea from the predetermined list.
"""
import random
from typing import List

from ideate.fallback.fallback_responses import responses


def get_fallback_idea() -> str:
    """
    Returns random idea from the fallback responses.

    :return: string
    """
    fallback_ideas: List = responses

    return random.choice(fallback_ideas)
