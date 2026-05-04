'use client';

import { useCVStore } from '../store/cvStore';
import { useChatStore } from '../store/chatStore';
import { useCallback, useRef, useState } from 'react';
import { streamChat, streamTailor } from '../api/ai';
import { SSEMessage, LLMProvider, CVPatch } from '../types/ai.types';

export function useAIChat() {
  const { cv, applyPatch, setAIProcessing } = useCVStore();
  const { messages, addMessage, isStreaming, setIsStreaming } = useChatStore();
  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: string, provider?: LLMProvider) => {
      if (!cv) return;

      setIsStreaming(true);
      setAIProcessing(true);
      addMessage({ role: 'user', content: message });

      controllerRef.current = streamChat(
        {
          message,
          cv_json: JSON.stringify(cv),
          session_id: cv.id,
          provider,
        },
        (msg: SSEMessage) => {
          if (msg.type === 'explanation') {
            addMessage({ role: 'assistant', content: msg.content as string });
          }
          if (msg.type === 'patch') {
            applyPatch(msg.content as CVPatch);
          }
        },
        (err) => {
          addMessage({ role: 'assistant', content: `Error: ${err.message}` });
          setIsStreaming(false);
          setAIProcessing(false);
        },
        () => {
          setIsStreaming(false);
          setAIProcessing(false);
        }
      );
    },
    [cv, applyPatch, setAIProcessing, addMessage, setIsStreaming]
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setIsStreaming(false);
    setAIProcessing(false);
  }, [setIsStreaming, setAIProcessing]);

  return { messages, sendMessage, cancel, isStreaming };
}

export function useJDTailor() {
  const { cv, applyPatch, setAIProcessing } = useCVStore();
  const [isStreaming, setIsStreaming] = useState(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const tailor = useCallback(
    async (jdText: string, provider?: LLMProvider) => {
      if (!cv) return;

      setIsStreaming(true);
      setAIProcessing(true);
      setMatchScore(0);
      setExplanation('');

      controllerRef.current = streamTailor(
        {
          cv_json: JSON.stringify(cv),
          jd_text: jdText,
          session_id: cv.id,
          provider,
        },
        (msg: SSEMessage) => {
          if (msg.type === 'score') {
            setMatchScore(msg.content as number);
          }
          if (msg.type === 'explanation') {
            setExplanation(msg.content as string);
          }
          if (msg.type === 'patch') {
            applyPatch(msg.content as CVPatch);
          }
        },
        (err) => {
          setExplanation(`Error: ${err.message}`);
          setIsStreaming(false);
          setAIProcessing(false);
        },
        () => {
          setIsStreaming(false);
          setAIProcessing(false);
        }
      );
    },
    [cv, applyPatch, setAIProcessing]
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setIsStreaming(false);
    setAIProcessing(false);
  }, [setIsStreaming, setAIProcessing]);

  return { tailor, cancel, isStreaming, matchScore, explanation };
}
