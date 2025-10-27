import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const metrics = await globalThis?.metrics?.registry.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error(error, 'Error generating prometheus metrics')
    return new NextResponse('Error generating metrics', {status: 500})
  }
}