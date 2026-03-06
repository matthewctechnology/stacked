"""
Unit tests for ideate Streamlit web topic validation.
"""
from streamlit.testing.v1 import AppTest

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

def test_streamlit_ui_elements() -> None:
    """
    Tests Streamlit UI elements are present.
    """
    at = AppTest.from_file("~/stacked/ideate/web/ideate.py").run()

    assert at.selectbox[0].options == [""] + sorted(topics)
    assert at.checkbox[0].label == "Force fallback idea"
    assert at.button[0].label == "Get Idea"
