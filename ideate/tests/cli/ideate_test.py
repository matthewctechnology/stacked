"""
Tests CLI entrypoint for ideate tool.
"""
from typer.testing import CliRunner
from ideate.cli.ideate import app
from ideate.fallback.fallback_responses import responses

runner = CliRunner()

def test_ideate_cli() -> None:
    """
    Tests ideate CLI prints a valid fallback idea.
    """
    result = runner.invoke(app)

    assert result.exit_code == 0
    assert result.output.strip() in responses

def test_ideate_cli_help() -> None:
    """
    Tests ideate CLI help.
    """
    result = runner.invoke(app, ["--help"])

    assert result.exit_code == 0

def test_ideate_cli_fail() -> None:
    """
    Tests ideate CLI failure.
    """
    result = runner.invoke(app, ["ideate"])

    assert result.exit_code == 2
