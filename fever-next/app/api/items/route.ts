import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const feedId = url.searchParams.get('feedId');
  const kindling = url.searchParams.get('kindling');

  const where: any = {};
  if (feedId) {
    where.feedId = Number(feedId);
  } else if (kindling === '1') {
    where.feed = { isSpark: false };
  } else {
    return NextResponse.json(
      { error: 'feedId or kindling=1 query param required' },
      { status: 400 }
    );
  }

  const items = await prisma.item.findMany({
    where,
    orderBy: { pubDate: 'desc' },
  });
  return NextResponse.json(items);
}
