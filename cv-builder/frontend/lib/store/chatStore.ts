import { create } from 'zustand';
import { ChatMessage } from '../types/ai.types';

interface ChatStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (msg: ChatMessage) => void;
  setMessages: (msgs: ChatMessage[]) => void;
  setIsStreaming: (v: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],
  isStreaming: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setMessages: (msgs) => set({ messages: msgs }),

  setIsStreaming: (v) => set({ isStreaming: v }),

  clear: () => set({ messages: [], isStreaming: false }),
}));
