"""
Tests CLI entrypoint for ideate tool.
"""
from ideate.cli.ideate import ideate


def test_ideate() -> None:
    """Tests ideate."""

    assert "an idea" == ideate()
