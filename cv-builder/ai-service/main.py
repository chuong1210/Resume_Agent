from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import chat, parse, tailor

app = FastAPI(title="CV Builder AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(parse.router)
app.include_router(tailor.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}
