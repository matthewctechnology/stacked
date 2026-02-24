"""
Tests ideate AI provider.
"""
import os
from unittest.mock import patch, MagicMock

from ideate.ai.ai_provider import get_ai_idea


def setup_module(module) -> None:
    """Save original environment."""
    module.ORIGINAL_ENV = dict(os.environ)

def teardown_module(module) -> None:
    """Restore original environment."""
    os.environ.clear()
    os.environ.update(module.ORIGINAL_ENV)

def test_get_ai_idea_success() -> None:
    """
    Tests ideate get_ai_idea returns a string when OpenAI call succeeds.
    """
    os.environ["GITHUB_TOKEN"] = "test-token"
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = "A sketchbook that encourages practice."
    mock_response.choices = [mock_choice]

    with patch("ideate.ai.ai_provider.OpenAI") as mock_openai:
        mock_openai.return_value.chat.completions.create.return_value = mock_response
        idea = get_ai_idea("Art")

        assert idea == "A sketchbook that encourages practice."

def test_get_ai_idea_exception() -> None:
    """
    Tests ideate get_ai_idea returns None if OpenAI call raises.
    """
    os.environ["GITHUB_TOKEN"] = "test-token"
    with patch("ideate.ai.ai_provider.OpenAI") as mock_openai:
        mock_openai.return_value.chat.completions.create.side_effect = Exception("test")
        idea = get_ai_idea("Art")

        assert idea is None

def test_get_ai_idea_no_token() -> None:
    """
    Tests ideate get_ai_idea returns None if GITHUB_TOKEN is missing.
    """
    if "GITHUB_TOKEN" in os.environ:
        del os.environ["GITHUB_TOKEN"]
    idea = get_ai_idea("Art")

    assert idea is None
