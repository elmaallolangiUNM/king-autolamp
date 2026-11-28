import { NextRequest, NextResponse } from 'next/server';
import { addOrUpdateProject, deleteStoredProject } from '@/lib/projectService';
import { ProjectItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as ProjectItem;
    if (!body.title?.trim()) return NextResponse.json({ success: false, error: 'Judul proyek wajib diisi' }, { status: 400 });
    const updated: ProjectItem = {
      ...body,
      id: params.id,
      title: body.title.trim(),
      category: body.category?.trim() || 'Lainnya',
      desc: body.desc?.trim() || '',
      image: body.image?.trim() || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=900&q=85',
      video_url: body.video_url?.trim() || '',
      is_featured: !!body.is_featured,
      created_at: body.created_at || new Date().toISOString(),
    };
    const result = await addOrUpdateProject(updated);
    if (!result.success) return NextResponse.json({ success: false, error: 'Gagal memperbarui proyek' }, { status: 500 });
    return NextResponse.json({ success: true, project: updated, projects: result.projects });
  } catch {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteStoredProject(params.id);
    if (!result.success) return NextResponse.json({ success: false, error: 'Gagal menghapus proyek' }, { status: 500 });
    return NextResponse.json({ success: true, projects: result.projects });
  } catch {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
