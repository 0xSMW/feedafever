import type { NextRequest } from 'next/server';
import { fetchFeeds } from '@/scripts/fetchFeeds';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await fetchFeeds();
    return Response.json({ success: true });
  } catch (err) {
    console.error('Cron job failed:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
