"""
Tests FastAPI ideate web API root endpoint with AI provider and fallback.
"""
from unittest.mock import patch

from fastapi.testclient import TestClient

from ideate.api.ideate import app
from ideate.fallback.fallback_responses import responses


client = TestClient(app)

def test_ideate_api_returns_disclaimer() -> None:
    """
    Tests GET /ideate returns 200 and includes disclaimer in the HTML.
    """
    with patch(
        "ideate.api.ideate.get_ai_idea",
        return_value=("A sketchbook that encourages practice", None, 200),
    ):
        response = client.get("/ideate")

        assert response.status_code == 200
        assert "unvalidated responses inferred at individual risk" in response.text
        assert "<html" in response.text

def test_ideate_api_returns_ai_idea() -> None:
    """
    Tests GET /ideate returns 200 and includes AI idea in the HTML.
    """
    with patch(
        "ideate.api.ideate.get_ai_idea",
        return_value=("A sketchbook that encourages practice", None, 200),
    ):
        response = client.get("/ideate")

        assert response.status_code == 200
        assert "A sketchbook that encourages practice" in response.text
        assert "<html" in response.text

def test_ideate_api_returns_ai_idea_with_topic() -> None:
    """
    Tests GET /ideate returns 200 and includes topical AI idea in the HTML.
    """
    with patch(
        "ideate.api.ideate.get_ai_idea",
        return_value=("Art Idea: A sketchbook that encourages practice", None, 200),
    ):
        response = client.get("/ideate?topic=art")

        assert response.status_code == 200
        assert "Art Idea: A sketchbook that encourages practice" in response.text
        assert "<html" in response.text

def test_ideate_api_returns_fallback_on_ai_error() -> None:
    """
    Tests GET /ideate returns fallback idea if AI provider fails.
    """
    with patch(
        "ideate.api.ideate.get_ai_idea",
        return_value=(None, "server misconfigured", 500),
    ):
        response = client.get("/ideate")

        assert response.status_code == 200
        assert any(idea in response.text for idea in responses)
        assert "<html" in response.text

def test_ideate_api_returns_fallback_on_ai_error_with_topic() -> None:
    """
    Tests GET /ideate returns topical fallback idea if AI provider fails.
    """
    with patch(
        "ideate.api.ideate.get_ai_idea",
        return_value=(None, "server misconfigured", 500),
    ):
        response = client.get("/ideate?topic=art")

        assert response.status_code == 200
        assert any(idea in response.text for idea in responses)
        assert "<html" in response.text

def test_ideate_api_fallback_query_param() -> None:
    """
    Tests GET /ideate?fallback=true returns fallback idea.
    """
    response = client.get("/ideate?fallback=true")

    assert response.status_code == 200
    assert any(idea in response.text for idea in responses)
    assert "<html" in response.text

def test_ideate_api_fallback_query_param_with_topic() -> None:
    """
    Tests GET /ideate?fallback=true returns topical fallback idea.
    """
    response = client.get("/ideate?fallback=true&topic=art")

    assert response.status_code == 200
    assert any(idea in response.text for idea in responses)
    assert "<html" in response.text
