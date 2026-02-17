"""
Tests for fallback provider.
"""
from ideate.fallback.fallback_provider import get_fallback_idea
from ideate.fallback.fallback_responses import responses


def test_get_fallback_idea() -> None:
    """
    Tests get_fallback_idea returns a valid idea.
    """
    idea = get_fallback_idea()

    assert idea in responses
