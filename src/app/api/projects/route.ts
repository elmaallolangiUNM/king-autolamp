import { NextRequest, NextResponse } from 'next/server';
import { getStoredProjects, saveAllProjects, addOrUpdateProject } from '@/lib/projectService';
import { ProjectItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await getStoredProjects();
    return NextResponse.json({ success: true, projects });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data proyek' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const ok = await saveAllProjects(body as ProjectItem[]);
      if (!ok) return NextResponse.json({ success: false, error: 'Gagal menyimpan proyek' }, { status: 500 });
      return NextResponse.json({ success: true, projects: body });
    }

    const project = body as ProjectItem;
    if (!project.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Judul proyek wajib diisi' }, { status: 400 });
    }

    const clean: ProjectItem = {
      id: project.id || `proj_${Date.now()}`,
      title: project.title.trim(),
      category: project.category?.trim() || 'Lainnya',
      desc: project.desc?.trim() || '',
      image: project.image?.trim() || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=900&q=85',
      video_url: project.video_url?.trim() || '',
      is_featured: !!project.is_featured,
      created_at: project.created_at || new Date().toISOString(),
    };

    const result = await addOrUpdateProject(clean);
    if (!result.success) return NextResponse.json({ success: false, error: 'Gagal menyimpan proyek' }, { status: 500 });
    return NextResponse.json({ success: true, project: clean, projects: result.projects });
  } catch {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
