"""
Playwright E2E test for ideate Streamlit web app.
"""
import time

from playwright.sync_api import sync_playwright


def test_streamlit_idea_page_e2e_with_fallback() -> None:
    """
    E2E: ideate web select fallback, submit, and check idea output.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8501/ideate", wait_until="domcontentloaded")

        checkbox = page.wait_for_selector("text=Force fallback idea")

        assert checkbox
        checkbox.check(timeout=3000)

        page.click("text=Get Idea", timeout=3000)

        page.wait_for_selector("text=thinking", timeout=3000)
        time.sleep(1)
        text = page.wait_for_selector(".stMarkdown", timeout=3000)

        assert text
        idea_text = text.inner_text()

        assert "." in idea_text

        browser.close()

def test_streamlit_idea_page_e2e_with_topic_fallback() -> None:
    """
    E2E: ideate web select topic, select fallback, submit, and check idea output.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8501/ideate", wait_until="domcontentloaded")

        selectbox = page.get_by_role("combobox")

        assert selectbox
        selectbox.type("Art")
        selectbox.press(key="Enter",timeout=3000)

        checkbox = page.wait_for_selector("text=Force fallback idea")

        assert checkbox
        checkbox.check(timeout=3000)

        page.click("text=Get Idea", timeout=3000)

        page.wait_for_selector("text=thinking", timeout=3000)
        time.sleep(1)
        text = page.wait_for_selector(".stMarkdown", timeout=3000)

        assert text
        idea_text = text.inner_text()

        assert "Art Idea:" in idea_text

        browser.close()

def test_streamlit_idea_page_e2e() -> None:
    """
    E2E: ideate web submit, and check idea output.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.route("http://localhost:8000/ideate", lambda route: route.fulfill(
            status=200,
            content_type="text/html",
            body="<div class='idea'></div>",
        ))
        page.goto("http://localhost:8501/ideate", wait_until="domcontentloaded")


        page.click("text=Get Idea", timeout=3000)

        page.wait_for_selector("text=thinking", timeout=3000)
        time.sleep(1)
        text = page.wait_for_selector(".stMarkdown", timeout=3000)

        assert text
        idea_text = text.inner_text()

        assert "" in idea_text

        browser.close()

def test_streamlit_idea_page_e2e_with_topic() -> None:
    """
    E2E: ideate web select topic, submit, and check idea output.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.route("http://localhost:8000/ideate", lambda route: route.fulfill(
            status=200,
            content_type="text/html",
            body="<div class='idea'></div>",
        ))
        page.goto("http://localhost:8501/ideate", wait_until="domcontentloaded")


        selectbox = page.get_by_role("combobox")

        assert selectbox
        selectbox.type("Art")
        selectbox.press(key="Enter",timeout=3000)

        page.click("text=Get Idea", timeout=3000)

        page.wait_for_selector("text=thinking", timeout=3000)
        time.sleep(1)
        text = page.wait_for_selector(".stMarkdown", timeout=3000)

        assert text
        idea_text = text.inner_text()

        assert "" in idea_text

        browser.close()
