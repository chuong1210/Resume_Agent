import { ChatRequest, TailorRequest, SSEMessage, LLMProvider } from '../types/ai.types';

const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000';

export function streamChat(
  request: ChatRequest,
  onMessage: (msg: SSEMessage) => void,
  onError: (err: Error) => void,
  onDone: () => void
): AbortController {
  const controller = new AbortController();

  fetch(`${AI_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`AI service error: ${response.status}`);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as SSEMessage;
              onMessage(data);
              if (data.type === 'done') {
                onDone();
                return;
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err);
    });

  return controller;
}

export function streamTailor(
  request: TailorRequest,
  onMessage: (msg: SSEMessage) => void,
  onError: (err: Error) => void,
  onDone: () => void
): AbortController {
  const controller = new AbortController();

  fetch(`${AI_URL}/ai/tailor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`AI service error: ${response.status}`);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as SSEMessage;
              onMessage(data);
              if (data.type === 'done') {
                onDone();
                return;
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err);
    });

  return controller;
}

export async function parseCV(filePath: string, provider?: LLMProvider): Promise<{ cv_document: string }> {
  const res = await fetch(`${AI_URL}/ai/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_path: filePath, provider }),
  });
  if (!res.ok) throw new Error('Failed to parse CV');
  return res.json();
}
