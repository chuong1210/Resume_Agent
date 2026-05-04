from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from config.llm_config import get_llm

ANALYZE_PROMPT = """Analyze this Job Description and extract:
1. required_skills
2. preferred_skills
3. responsibilities
4. seniority
5. keywords
6. job_title

JD: {jd_text}

Return clean JSON."""


@tool
def analyze_jd(jd_text: str) -> str:
    """Analyze a Job Description and return structured requirements as JSON."""
    llm = get_llm(streaming=False)
    response = llm.invoke([
        SystemMessage(content="You are a JD analyzer. Return clean JSON only."),
        HumanMessage(content=ANALYZE_PROMPT.format(jd_text=jd_text)),
    ])
    return response.content if hasattr(response, 'content') else str(response)
