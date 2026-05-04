import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CVDocument } from '../types/cv.types';
import { CVPatch } from '../types/ai.types';
import { set } from 'lodash';

interface CVStore {
  cv: CVDocument | null;
  history: CVDocument[];
  isDirty: boolean;
  isAIProcessing: boolean;
  patchCount: number;

  setCV: (cv: CVDocument) => void;
  applyPatch: (patch: CVPatch) => void;
  applyPatches: (patches: CVPatch[]) => void;
  undo: () => void;
  setAIProcessing: (v: boolean) => void;
  reset: () => void;
}

export const useCVStore = create<CVStore>()(
  immer((setState, getState) => ({
    cv: null,
    history: [],
    isDirty: false,
    isAIProcessing: false,
    patchCount: 0,

    setCV: (cv) =>
      setState((state) => {
        state.cv = cv;
        state.history = [];
        state.isDirty = false;
        state.patchCount = 0;
      }),

    applyPatch: (patch) =>
      setState((state) => {
        if (!state.cv) return;

        state.history.push(JSON.parse(JSON.stringify(state.cv)));
        if (state.history.length > 50) state.history.shift();

        switch (patch.op) {
          case 'update_style':
            set(state.cv, patch.path, patch.value);
            break;

          case 'toggle_section': {
            const section = state.cv.sections.find((s) => s.id === patch.sectionId);
            if (section) section.visible = patch.visible;
            break;
          }

          case 'update_field': {
            const section = state.cv.sections.find((s) => s.id === patch.sectionId);
            if (!section) break;
            if (patch.itemId) {
              const items = (section as Record<string, unknown>).items as Array<Record<string, unknown>>;
              const item = items?.find((i) => i.id === patch.itemId);
              if (item) set(item, patch.field, patch.value);
            } else {
              set(section, patch.field, patch.value);
            }
            break;
          }

          case 'update_bullets': {
            const section = state.cv.sections.find((s) => s.id === patch.sectionId);
            const items = (section as Record<string, unknown>)?.items as Array<Record<string, unknown>>;
            const item = items?.find((i) => i.id === patch.itemId);
            if (item) item.bullets = patch.bullets;
            break;
          }

          case 'add_item': {
            const section = state.cv.sections.find((s) => s.id === patch.sectionId);
            if (section && 'items' in section) {
              const arr = (section as Record<string, unknown>).items as Array<Record<string, unknown>>;
              arr.push({ id: crypto.randomUUID(), ...patch.item });
            }
            break;
          }

          case 'remove_item': {
            const section = state.cv.sections.find((s) => s.id === patch.sectionId);
            if (section && 'items' in section) {
              const sec = section as Record<string, unknown>;
              sec.items = (sec.items as Array<Record<string, unknown>>).filter(
                (i) => i.id !== patch.itemId
              );
            }
            break;
          }

          case 'reorder_sections': {
            const ordered = patch.order
              .map((id: string) => state.cv!.sections.find((s) => s.id === id))
              .filter(Boolean);
            state.cv.sections = ordered as typeof state.cv.sections;
            break;
          }
        }

        state.isDirty = true;
        state.patchCount += 1;
      }),

    applyPatches: (patches) => {
      patches.forEach((patch) => getState().applyPatch(patch));
    },

    undo: () =>
      setState((state) => {
        const prev = state.history.pop();
        if (prev) {
          state.cv = prev;
        }
      }),

    setAIProcessing: (v) =>
      setState((state) => {
        state.isAIProcessing = v;
      }),

    reset: () =>
      setState((state) => {
        state.cv = null;
        state.history = [];
        state.isDirty = false;
        state.isAIProcessing = false;
        state.patchCount = 0;
      }),
  }))
);
