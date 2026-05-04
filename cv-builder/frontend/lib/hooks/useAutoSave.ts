'use client';

import { useEffect, useRef } from 'react';
import { useCVStore } from '../store/cvStore';
import { updateCV } from '../api/cv';

export function useAutoSave() {
  const { cv, isDirty } = useCVStore();
  const savingRef = useRef(false);

  useEffect(() => {
    if (!cv || !isDirty) return;

    const timer = setTimeout(async () => {
      if (savingRef.current) return;
      savingRef.current = true;
      try {
        await updateCV(cv.id, cv);
        // After successful save, mark clean by re-setting the current cv
        useCVStore.setState({ isDirty: false });
      } catch {
        // Silent fail — will retry on next change
      } finally {
        savingRef.current = false;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [cv, isDirty]);
}
