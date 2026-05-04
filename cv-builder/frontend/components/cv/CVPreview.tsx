'use client';

import { useCVStore } from '@/lib/store/cvStore';
import { SectionRenderer } from './sections/SectionRenderer';

export function CVPreview() {
  const { cv, isAIProcessing } = useCVStore();

  if (!cv) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select or create a CV to preview
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100 p-6">
      {isAIProcessing && (
        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          AI processing...
        </div>
      )}
      <div
        className="cv-page mx-auto"
        style={{
          padding: `${cv.style.spacing.pagePadding}px`,
          fontFamily: cv.style.fontFamily,
          fontSize: `${cv.style.fontSize.base}px`,
          color: cv.style.colors.text,
          backgroundColor: cv.style.colors.background,
        }}
      >
        {cv.sections
          .filter((s) => s.visible)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} style={cv.style} />
          ))}
      </div>
    </div>
  );
}
