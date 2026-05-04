// AI response schemas — patches streamed via SSE from ai-service

export type CVPatch =
  | StylePatch
  | SectionVisibilityPatch
  | FieldUpdatePatch
  | AddItemPatch
  | RemoveItemPatch
  | ReorderSectionsPatch
  | BulletUpdatePatch;

export interface StylePatch {
  op: 'update_style';
  path: string;
  value: string | number;
}

export interface SectionVisibilityPatch {
  op: 'toggle_section';
  sectionId: string;
  visible: boolean;
}

export interface FieldUpdatePatch {
  op: 'update_field';
  sectionId: string;
  itemId?: string;
  field: string;
  value: string;
}

export interface AddItemPatch {
  op: 'add_item';
  sectionId: string;
  item: Record<string, unknown>;
}

export interface RemoveItemPatch {
  op: 'remove_item';
  sectionId: string;
  itemId: string;
}

export interface ReorderSectionsPatch {
  op: 'reorder_sections';
  order: string[];
}

export interface BulletUpdatePatch {
  op: 'update_bullets';
  sectionId: string;
  itemId: string;
  bullets: string[];
}

export interface SSEMessage {
  type: 'explanation' | 'patch' | 'score' | 'done';
  content: string | CVPatch | number;
}

export type LLMProvider = 'claude' | 'openai' | 'gemini' | 'grok' | 'deepseek' | 'ollama';

export interface ChatRequest {
  message: string;
  cv_json: string;
  session_id: string;
  provider?: LLMProvider;
}

export interface ParseRequest {
  file_path: string;
  provider?: LLMProvider;
}

export interface TailorRequest {
  cv_json: string;
  jd_text: string;
  session_id: string;
  provider?: LLMProvider;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
