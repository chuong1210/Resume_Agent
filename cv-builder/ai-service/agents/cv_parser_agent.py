import pdfplumber
import docx
from pathlib import Path


PARSE_PROMPT = """You are a professional CV parser. Parse the extracted CV text below and return a complete CVDocument JSON object that follows the standard schema.

CV Text:
{cv_text}

Return a JSON object with this structure:
{{
  "id": "<generate a unique uuid>",
  "meta": {{
    "title": "<infer from name + role>",
    "templateId": "modern",
    "language": "<vi|en|ja>",
    "lastModified": "<ISO date>"
  }},
  "style": {{
    "fontFamily": "Inter",
    "fontSize": {{ "base": 14, "heading": 18, "subheading": 15 }},
    "colors": {{
      "primary": "#1a56db",
      "secondary": "#374151",
      "accent": "#e5edff",
      "text": "#111827",
      "background": "#ffffff"
    }},
    "spacing": {{ "sectionGap": 24, "itemGap": 12, "pagePadding": 40 }},
    "layout": "single-column"
  }},
  "sections": [
    {{ "type": "header", "id": "<uuid>", "visible": true, "data": {{ ... }} }},
    {{ "type": "experience", "id": "<uuid>", "visible": true, "title": "Work Experience", "items": [...] }},
    {{ "type": "education", "id": "<uuid>", "visible": true, "title": "Education", "items": [...] }},
    {{ "type": "skills", "id": "<uuid>", "visible": true, "title": "Skills", "displayStyle": "tags", "groups": [...] }},
    {{ "type": "projects", "id": "<uuid>", "visible": true, "title": "Projects", "items": [...] }},
    {{ "type": "certifications", "id": "<uuid>", "visible": true, "title": "Certifications", "items": [...] }}
  ]
}}

Rules:
- Use YYYY-MM format for dates wherever possible
- Leave empty string for missing information — do NOT fabricate
- Group skills by category if possible (Frontend, Backend, DevOps, etc.)
- Generate a unique id (uuid format) for each section and item
- Preserve the original language of the CV — do not translate
- For experience bullets, capture achievement-oriented statements
"""


def extract_text_from_pdf(file_path: str) -> str:
    with pdfplumber.open(file_path) as pdf:
        return "\n\n".join(
            page.extract_text() or "" for page in pdf.pages
        )


def extract_text_from_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    return "\n".join(para.text for para in doc.paragraphs)


def extract_text(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    raise ValueError(f"Unsupported file type: {ext}")
