import { NextRequest, NextResponse } from 'next/server';
import { redisGet, redisDel } from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface VideoMeta {
  contentType: string;
  totalChunks: number;
  chunkSize: number;
  totalBytes: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const safeId = params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const metaRaw = await redisGet(`king_autolamp_video_${safeId}_meta`);
    if (!metaRaw) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const meta = JSON.parse(metaRaw) as VideoMeta;
    const { contentType, totalChunks, chunkSize, totalBytes } = meta;

    const rangeHeader = req.headers.get('range');
    let start = 0;
    let end = totalBytes - 1;
    let isRange = false;

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      isRange = true;
      const parts = rangeHeader.replace('bytes=', '').split('-');
      start = parts[0] ? parseInt(parts[0], 10) : 0;
      end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + chunkSize * 2 - 1, totalBytes - 1);
      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= totalBytes) end = totalBytes - 1;
      if (start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${totalBytes}` },
        });
      }
    }

    const firstChunk = Math.floor(start / chunkSize);
    const lastChunk = Math.min(Math.floor(end / chunkSize), totalChunks - 1);

    const chunkIndices: number[] = [];
    for (let i = firstChunk; i <= lastChunk; i++) {
      chunkIndices.push(i);
    }

    const chunkBase64List = await Promise.all(
      chunkIndices.map((idx) => redisGet(`king_autolamp_video_${safeId}_chunk_${idx}`))
    );

    if (chunkBase64List.some((c) => !c)) {
      return new NextResponse('Video chunk missing', { status: 404 });
    }

    const buffers = chunkBase64List.map((b64) => Buffer.from(b64 as string, 'base64'));
    const combined = Buffer.concat(buffers);

    const sliceStart = start - firstChunk * chunkSize;
    const sliceEnd = sliceStart + (end - start + 1);
    const sliced = combined.subarray(sliceStart, sliceEnd);

    const headers: Record<string, string> = {
      'Content-Type': contentType || 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': String(sliced.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (isRange) {
      headers['Content-Range'] = `bytes ${start}-${end}/${totalBytes}`;
      return new NextResponse(sliced, { status: 206, headers });
    }

    return new NextResponse(sliced, { status: 200, headers });
  } catch {
    return new NextResponse('Failed to stream video', { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const safeId = params.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const metaRaw = await redisGet(`king_autolamp_video_${safeId}_meta`);
    if (metaRaw) {
      const meta = JSON.parse(metaRaw) as VideoMeta;
      await Promise.all([
        redisDel(`king_autolamp_video_${safeId}_meta`),
        ...Array.from({ length: meta.totalChunks }, (_, i) =>
          redisDel(`king_autolamp_video_${safeId}_chunk_${i}`)
        ),
      ]);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
