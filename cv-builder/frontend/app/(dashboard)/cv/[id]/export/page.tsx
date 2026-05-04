'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { exportCVPDF, fetchCV } from '@/lib/api/cv';
import { useCVStore } from '@/lib/store/cvStore';
import { CVPreview } from '@/components/cv/CVPreview';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExportPage() {
  const { id } = useParams<{ id: string }>();
  const { cv, setCV } = useCVStore();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchCV(id)
      .then((data) => {
        setCV(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, setCV]);

  const handleExport = async () => {
    if (!id) return;
    setExporting(true);
    try {
      const blob = await exportCVPDF(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv?.meta.title || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link href={`/cv/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={14} /> Back to editor
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Export CV</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {exporting ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="flex justify-center">
        <CVPreview />
      </div>
    </div>
  );
}
