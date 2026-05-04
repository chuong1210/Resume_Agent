from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio

from agents.jd_tailor_agent import create_tailor_agent
from config.llm_config import LLMProvider

router = APIRouter(prefix="/ai", tags=["AI Tailor"])


class TailorRequest(BaseModel):
    cv_json: str
    jd_text: str
    session_id: str
    provider: LLMProvider | None = None


@router.post("/tailor")
async def tailor_cv(request: TailorRequest):
    async def generate():
        agent = create_tailor_agent(provider=request.provider)
        config = {"configurable": {"thread_id": request.session_id}}

        result = await agent.ainvoke(
            {
                "cv_json": request.cv_json,
                "jd_text": request.jd_text,
                "jd_analysis": {},
                "match_score": 0,
                "explanation": "",
                "improvements": [],
                "patches": [],
            },
            config=config,
        )

        yield f"data: {json.dumps({'type': 'score', 'content': result.get('match_score', 0)})}\n\n"
        yield f"data: {json.dumps({'type': 'explanation', 'content': result.get('explanation', '')})}\n\n"
        await asyncio.sleep(0.01)

        for patch in result.get("patches", []):
            yield f"data: {json.dumps({'type': 'patch', 'content': patch})}\n\n"
            await asyncio.sleep(0.05)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
