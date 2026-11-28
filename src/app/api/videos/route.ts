import { NextRequest, NextResponse } from 'next/server';
import { redisSet } from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface VideoChunkPayload {
  videoId: string;
  chunkIndex: number;
  totalChunks: number;
  chunkSize: number;
  totalBytes: number;
  contentType: string;
  data: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VideoChunkPayload;
    const { videoId, chunkIndex, totalChunks, chunkSize, totalBytes, contentType, data } = body;

    if (!videoId || typeof chunkIndex !== 'number' || !totalChunks || !data) {
      return NextResponse.json(
        { success: false, error: 'Data chunk video tidak lengkap' },
        { status: 400 }
      );
    }

    if (totalBytes > 16 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran video maksimal 15 MB' },
        { status: 400 }
      );
    }

    const safeId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
    const chunkKey = `king_autolamp_video_${safeId}_chunk_${chunkIndex}`;
    const okChunk = await redisSet(chunkKey, data);

    if (!okChunk) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan chunk video ke storage (pastikan Upstash Redis aktif)' },
        { status: 500 }
      );
    }

    if (chunkIndex === totalChunks - 1) {
      const metaKey = `king_autolamp_video_${safeId}_meta`;
      const okMeta = await redisSet(
        metaKey,
        JSON.stringify({
          contentType: contentType || 'video/mp4',
          totalChunks,
          chunkSize,
          totalBytes,
          createdAt: new Date().toISOString(),
        })
      );
      if (!okMeta) {
        return NextResponse.json(
          { success: false, error: 'Gagal menyimpan metadata video' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      chunkIndex,
      videoUrl: `/api/videos/${safeId}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat mengupload video' },
      { status: 500 }
    );
  }
}
