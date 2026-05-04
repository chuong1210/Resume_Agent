from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
import operator

from config.llm_config import get_llm, LLMProvider

SYSTEM_PROMPT = """You are an AI assistant specializing in CV editing.
The user will chat in Vietnamese or English requesting changes to their CV.

Your tasks:
1. Understand the user's request
2. Generate a list of CVPatch instructions (JSON array) to implement the changes
3. Explain briefly what you will change

IMPORTANT rules:
- Do NOT fabricate information not present in the current CV
- Only change style/format/layout if the user specifically requests it
- If the user's request is vague, ask for clarification before proceeding
- Always respond in the same language the user is using

Current CV:
{cv_json}

Return JSON with format:
{{
  "explanation": "Brief explanation in words",
  "patches": [
    // Array of CVPatch objects
  ]
}}

Example patches:
- Change primary color: {{"op": "update_style", "path": "style.colors.primary", "value": "#1a56db"}}
- Hide section: {{"op": "toggle_section", "sectionId": "cert-001", "visible": false}}
- Update field: {{"op": "update_field", "sectionId": "header", "field": "data.title", "value": "Senior Backend Developer"}}
- Update bullets: {{"op": "update_bullets", "sectionId": "exp-001", "itemId": "item-001", "bullets": ["Led team of 5...", "Reduced latency by 40%..."]}}
- Add item: {{"op": "add_item", "sectionId": "exp-001", "item": {{"company": "New Corp", "position": "Engineer", "startDate": "2024-01", "endDate": "present", "bullets": ["Did X"]}}}}
- Remove item: {{"op": "remove_item", "sectionId": "exp-001", "itemId": "item-001"}}
- Reorder sections: {{"op": "reorder_sections", "order": ["header-id", "skills-id", "exp-id", "edu-id"]}}
"""


class ChatState(TypedDict):
    messages: Annotated[list, operator.add]
    cv_json: str
    patches: list
    explanation: str
    provider: str


def create_chat_agent(provider: LLMProvider | None = None):
    llm = get_llm(provider=provider, streaming=True)

    def process_message(state: ChatState) -> dict:
        user_message = state["messages"][-1].content if hasattr(state["messages"][-1], 'content') else str(state["messages"][-1])
        system = SystemMessage(content=SYSTEM_PROMPT.format(cv_json=state["cv_json"]))

        response = llm.invoke([system, HumanMessage(content=user_message)])
        content = response.content if hasattr(response, 'content') else str(response)

        try:
            parser = JsonOutputParser()
            result = parser.parse(content)
            return {
                "patches": result.get("patches", []),
                "explanation": result.get("explanation", ""),
            }
        except Exception:
            return {"patches": [], "explanation": content}

    graph = StateGraph(ChatState)
    graph.add_node("process", process_message)
    graph.set_entry_point("process")
    graph.add_edge("process", END)

    memory = MemorySaver()
    return graph.compile(checkpointer=memory)
