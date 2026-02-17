"""
CLI entrypoint for ideate tool.
"""
import sys
import os
from ideate.fallback.fallback_provider import get_fallback_idea


# Allows running as a script: adds parent directory to sys.path
if __name__ == "__main__" and __package__ is None:
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def ideate() -> str:
    """
    Prints and returns creative idea from fallback provider.

    :return: A selected idea.
    """
    idea = get_fallback_idea()
    print(idea)

    return idea

if __name__ == "__main__":
    ideate()
