import type { AbandonedItem, AntiLibraryStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchItemsApi(): Promise<AbandonedItem[]> {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items from backend');
  return res.json();
}

export async function createItemApi(data: {
  title: string;
  category: string;
  droppedAt: string;
  abandonReason: string;
}): Promise<AbandonedItem> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

export async function updateItemApi(id: string, updates: Partial<AbandonedItem>): Promise<AbandonedItem> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

export async function reviveItemApi(id: string): Promise<AbandonedItem> {
  const res = await fetch(`${API_BASE}/items/${id}/revive`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to log revival sprint');
  return res.json();
}

export async function declareDeadApi(id: string, epitaph: string): Promise<AbandonedItem> {
  const res = await fetch(`${API_BASE}/items/${id}/declare-dead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ epitaph })
  });
  if (!res.ok) throw new Error('Failed to declare item dead');
  return res.json();
}

export async function deleteItemApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete item');
}

export async function deleteAllItemsApi(): Promise<void> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete all items');
}

export async function fetchRandomLimboItemApi(): Promise<AbandonedItem | null> {
  const res = await fetch(`${API_BASE}/reckoning/random`);
  if (!res.ok) throw new Error('Failed to draw random item');
  const data = await res.json();
  return data.item;
}

export async function fetchStatsApi(): Promise<AntiLibraryStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function resetSampleApi(): Promise<AbandonedItem[]> {
  const res = await fetch(`${API_BASE}/sample/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset sample data');
  const data = await res.json();
  return data.items;
}

export async function importBackupApi(items: AbandonedItem[]): Promise<void> {
  const res = await fetch(`${API_BASE}/backup/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  if (!res.ok) throw new Error('Failed to import backup');
}
