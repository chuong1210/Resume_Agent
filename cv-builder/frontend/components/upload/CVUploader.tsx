'use client';

import { useState, useCallback } from 'react';
import { useCVStore } from '@/lib/store/cvStore';
import { uploadCV } from '@/lib/api/cv';
import { CVDocument } from '@/lib/types/cv.types';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface CVUploaderProps {
  onParsed: (cv: CVDocument) => void;
}

export function CVUploader({ onParsed }: CVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.doc')) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const result = await uploadCV(file);
      const cv = result.cv_document;
      onParsed(cv);
    } catch (err) {
      setError('Failed to parse CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Parsing your CV...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium">Drop your CV here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF and DOCX</p>
            </div>
            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
