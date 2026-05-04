'use client';

import { useCVStore } from '@/lib/store/cvStore';
import { CVDocument, CVSection } from '@/lib/types/cv.types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

export function CVEditor() {
  const { cv, applyPatch } = useCVStore();
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  if (!cv) return null;

  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="flex border-b">
        <button
          className={cn('flex-1 py-2 text-sm font-medium', activeTab === 'content' && 'border-b-2 border-primary text-primary')}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={cn('flex-1 py-2 text-sm font-medium', activeTab === 'style' && 'border-b-2 border-primary text-primary')}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {activeTab === 'content' && <ContentEditor cv={cv} />}
        {activeTab === 'style' && <StyleEditor cv={cv} />}
      </div>
    </div>
  );
}

function getSectionTitle(section: CVSection): string {
  switch (section.type) {
    case 'header': return 'Header';
    default: return section.title || section.type;
  }
}

function ContentEditor({ cv }: { cv: CVDocument }) {
  const { applyPatch } = useCVStore();
  const sections = cv.sections;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sections</h3>
      {sections.map((section, idx) => (
        <div key={section.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {getSectionTitle(section)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyPatch({ op: 'toggle_section', sectionId: section.id, visible: !section.visible })}
                className="p-1 hover:bg-gray-200 rounded"
                title={section.visible ? 'Hide' : 'Show'}
              >
                {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              {idx > 0 && (
                <button
                  onClick={() => {
                    const newOrder = sections.map(s => s.id);
                    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                    applyPatch({ op: 'reorder_sections', order: newOrder });
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronUp size={14} />
                </button>
              )}
              {idx < sections.length - 1 && (
                <button
                  onClick={() => {
                    const newOrder = sections.map(s => s.id);
                    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                    applyPatch({ op: 'reorder_sections', order: newOrder });
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>
          {section.type === 'header' && <HeaderFields section={section} />}
          {section.type === 'experience' && <ExperienceFields section={section} />}
          {section.type === 'education' && <EducationFields section={section} />}
        </div>
      ))}
    </div>
  );
}

function HeaderFields({ section }: { section: CVSection & { type: 'header' } }) {
  const { applyPatch } = useCVStore();
  const fields = [
    { key: 'data.fullName', label: 'Full Name' },
    { key: 'data.title', label: 'Title' },
    { key: 'data.email', label: 'Email' },
    { key: 'data.phone', label: 'Phone' },
    { key: 'data.location', label: 'Location' },
    { key: 'data.summary', label: 'Summary' },
  ];

  return (
    <div className="space-y-1.5">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs text-muted-foreground">{label}</label>
          <input
            type="text"
            className="w-full text-sm border rounded px-2 py-1"
            value={String(getNestedValue(section, key) || '')}
            onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, field: key, value: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function ExperienceFields({ section }: { section: CVSection & { type: 'experience' } }) {
  const { applyPatch } = useCVStore();
  return (
    <div className="space-y-2">
      {section.items.map((item) => (
        <div key={item.id} className="border-l-2 border-primary pl-2 space-y-1">
          <input
            className="w-full text-sm border rounded px-2 py-1"
            placeholder="Position"
            value={item.position}
            onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'position', value: e.target.value })}
          />
          <input
            className="w-full text-sm border rounded px-2 py-1"
            placeholder="Company"
            value={item.company}
            onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'company', value: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 text-sm border rounded px-2 py-1"
              placeholder="Start (YYYY-MM)"
              value={item.startDate}
              onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'startDate', value: e.target.value })}
            />
            <input
              className="flex-1 text-sm border rounded px-2 py-1"
              placeholder="End"
              value={item.endDate}
              onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'endDate', value: e.target.value })}
            />
          </div>
          <button
            onClick={() => applyPatch({ op: 'remove_item', sectionId: section.id, itemId: item.id })}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => applyPatch({
          op: 'add_item',
          sectionId: section.id,
          item: { company: '', position: '', startDate: '', endDate: 'present', bullets: [] },
        })}
        className="text-xs text-primary hover:underline"
      >
        + Add Experience
      </button>
    </div>
  );
}

function EducationFields({ section }: { section: CVSection & { type: 'education' } }) {
  const { applyPatch } = useCVStore();
  return (
    <div className="space-y-2">
      {section.items.map((item) => (
        <div key={item.id} className="border-l-2 border-primary pl-2 space-y-1">
          <input
            className="w-full text-sm border rounded px-2 py-1"
            placeholder="Institution"
            value={item.institution}
            onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'institution', value: e.target.value })}
          />
          <input
            className="w-full text-sm border rounded px-2 py-1"
            placeholder="Degree"
            value={item.degree}
            onChange={(e) => applyPatch({ op: 'update_field', sectionId: section.id, itemId: item.id, field: 'degree', value: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function StyleEditor({ cv }: { cv: CVDocument }) {
  const { applyPatch } = useCVStore();
  const style = cv.style;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Typography</h3>

      <div>
        <label className="text-xs text-muted-foreground">Font Family</label>
        <select
          className="w-full text-sm border rounded px-2 py-1"
          value={style.fontFamily}
          onChange={(e) => applyPatch({ op: 'update_style', path: 'style.fontFamily', value: e.target.value })}
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground">Base Size</label>
          <input
            type="number"
            className="w-full text-sm border rounded px-2 py-1"
            value={style.fontSize.base}
            onChange={(e) => applyPatch({ op: 'update_style', path: 'style.fontSize.base', value: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Heading Size</label>
          <input
            type="number"
            className="w-full text-sm border rounded px-2 py-1"
            value={style.fontSize.heading}
            onChange={(e) => applyPatch({ op: 'update_style', path: 'style.fontSize.heading', value: Number(e.target.value) })}
          />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Colors</h3>
      {Object.entries(style.colors).map(([key, value]) => (
        <div key={key}>
          <label className="text-xs text-muted-foreground capitalize">{key}</label>
          <div className="flex gap-2">
            <input
              type="color"
              className="w-8 h-8 border rounded cursor-pointer"
              value={value}
              onChange={(e) => applyPatch({ op: 'update_style', path: `style.colors.${key}`, value: e.target.value })}
            />
            <input
              type="text"
              className="flex-1 text-sm border rounded px-2 py-1 font-mono"
              value={value}
              onChange={(e) => applyPatch({ op: 'update_style', path: `style.colors.${key}`, value: e.target.value })}
            />
          </div>
        </div>
      ))}

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Layout</h3>
      <div>
        <label className="text-xs text-muted-foreground">Layout</label>
        <select
          className="w-full text-sm border rounded px-2 py-1"
          value={style.layout}
          onChange={(e) => applyPatch({ op: 'update_style', path: 'style.layout', value: e.target.value })}
        >
          <option value="single-column">Single Column</option>
          <option value="two-column">Two Column</option>
          <option value="sidebar">Sidebar</option>
        </select>
      </div>
    </div>
  );
}

function getNestedValue(obj: unknown, path: string): unknown {
  let current: unknown = obj;
  for (const key of path.split('.')) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}
