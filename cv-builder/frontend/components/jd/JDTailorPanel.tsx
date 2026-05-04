'use client';

import { useJDTailor } from '@/lib/hooks/useAIChat';
import { useCVStore } from '@/lib/store/cvStore';
import { LLMProvider } from '@/lib/types/ai.types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Target, Loader2, X, CheckCircle } from 'lucide-react';

interface JDTailorPanelProps {
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

export function JDTailorPanel({ isOpen, onClose }: JDTailorPanelProps) {
  const { cv } = useCVStore();
  const { tailor, cancel, isStreaming, matchScore, explanation } = useJDTailor();
  const [jdText, setJdText] = useState('');
  const [provider, setProvider] = useState<LLMProvider>('claude');
  const [isDone, setIsDone] = useState(false);

  const handleTailor = () => {
    if (!jdText.trim() || !cv) return;
    setIsDone(false);
    tailor(jdText.trim(), provider);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Target size={16} className="text-primary" />
          JD Tailor
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!cv && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Create a CV first to tailor it to a job description
          </p>
        )}

        {cv && (
          <>
            <div>
              <label className="text-xs font-medium">Job Description</label>
              <textarea
                className="w-full text-sm border rounded-lg px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={8}
                placeholder="Paste the job description here..."
                value={jdText}
                onChange={(e) => { setJdText(e.target.value); setIsDone(false); }}
              />
            </div>

            <select
              className="w-full text-xs border rounded px-2 py-1"
              value={provider}
              onChange={(e) => setProvider(e.target.value as LLMProvider)}
            >
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            {isStreaming ? (
              <button
                onClick={cancel}
                className="w-full py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Loader2 size={14} className="animate-spin" /> Cancel
              </button>
            ) : (
              <button
                onClick={handleTailor}
                disabled={!jdText.trim()}
                className="w-full py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Target size={14} /> Tailor My CV
              </button>
            )}

            {matchScore > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-semibold text-sm text-green-800">
                    Match Score: {matchScore}%
                  </span>
                </div>
                {explanation && (
                  <p className="text-sm text-green-700">{explanation}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
