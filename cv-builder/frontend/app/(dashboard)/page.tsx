'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCVs, CVListItemDto } from '@/lib/api/cv';
import { Plus, FileText, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [cvs, setCVs] = useState<CVListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVs()
      .then(setCVs)
      .catch(() => setCVs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My CVs</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and edit your CVs with AI assistance</p>
        </div>
        <Link
          href="/cv/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <Plus size={16} />
          New CV
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : cvs.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-muted-foreground">No CVs yet</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Create your first CV or upload an existing one
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/cv/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Create New CV
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvs.map((cv) => (
            <Link
              key={cv.id}
              href={`/cv/${cv.id}`}
              className="block p-4 bg-white rounded-xl border hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText size={20} className="text-primary" />
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                  {cv.templateId}
                </span>
              </div>
              <h3 className="font-semibold text-sm truncate">{cv.title || 'Untitled CV'}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <Clock size={12} />
                {new Date(cv.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
