import { CVDocument } from '../types/cv.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// .NET backend returns these shapes

export interface CVListItemDto {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
}

export interface CVDto {
  id: string;
  title: string;
  templateId: string;
  contentJson: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchCVs(): Promise<CVListItemDto[]> {
  const res = await fetch(`${API_URL}/api/cv`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch CVs');
  return res.json();
}

export async function fetchCV(id: string): Promise<CVDocument> {
  const res = await fetch(`${API_URL}/api/cv/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch CV');
  const dto: CVDto = await res.json();
  return JSON.parse(dto.contentJson) as CVDocument;
}

export async function createCV(data: { title: string; templateId: string }): Promise<CVDocument> {
  const res = await fetch(`${API_URL}/api/cv`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create CV');
  const dto: CVDto = await res.json();
  return JSON.parse(dto.contentJson) as CVDocument;
}

export async function updateCV(id: string, cv: CVDocument): Promise<void> {
  await fetch(`${API_URL}/api/cv/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ contentJson: JSON.stringify(cv) }),
  });
}

export async function uploadCV(file: File): Promise<{ cv_document: CVDocument }> {
  const formData = new FormData();
  formData.append('file', file);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_URL}/api/cv/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload CV');
  return res.json();
}

export async function exportCVPDF(id: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/cv/${id}/export`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to export CV');
  return res.blob();
}

export async function saveCVVersion(id: string, description: string): Promise<void> {
  await fetch(`${API_URL}/api/cv/${id}/versions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ changeDescription: description }),
  });
}
