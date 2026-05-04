'use client';

import { useAIChat } from '@/lib/hooks/useAIChat';
import { useChatStore } from '@/lib/store/chatStore';
import { useCVStore } from '@/lib/store/cvStore';
import { LLMProvider } from '@/lib/types/ai.types';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Undo2, X } from 'lucide-react';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: 'claude', label: 'Claude' },
  { value: 'openai', label: 'GPT-4o' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'grok', label: 'Grok' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'ollama', label: 'Ollama' },
];

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const { cv, undo, patchCount } = useCVStore();
  const { messages, isStreaming } = useChatStore();
  const { sendMessage, cancel } = useAIChat();
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<LLMProvider>('claude');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isStreaming || !cv) return;
    sendMessage(input.trim(), provider);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-sm">AI Chat Editor</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={patchCount === 0}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Undo last change"
          >
            <Undo2 size={16} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {!cv && (
          <div className="text-center text-sm text-muted-foreground py-8">
            Create a CV first to use AI chat
          </div>
        )}
        {cv && messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            <p className="mb-2">Chat with AI to edit your CV</p>
            <p className="text-xs">Try: &quot;Change font to Roboto&quot;, &quot;Add a skills section&quot;, &quot;Make my summary more concise&quot;</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'text-sm rounded-lg p-3 max-w-[85%]',
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-gray-100 text-gray-900'
            )}
          >
            {msg.content}
          </div>
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t space-y-2">
        <select
          className="w-full text-xs border rounded px-2 py-1"
          value={provider}
          onChange={(e) => setProvider(e.target.value as LLMProvider)}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <textarea
            className="flex-1 text-sm border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
            placeholder="Ask AI to edit your CV..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!cv}
          />
          {isStreaming ? (
            <button onClick={cancel} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <X size={16} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() || !cv}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
