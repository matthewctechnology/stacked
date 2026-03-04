"""
Streamlit web app for ideate tool.
"""
from typing import List

import requests
import streamlit as st

TOPICS: List[str] = [
    'Adventure', 'Art', 'Business', 'Communication',
    'Community', 'Crafts', 'Culture', 'Design', 'Education', 'Entertainment',
    'Environment', 'Fashion', 'Finance', 'Fitness', 'Food', 'Gardening', 'Health',
    'History', 'Home', 'Innovation', 'Learning', 'Mindfulness', 'Music', 'Nature',
    'Parenting', 'Pets', 'Photography', 'Productivity', 'Science', 'Social', 'Sports',
    'Sustainability', 'Technology', 'Travel', 'Wellness', 'Writing',
]

API_URL = "http://localhost:8000/ideate"

def get_idea(topic: str = "", fallback: bool = False) -> str:
    """
    Requests idea from FastAPI endpoint.
    """
    params = {}
    if topic:
        params["topic"] = topic
    if fallback:
        params["fallback"] = "true"
    try:
        resp = requests.get(API_URL, params=params, timeout=10)
        resp.raise_for_status()

        return resp.text

    except requests.HTTPError:

        return "<div class='idea'>Error: (A)I have no idea.</div>"

def validate_topic(topic: str = "") -> bool:
    """
    Validates topic against allowed topics.
    """

    return topic in TOPICS

st.set_page_config(
    page_title="ideate - Creative Idea Generator",
    layout="centered",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
    .main { display: flex; flex-direction: column; align-items: center; gap: 32px; }
    .idea { background: #fff; color: #111; font-family: 'Fira Mono', monospace; font-weight: 500;
            padding: 8px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 1.1rem;
            max-width: 600px; text-align: center; box-shadow: 0 2px 8px #0002; }
    .footer { background: #222; color: #fff9; font-size: 10px; font-family: 'Fira Mono', monospace;
              font-weight: 300; padding: 2px 0; margin-top: 24px; text-align: center; }
    </style>
    """,
    unsafe_allow_html=True,
)

with st.form("idea_form"):
    form_topic = st.selectbox("Topic", [""] + TOPICS, index=0)
    form_fallback = st.checkbox("Force fallback idea")
    submitted = st.form_submit_button("Get Idea")

if submitted:
    if form_topic and not validate_topic(form_topic):
        st.error("Invalid topic selected. Please choose from the list.")
    else:
        with st.spinner("thinking..."):
            html = get_idea(form_topic, form_fallback)
        st.markdown(html, unsafe_allow_html=True)

st.markdown(
    "<div class='footer'>unvalidated responses inferred at individual risk</div>",
    unsafe_allow_html=True,
)
