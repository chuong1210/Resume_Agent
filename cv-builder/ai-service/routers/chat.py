from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio

from agents.cv_chat_agent import create_chat_agent
from config.llm_config import LLMProvider

router = APIRouter(prefix="/ai", tags=["AI Chat"])


class ChatRequest(BaseModel):
    message: str
    cv_json: str
    session_id: str
    provider: LLMProvider | None = None


@router.post("/chat")
async def chat_with_cv(request: ChatRequest):
    async def generate():
        agent = create_chat_agent(provider=request.provider)
        config = {"configurable": {"thread_id": request.session_id}}

        result = await agent.ainvoke(
            {
                "messages": [request.message],
                "cv_json": request.cv_json,
                "patches": [],
                "explanation": "",
                "provider": str(request.provider or "default"),
            },
            config=config,
        )

        yield f"data: {json.dumps({'type': 'explanation', 'content': result['explanation']})}\n\n"
        await asyncio.sleep(0.01)

        for patch in result.get("patches", []):
            yield f"data: {json.dumps({'type': 'patch', 'content': patch})}\n\n"
            await asyncio.sleep(0.05)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
