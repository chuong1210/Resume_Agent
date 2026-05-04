from enum import Enum
from functools import lru_cache

from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_models import ChatOllama
from langchain_core.language_models import BaseChatModel
from pydantic_settings import BaseSettings


class LLMProvider(str, Enum):
    CLAUDE = "claude"
    OPENAI = "openai"
    GEMINI = "gemini"
    GROK = "grok"
    DEEPSEEK = "deepseek"
    OLLAMA = "ollama"


class Settings(BaseSettings):
    DEFAULT_LLM_PROVIDER: LLMProvider = LLMProvider.CLAUDE

    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    GROK_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""

    CLAUDE_MODEL: str = "claude-opus-4-6"
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_MODEL: str = "gemini-1.5-pro"
    GROK_MODEL: str = "grok-beta"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    OLLAMA_MODEL: str = "llama3.1:8b"

    OLLAMA_BASE_URL: str = "http://localhost:11434"

    TEMPERATURE: float = 0.3
    MAX_TOKENS: int = 4096
    STREAMING: bool = True

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def get_llm(
    provider: LLMProvider | None = None,
    temperature: float | None = None,
    streaming: bool = True,
) -> BaseChatModel:
    settings = get_settings()
    p = provider or settings.DEFAULT_LLM_PROVIDER
    temp = temperature if temperature is not None else settings.TEMPERATURE

    match p:
        case LLMProvider.CLAUDE:
            return ChatAnthropic(
                model=settings.CLAUDE_MODEL,
                api_key=settings.ANTHROPIC_API_KEY,
                temperature=temp,
                max_tokens=settings.MAX_TOKENS,
                streaming=streaming,
            )

        case LLMProvider.OPENAI:
            return ChatOpenAI(
                model=settings.OPENAI_MODEL,
                api_key=settings.OPENAI_API_KEY,
                temperature=temp,
                max_tokens=settings.MAX_TOKENS,
                streaming=streaming,
            )

        case LLMProvider.GEMINI:
            return ChatGoogleGenerativeAI(
                model=settings.GEMINI_MODEL,
                google_api_key=settings.GOOGLE_API_KEY,
                temperature=temp,
                max_output_tokens=settings.MAX_TOKENS,
                streaming=streaming,
            )

        case LLMProvider.GROK:
            return ChatOpenAI(
                model=settings.GROK_MODEL,
                api_key=settings.GROK_API_KEY,
                base_url="https://api.x.ai/v1",
                temperature=temp,
                max_tokens=settings.MAX_TOKENS,
                streaming=streaming,
            )

        case LLMProvider.DEEPSEEK:
            return ChatOpenAI(
                model=settings.DEEPSEEK_MODEL,
                api_key=settings.DEEPSEEK_API_KEY,
                base_url="https://api.deepseek.com/v1",
                temperature=temp,
                max_tokens=settings.MAX_TOKENS,
                streaming=streaming,
            )

        case LLMProvider.OLLAMA:
            return ChatOllama(
                model=settings.OLLAMA_MODEL,
                base_url=settings.OLLAMA_BASE_URL,
                temperature=temp,
            )

        case _:
            raise ValueError(f"Unknown provider: {p}")
