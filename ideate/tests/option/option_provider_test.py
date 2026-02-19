"""
Tests for topic provider.
"""
from ideate.option.option_provider import get_topics


def test_get_topics() -> None:
    """
    Tests get_topics returns a non-empty list of strings.
    """
    topics = get_topics()

    assert isinstance(topics, list)
    assert all(isinstance(t, str) for t in topics)
    assert len(topics) == 36
