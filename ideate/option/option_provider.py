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
