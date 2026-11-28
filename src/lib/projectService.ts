// ============================================================
// KING AUTOLAMP — Project Service
// Storage: Upstash Redis (REST API) with default fallback
// ============================================================

import { ProjectItem } from '@/types';
import { redisGet, redisSet } from '@/lib/redis';

const REDIS_KEY = 'king_autolamp_projects';

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj1',
    title: 'Toyota Avanza — BILED Projector H4 90W',
    category: 'BILED Projector',
    desc: 'Pemasangan BILED Projector H4 Ultra Vision 90W dengan hasil cahaya 6000K super terang.',
    image: 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=900&q=85',
    video_url: '',
    is_featured: true,
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'proj2',
    title: 'Honda Vario — Mini Projector 2.5" Hi-Lo',
    category: 'Mini Projector',
    desc: 'Upgrade Mini Projector 2.5 inch Hi-Lo Beam pada motor sport, tampil lebih elegan dan terang.',
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=900&q=85',
    video_url: '',
    is_featured: false,
    created_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'proj3',
    title: 'Mitsubishi Pajero — Fog Lamp LED H3 DRL',
    category: 'Fog Lamp',
    desc: 'Instalasi Fog Lamp LED H3 DRL Angel Eye pada SUV, optimal untuk perjalanan malam dan kabut.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=85',
    video_url: '',
    is_featured: false,
    created_at: '2024-03-12T00:00:00Z',
  },
  {
    id: 'proj4',
    title: 'Toyota Innova — LED Headlight H11 Canbus',
    category: 'Automotive Accessories',
    desc: 'Penggantian headlight H11 60W Canbus Ready, bebas error code pada sistem canbus kendaraan.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85',
    video_url: '',
    is_featured: false,
    created_at: '2024-04-08T00:00:00Z',
  },
  {
    id: 'proj5',
    title: 'Suzuki GSX — Mini Projector 3.0" Full LED',
    category: 'Mini Projector',
    desc: 'Custom projector 3.0 inch full LED pada motor sport dengan hasil cahaya fokus dan tajam.',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=900&q=85',
    video_url: '',
    is_featured: false,
    created_at: '2024-05-01T00:00:00Z',
  },
  {
    id: 'proj6',
    title: 'Daihatsu Xenia — BILED Retrofit Complete',
    category: 'BILED Projector',
    desc: 'Retrofit lengkap dengan BILED Projector, shroud custom, dan angel eye DRL.',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=85',
    video_url: '',
    is_featured: false,
    created_at: '2024-06-15T00:00:00Z',
  },
];

export async function getStoredProjects(): Promise<ProjectItem[]> {
  const raw = await redisGet(REDIS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ProjectItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // JSON corrupt, fallback
    }
  }
  return DEFAULT_PROJECTS;
}

export async function saveAllProjects(projects: ProjectItem[]): Promise<boolean> {
  return redisSet(REDIS_KEY, JSON.stringify(projects));
}

export async function addOrUpdateProject(
  project: ProjectItem
): Promise<{ success: boolean; projects: ProjectItem[] }> {
  const projects = await getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  const updatedList =
    index >= 0
      ? projects.map((p) => (p.id === project.id ? project : p))
      : [project, ...projects];
  const ok = await saveAllProjects(updatedList);
  return { success: ok, projects: updatedList };
}

export async function deleteStoredProject(
  id: string
): Promise<{ success: boolean; projects: ProjectItem[] }> {
  const projects = await getStoredProjects();
  const updatedList = projects.filter((p) => p.id !== id);
  const ok = await saveAllProjects(updatedList);
  return { success: ok, projects: updatedList };
}
