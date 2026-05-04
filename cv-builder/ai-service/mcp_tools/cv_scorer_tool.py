from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage
from config.llm_config import get_llm

SCORE_PROMPT = """Score this CV against the JD analysis on a scale of 0-100.

JD Analysis: {jd_analysis}
CV JSON: {cv_json}

Consider:
- Skills match (40%)
- Experience relevance (30%)
- Education (10%)
- Project/certification relevance (10%)
- Format/Structure (10%)

Return JSON: {{"score": 75, "breakdown": {{"skills": 30, "experience": 20, ... }}, "summary": "..."}}
"""


@tool
def score_cv_vs_jd(cv_json: str, jd_analysis: str) -> str:
    """Score a CV against a JD analysis and return a match score with breakdown."""
    llm = get_llm(streaming=False)
    response = llm.invoke([
        SystemMessage(content="You are a CV scoring expert. Return clean JSON only."),
        HumanMessage(content=SCORE_PROMPT.format(jd_analysis=jd_analysis, cv_json=cv_json)),
    ])
    return response.content if hasattr(response, 'content') else str(response)
