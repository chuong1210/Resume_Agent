from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict

from config.llm_config import get_llm, LLMProvider

ANALYZE_JD_PROMPT = """Analyze the following Job Description and extract:

1. Required skills (must-have)
2. Preferred skills (nice-to-have)
3. Key responsibilities
4. Seniority level
5. Important industry keywords

JD:
{jd_text}

Return JSON:
{{
  "required_skills": [],
  "preferred_skills": [],
  "responsibilities": [],
  "seniority": "junior|mid|senior",
  "keywords": [],
  "job_title": ""
}}
"""

TAILOR_PROMPT = """Based on the JD analysis and current CV, generate patches to optimize the CV.

IMPORTANT:
- Do NOT fabricate skills or experience not present in the CV
- Only reorder, reframe, and emphasize what already exists
- Adjust bullets to highlight relevant achievements
- Reorder sections if needed (e.g. move skills higher if JD is technically focused)

JD Analysis:
{jd_analysis}

Current CV:
{cv_json}

Return JSON:
{{
  "match_score": 75,
  "explanation": "Your CV matches {score}% of this JD. Strengths: ...",
  "improvements": ["Improvement point 1", "..."],
  "patches": [
    // CVPatch array
  ]
}}
"""


class TailorState(TypedDict):
    jd_text: str
    cv_json: str
    jd_analysis: dict
    match_score: int
    explanation: str
    improvements: list
    patches: list


def create_tailor_agent(provider: LLMProvider | None = None):
    llm = get_llm(provider=provider, streaming=True)

    def analyze_jd(state: TailorState) -> dict:
        prompt = ANALYZE_JD_PROMPT.format(jd_text=state["jd_text"])
        response = llm.invoke([
            SystemMessage(content="You are a JD analysis expert. Return clean JSON only."),
            HumanMessage(content=prompt),
        ])
        content = response.content if hasattr(response, 'content') else str(response)
        try:
            parser = JsonOutputParser()
            return {"jd_analysis": parser.parse(content)}
        except Exception:
            return {"jd_analysis": {}}

    def tailor_cv(state: TailorState) -> dict:
        prompt = TAILOR_PROMPT.format(
            jd_analysis=state.get("jd_analysis", {}),
            cv_json=state["cv_json"],
        )
        response = llm.invoke([
            SystemMessage(content="You are a CV optimization expert. Return clean JSON only."),
            HumanMessage(content=prompt),
        ])
        content = response.content if hasattr(response, 'content') else str(response)
        try:
            parser = JsonOutputParser()
            result = parser.parse(content)
            return {
                "match_score": result.get("match_score", 0),
                "explanation": result.get("explanation", ""),
                "improvements": result.get("improvements", []),
                "patches": result.get("patches", []),
            }
        except Exception:
            return {"match_score": 0, "explanation": content, "improvements": [], "patches": []}

    graph = StateGraph(TailorState)
    graph.add_node("analyze_jd", analyze_jd)
    graph.add_node("tailor_cv", tailor_cv)
    graph.set_entry_point("analyze_jd")
    graph.add_edge("analyze_jd", "tailor_cv")
    graph.add_edge("tailor_cv", END)

    memory = MemorySaver()
    return graph.compile(checkpointer=memory)
