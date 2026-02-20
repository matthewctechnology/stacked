"""
Provides options for ideate tool.
"""
from typing import List

from ideate.option.topics import topics


def get_topics() -> List[str]:
    """
    Returns sorted list of predetermined topics.

    :return: List[str]
    """

    return sorted(topics)

def autocomplete_topics(incomplete: str) -> List[str]:
    """
    Autocompletes topics for the --topic option.
    """

    return [t for t in get_topics() if t.lower().startswith(incomplete.lower())]
