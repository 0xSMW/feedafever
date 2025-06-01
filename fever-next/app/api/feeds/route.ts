import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const feeds = await prisma.feed.findMany({ include: { group: true } });
  return NextResponse.json(feeds);
}

export async function POST(req: Request) {
  const data = await req.json();
  const feed = await prisma.feed.create({ data });
  return NextResponse.json(feed);
}
