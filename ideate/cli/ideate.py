"""
CLI entrypoint for ideate tool with simulated thinking delay.
"""
import os
import random
import time
from typing import Optional

import typer

from ideate.ai.ai_provider import get_ai_idea
from ideate.fallback.fallback_provider import get_fallback_idea
from ideate.option.option_provider import autocomplete_topics, get_topics, normalize_topic


app = typer.Typer(help="ideate Tool - Generates a creative idea.")

@app.command()
def ideate(
    topic: Optional[str] = typer.Option(
        None,
        "--topic",
        "-t",
        help="Selects ideation topic.",
        autocompletion=autocomplete_topics,
    ),
    fallback: bool = typer.Option(
        False,
        "--fallback",
        "-f",
        help="Forces fallback idea.",
    ),
) -> None:
    """
    Generates a creative idea, by topic optionally, with a simulated thinking delay.
    """
    canonical_topic = normalize_topic(topic) if topic else None

    if topic and not canonical_topic:
        suggestions = autocomplete_topics(topic)
        if suggestions:
            typer.echo(f"Invalid topic. Did you mean: {', '.join(suggestions)}?")
        else:
            typer.echo("Invalid topic selected.")

        raise typer.Exit(1)

    _thinking_delay()

    if fallback:
        idea = get_fallback_idea()
    else:
        idea, error, status = get_ai_idea(canonical_topic)
        _ = error
        if status != 200 or not idea:
            idea = get_fallback_idea()
    if canonical_topic:
        typer.echo(f"{canonical_topic} Idea: {idea}")
    else:
        typer.echo(idea)

@app.command("topics")
def echo_topics() -> None:
    """
    Echos all available ideation topics.
    """
    for t in get_topics():
        typer.echo(f"{t}")

def _should_skip_delay() -> bool:
    """
    Returns True if IDEATE_TEST_MODE=1 is set in the environment.

    :return: bool
    """

    return os.environ.get("IDEATE_TEST_MODE") == "1"

def _thinking_delay() -> None:
    """
    Simulates a thinking delay unless in test mode.
    """
    if not _should_skip_delay():
        typer.echo("thinking...", nl=False)
        time.sleep(random.uniform(2.5, 5.5))
        typer.echo("\r" + " " * 20 + "\r", nl=False)

if __name__ == "__main__":
    app()
