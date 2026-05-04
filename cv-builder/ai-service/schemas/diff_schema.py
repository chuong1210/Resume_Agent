from pydantic import BaseModel
from typing import Optional, Literal, Any


class StylePatch(BaseModel):
    op: Literal["update_style"] = "update_style"
    path: str
    value: str | int | float


class SectionVisibilityPatch(BaseModel):
    op: Literal["toggle_section"] = "toggle_section"
    sectionId: str
    visible: bool


class FieldUpdatePatch(BaseModel):
    op: Literal["update_field"] = "update_field"
    sectionId: str
    itemId: Optional[str] = None
    field: str
    value: str


class AddItemPatch(BaseModel):
    op: Literal["add_item"] = "add_item"
    sectionId: str
    item: dict[str, Any]


class RemoveItemPatch(BaseModel):
    op: Literal["remove_item"] = "remove_item"
    sectionId: str
    itemId: str


class ReorderSectionsPatch(BaseModel):
    op: Literal["reorder_sections"] = "reorder_sections"
    order: list[str]


class BulletUpdatePatch(BaseModel):
    op: Literal["update_bullets"] = "update_bullets"
    sectionId: str
    itemId: str
    bullets: list[str]


CVPatch = (
    StylePatch
    | SectionVisibilityPatch
    | FieldUpdatePatch
    | AddItemPatch
    | RemoveItemPatch
    | ReorderSectionsPatch
    | BulletUpdatePatch
)
