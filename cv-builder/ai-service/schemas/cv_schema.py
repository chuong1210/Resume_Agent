from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class DisplayStyle(str, Enum):
    TAGS = "tags"
    LIST = "list"
    GROUPED = "grouped"
    PROGRESS = "progress"


class CVLayout(str, Enum):
    SINGLE = "single-column"
    TWO = "two-column"
    SIDEBAR = "sidebar"


class FontSize(BaseModel):
    base: int = 14
    heading: int = 18
    subheading: int = 15


class CVColors(BaseModel):
    primary: str = "#1a56db"
    secondary: str = "#374151"
    accent: str = "#e5edff"
    text: str = "#111827"
    background: str = "#ffffff"


class CVSpacing(BaseModel):
    sectionGap: int = 24
    itemGap: int = 12
    pagePadding: int = 40


class CVStyle(BaseModel):
    fontFamily: str = "Inter"
    fontSize: FontSize = Field(default_factory=FontSize)
    colors: CVColors = Field(default_factory=CVColors)
    spacing: CVSpacing = Field(default_factory=CVSpacing)
    layout: CVLayout = CVLayout.SINGLE


class CVMeta(BaseModel):
    title: str = ""
    templateId: str = "modern"
    language: Literal["vi", "en", "ja"] = "en"
    lastModified: str = ""


class HeaderData(BaseModel):
    fullName: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    avatar: Optional[str] = None
    summary: str = ""


class CVHeaderSection(BaseModel):
    type: Literal["header"] = "header"
    id: str
    visible: bool = True
    data: HeaderData = Field(default_factory=HeaderData)


class ExperienceItem(BaseModel):
    id: str
    company: str = ""
    position: str = ""
    startDate: str = ""
    endDate: str = "present"
    location: Optional[str] = None
    bullets: list[str] = Field(default_factory=list)
    technologies: Optional[list[str]] = None


class CVExperienceSection(BaseModel):
    type: Literal["experience"] = "experience"
    id: str
    visible: bool = True
    title: str = "Work Experience"
    items: list[ExperienceItem] = Field(default_factory=list)


class EducationItem(BaseModel):
    id: str
    institution: str = ""
    degree: str = ""
    major: str = ""
    startDate: str = ""
    endDate: str = ""
    gpa: Optional[str] = None
    achievements: Optional[list[str]] = None


class CVEducationSection(BaseModel):
    type: Literal["education"] = "education"
    id: str
    visible: bool = True
    title: str = "Education"
    items: list[EducationItem] = Field(default_factory=list)


class SkillGroup(BaseModel):
    label: str
    items: list[str] = Field(default_factory=list)


class CVSkillsSection(BaseModel):
    type: Literal["skills"] = "skills"
    id: str
    visible: bool = True
    title: str = "Skills"
    displayStyle: DisplayStyle = DisplayStyle.TAGS
    groups: list[SkillGroup] = Field(default_factory=list)


class ProjectItem(BaseModel):
    id: str
    name: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    url: Optional[str] = None
    github: Optional[str] = None
    highlights: list[str] = Field(default_factory=list)


class CVProjectsSection(BaseModel):
    type: Literal["projects"] = "projects"
    id: str
    visible: bool = True
    title: str = "Projects"
    items: list[ProjectItem] = Field(default_factory=list)


class CertificationItem(BaseModel):
    id: str
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: Optional[str] = None


class CVCertificationsSection(BaseModel):
    type: Literal["certifications"] = "certifications"
    id: str
    visible: bool = True
    title: str = "Certifications"
    items: list[CertificationItem] = Field(default_factory=list)


class CVCustomSection(BaseModel):
    type: Literal["custom"] = "custom"
    id: str
    visible: bool = True
    title: str = ""
    content: str = ""


CVSection = (
    CVHeaderSection
    | CVExperienceSection
    | CVEducationSection
    | CVSkillsSection
    | CVProjectsSection
    | CVCertificationsSection
    | CVCustomSection
)


class CVDocument(BaseModel):
    id: str
    meta: CVMeta = Field(default_factory=CVMeta)
    style: CVStyle = Field(default_factory=CVStyle)
    sections: list[CVSection] = Field(default_factory=list)
