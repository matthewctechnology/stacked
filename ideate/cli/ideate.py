"""
CLI entrypoint for ideate tool.
"""
import typer
from ideate.fallback.fallback_provider import get_fallback_idea


app = typer.Typer(help="ideate Tool - Generates a creative idea.")

@app.command()
def ideate() -> None:
    """
    Generates a creative idea.
    """
    idea: str = get_fallback_idea()
    typer.echo(idea)

if __name__ == "__main__":
    app()
