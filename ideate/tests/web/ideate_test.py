"""
Unit tests for ideate Streamlit web topic validation.
"""
from ideate.option.topics import topics
from ideate.web.ideate import validate_topic


def test_validate_topic_accepts_valid() -> None:
    """
    Accepts ideate web valid topics.
    """
    for t in topics:

        assert validate_topic(t)

def test_validate_topic_rejects_invalid() -> None:
    """
    Rejects ideate web invalid topics.
    """

    assert not validate_topic("NotARealTopic")
    assert not validate_topic("")
    assert not validate_topic("<script>")
