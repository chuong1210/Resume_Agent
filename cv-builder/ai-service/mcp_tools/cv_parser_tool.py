from langchain_core.tools import tool
from agents.cv_parser_agent import extract_text


@tool
def parse_cv_file(file_path: str) -> str:
    """Extract text content from a CV file (PDF or DOCX)."""
    return extract_text(file_path)
