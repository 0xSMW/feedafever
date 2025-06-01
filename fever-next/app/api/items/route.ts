import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const feedId = url.searchParams.get('feedId');
  if (!feedId) {
    return NextResponse.json(
      { error: 'feedId query param required' },
      { status: 400 }
    );
  }
  const items = await prisma.item.findMany({
    where: { feedId: Number(feedId) },
    orderBy: { pubDate: 'desc' },
  });
  return NextResponse.json(items);
}
