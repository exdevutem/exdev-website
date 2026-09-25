import { API_URL } from '../constants/api';
import { PublicMember, PublicProject } from '../types/content';

interface ApiCollection<T> { data: T[]; }

async function getCollection<T>(path: string, signal?: AbortSignal): Promise<T[]> {
  const response = await fetch(`${API_URL ?? ''}${path}`, { signal });
  if (!response.ok) throw new Error(`No fue posible cargar el contenido (${response.status})`);
  const payload = (await response.json()) as ApiCollection<T>;
  return payload.data;
}

export const getPublicMembers = (limit = 4, signal?: AbortSignal) =>
  getCollection<PublicMember>(`/members?limit=${limit}`, signal);

export const getPublicProjects = (limit = 100, signal?: AbortSignal) =>
  getCollection<PublicProject>(`/projects?limit=${limit}`, signal);
