"""
Tests CLI entrypoint for ideate tool.
"""
import os
import time

from typer.testing import CliRunner

from ideate.cli.ideate import app
from ideate.fallback.fallback_responses import responses
from ideate.option.topics import topics


os.environ["IDEATE_TEST_MODE"] = "1"

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

def test_ideate_cli_with_topic() -> None:
    """
    Tests ideate CLI with topic selection.
    """
    topic = topics[1]
    result = runner.invoke(app, ["--topic", topic])

    assert result.exit_code == 0
    assert result.output.startswith(f"{topic} Idea:")

def test_ideate_cli_with_lowercase_topic() -> None:
    """
    Tests ideate CLI with lowercase topic selection.
    """
    topic = topics[1]
    lowercase_topic = topic.lower()
    result = runner.invoke(app, ["--topic", lowercase_topic])

    assert result.exit_code == 0
    assert result.output.startswith(f"{topic} Idea:")

def test_ideate_cli_no_topic() -> None:
    """
    Tests ideate CLI with no topic.
    """
    result = runner.invoke(app)

    assert result.exit_code == 0
    assert "Idea:" not in result.output

def test_ideate_cli_with_topic_delay() -> None:
    """
    Tests ideate CLI with topic selection and simulated delay.
    """
    os.environ["IDEATE_TEST_MODE"] = "0"
    topic = topics[1]
    start = time.time()
    result = runner.invoke(app, ["--topic", topic])
    elapsed = time.time() - start

    assert result.exit_code == 0
    assert result.output.strip().endswith(tuple(responses))
    assert f"{topic} Idea:" in result.output
    assert elapsed >= 2.5
