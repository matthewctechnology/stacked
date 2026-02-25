"""
Tests ideate CLI entrypoint for ideate tool.
"""
import os
import time
from unittest.mock import patch

from typer.testing import CliRunner

from ideate.cli.ideate import app
from ideate.fallback.fallback_responses import responses
from ideate.option.topics import topics


runner = CliRunner()

def setup_module(module) -> None:
    """Set IDEATE_TEST_MODE=1 for all tests except delay test."""
    module.ORIGINAL_TEST_MODE = os.environ.get("IDEATE_TEST_MODE")
    os.environ["IDEATE_TEST_MODE"] = "1"

def teardown_module(module) -> None:
    """Restore IDEATE_TEST_MODE."""
    if module.ORIGINAL_TEST_MODE is not None:
        os.environ["IDEATE_TEST_MODE"] = module.ORIGINAL_TEST_MODE
    else:
        os.environ.pop("IDEATE_TEST_MODE", None)

def test_ideate_cli_ai_primary_with_topic() -> None:
    """
    Tests ideate CLI prints AI idea when AI provider is mocked.
    """
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=("A sketchbook that encourages practice.", None, 200),
    ):
        result = runner.invoke(app, ["ideate", "--topic", "Art"])

        assert result.exit_code == 0
        assert "Art Idea: A sketchbook that encourages practice." in result.output

def test_ideate_cli_ai_primary_no_topic() -> None:
    """
    Tests ideate CLI prints AI idea when AI provider is mocked and no topic.
    """
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=("A sketchbook that encourages practice.", None, 200),
    ):
        result = runner.invoke(app, ["ideate"])

        assert result.exit_code == 0
        assert result.output.strip() == "A sketchbook that encourages practice."

def test_ideate_cli_fallback_secondary_with_topic() -> None:
    """
    Tests ideate CLI prints fallback idea when AI provider returns error.
    """
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=(None, "server misconfigured", 500),
    ):
        topic = topics[3]
        result = runner.invoke(app, ["ideate", "--topic", topic])

        assert result.exit_code == 0
        assert result.output.startswith(f"{topic} Idea:")
        assert any(resp in result.output for resp in responses)

def test_ideate_cli_fallback_secondary_no_topic() -> None:
    """
    Tests ideate CLI prints fallback idea when AI provider returns error and no topic.
    """
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=(None, "server misconfigured", 500),
    ):
        result = runner.invoke(app, ["ideate"])

        assert result.exit_code == 0
        assert result.output.strip() in responses

def test_ideate_cli_fallback_option_no_topic() -> None:
    """
    Tests ideate CLI prints fallback idea when --fallback is used without topic.
    """
    result = runner.invoke(app, ["ideate", "--fallback"])

    assert result.exit_code == 0
    assert result.output.strip() in responses

def test_ideate_cli_fallback_option_with_topic() -> None:
    """
    Tests ideate CLI prints fallback idea with topic when --fallback is used.
    """
    topic = topics[1]
    result = runner.invoke(app, ["ideate", "--fallback", "--topic", topic])

    assert result.exit_code == 0
    assert result.output.startswith(f"{topic} Idea:")
    assert any(resp in result.output for resp in responses)

def test_ideate_cli_fallback_short_flag() -> None:
    """
    Tests ideate CLI prints fallback idea when -f is used.
    """
    result = runner.invoke(app, ["ideate", "-f"])

    assert result.exit_code == 0
    assert result.output.strip() in responses

def test_ideate_cli_fallback_short_flag_with_topic() -> None:
    """
    Tests ideate CLI prints fallback idea with topic when -f -t is used.
    """
    topic = topics[2]
    result = runner.invoke(app, ["ideate", "-f", "-t", topic])

    assert result.exit_code == 0
    assert result.output.startswith(f"{topic} Idea:")
    assert any(resp in result.output for resp in responses)

def test_ideate_cli_help() -> None:
    """
    Tests ideate CLI help command.
    """
    result = runner.invoke(app, ["--help"])

    assert result.exit_code == 0

def test_ideate_cli_fail() -> None:
    """
    Tests ideate CLI failure when no command is given.
    """
    result = runner.invoke(app)

    assert result.exit_code == 2

def test_topics_command() -> None:
    """
    Tests ideate CLI topics command prints all topics.
    """
    result = runner.invoke(app, ["topics"])

    assert result.exit_code == 0
    for t in topics:
        assert t in result.output

def test_ideate_cli_invalid_topic_suggests() -> None:
    """
    Tests ideate CLI with invalid topic prints suggestions.
    """
    result = runner.invoke(app, ["ideate", "--topic", "A"])

    assert result.exit_code == 1
    assert "Did you mean: Adventure, Art?" in result.output

def test_ideate_cli_invalid_topic_no_suggestions() -> None:
    """
    Tests ideate CLI with invalid topic prints no suggestions.
    """
    result = runner.invoke(app, ["ideate", "--topic", " "])

    assert result.exit_code == 1
    assert "Invalid topic selected." in result.output

def test_ideate_cli_with_lowercase_topic() -> None:
    """
    Tests ideate CLI with lowercase topic selection.
    """
    topic = topics[3]
    lowercase_topic = topic.lower()
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=("A sketchbook that encourages practice.", None, 200),
    ):
        result = runner.invoke(app, ["ideate", "--topic", lowercase_topic])

        assert result.exit_code == 0
        assert f"{topic} Idea: A sketchbook that encourages practice." in result.output

def test_ideate_cli_with_topic_delay() -> None:
    """
    Tests ideate CLI with topic selection and simulated delay.
    """
    os.environ["IDEATE_TEST_MODE"] = "0"

    topic = topics[3]
    start = time.time()
    with patch(
        "ideate.cli.ideate.get_ai_idea",
        return_value=(None, "server misconfigured", 500),
    ):
        result = runner.invoke(app, ["ideate", "--topic", topic])
    elapsed = time.time() - start

    assert result.exit_code == 0
    assert result.output.strip().endswith(tuple(responses))
    assert f"{topic} Idea:" in result.output
    assert elapsed >= 2.5

    os.environ["IDEATE_TEST_MODE"] = "1"
