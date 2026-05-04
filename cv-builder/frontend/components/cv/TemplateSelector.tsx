'use client';

import { cn } from '@/lib/utils';
import { Layout, FileText, Columns, Sidebar } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const templates: Template[] = [
  { id: 'modern', name: 'Modern', description: 'Clean modern layout with blue accents', icon: <Layout size={24} /> },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column format', icon: <FileText size={24} /> },
  { id: 'minimal', name: 'Minimal', description: 'Minimalist with strong typography', icon: <Layout size={24} /> },
  { id: 'sidebar', name: 'Sidebar', description: 'Two-column with colored sidebar', icon: <Sidebar size={24} /> },
];

interface TemplateSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
            selected === template.id
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          )}
        >
          <div className={cn(
            'w-16 h-16 rounded-lg flex items-center justify-center',
            selected === template.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
          )}>
            {template.icon}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm">{template.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
