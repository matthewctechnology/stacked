"""
Tests CLI entrypoint for ideate tool.
"""
from ideate.cli.ideate import ideate
from ideate.fallback.fallback_responses import responses


def test_ideate() -> None:
    """
    Tests ideate returns a valid fallback idea.
    """
    idea = ideate()

    assert idea in responses
