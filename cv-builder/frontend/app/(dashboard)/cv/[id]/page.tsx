'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/lib/store/cvStore';
import { fetchCV, updateCV, exportCVPDF } from '@/lib/api/cv';
import { CVPreview } from '@/components/cv/CVPreview';
import { CVEditor } from '@/components/cv/CVEditor';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { JDTailorPanel } from '@/components/jd/JDTailorPanel';
import { ArrowLeft, Download, MessageSquare, Target, Undo2 } from 'lucide-react';
import Link from 'next/link';

export default function CVEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { cv, setCV, isDirty, patchCount, undo } = useCVStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTailor, setShowTailor] = useState(false);

  // Fetch CV data
  useEffect(() => {
    if (!id) return;
    fetchCV(id)
      .then((data) => {
        setCV(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/dashboard');
      });
  }, [id, setCV, router]);

  // Auto-save with debounce
  useEffect(() => {
    if (!cv || !isDirty) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await updateCV(cv.id, cv);
      } catch {
        // Silent fail for auto-save
      } finally {
        setSaving(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [cv, isDirty]);

  const handleExport = async () => {
    if (!cv) return;
    try {
      const blob = await exportCVPDF(cv.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.meta.title || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-muted-foreground text-sm">Loading CV...</div>
      </div>
    );
  }

  if (!cv) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Toolbar */}
      <div className="h-12 border-b bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-sm font-medium truncate max-w-[200px]">{cv.meta.title || 'Untitled'}</span>
          {isDirty && !saving && <span className="text-xs text-yellow-600">Unsaved</span>}
          {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
          {!isDirty && !saving && patchCount > 0 && (
            <span className="text-xs text-green-600">Saved</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={patchCount === 0}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showChat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-muted-foreground'
            }`}
          >
            <MessageSquare size={14} />
            AI Chat
          </button>
          <button
            onClick={() => setShowTailor(!showTailor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showTailor ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-muted-foreground'
            }`}
          >
            <Target size={14} />
            JD Tailor
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100"
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r overflow-hidden">
          <CVEditor />
        </div>
        <div className="flex-1 overflow-hidden">
          <CVPreview />
        </div>
      </div>

      {/* AI Panels */}
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
      <JDTailorPanel isOpen={showTailor} onClose={() => setShowTailor(false)} />
    </div>
  );
}
