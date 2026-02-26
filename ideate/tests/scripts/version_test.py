"""
Test ideate version script for correct tag naming.
"""
import os
import subprocess


def test_version_script_tag_format() -> None:
    """
    Test that the version script would create the correct tag format.
    """
    result = subprocess.run(
        ["python3", "-c", "from __version__ import __version__; print(__version__)"],
        capture_output=True, text=True, check=False
    )

    capability = os.getcwd().split("/").pop()
    version = result.stdout.strip()
    tag = f"{capability}-v{version}"

    assert tag.startswith("ideate-v")
    assert tag.count('.') == 2
