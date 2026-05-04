from fastapi import APIRouter
from pydantic import BaseModel
import json

from agents.cv_parser_agent import extract_text, PARSE_PROMPT
from config.llm_config import get_llm, LLMProvider
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter(prefix="/ai", tags=["AI Parse"])


class ParseRequest(BaseModel):
    file_path: str
    provider: LLMProvider | None = None


@router.post("/parse")
async def parse_cv(request: ParseRequest):
    text = extract_text(request.file_path)
    llm = get_llm(provider=request.provider, streaming=False)

    response = llm.invoke([
        SystemMessage(content="You are a professional CV parser. Return clean JSON only, no markdown."),
        HumanMessage(content=PARSE_PROMPT.format(cv_text=text)),
    ])

    content = response.content if hasattr(response, 'content') else str(response)
    return {"cv_document": json.loads(content)}
