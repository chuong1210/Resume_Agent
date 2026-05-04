'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { createCV } from '@/lib/api/cv';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCVPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a CV title');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const cv = await createCV({ title: title.trim(), templateId: selectedTemplate });
      router.push(`/cv/${cv.id}`);
    } catch {
      setError('Failed to create CV. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-2">Create New CV</h1>
      <p className="text-sm text-muted-foreground mb-6">Choose a template to get started</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="text-sm font-medium">CV Title</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
          placeholder="e.g. Software Engineer CV 2024"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />

      <div className="mt-8 text-right">
        <button
          onClick={handleCreate}
          disabled={loading || !title.trim()}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create CV'}
        </button>
      </div>
    </div>
  );
}
