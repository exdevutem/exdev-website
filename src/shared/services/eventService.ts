import { API_URL } from '../constants/api';
import { PublicEvent } from '../types/event';

export async function getPublicEvents(preview: boolean, offset: number, signal: AbortSignal): Promise<{ data: PublicEvent[]; hasMore: boolean }> {
  const query = new URLSearchParams({ limit: preview ? '4' : '20', upcoming: String(preview), offset: String(offset) });
  const response = await fetch(`${API_URL ?? ''}/events?${query}`, { signal });
  if (!response.ok) throw new Error('No fue posible cargar los eventos');
  const payload = await response.json();
  if (!Array.isArray(payload.data) || typeof payload.hasMore !== 'boolean') throw new Error('Respuesta de eventos inválida');
  return payload;
}
