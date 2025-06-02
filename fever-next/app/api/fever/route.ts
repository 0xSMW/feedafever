import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

async function authenticate(apiKey: string | null) {
  if (!apiKey) return false;
  const user = await prisma.user.findFirst();
  if (!user) return false;
  const expected = md5(`${user.email}:${user.password}`);
  return expected === apiKey.toLowerCase();
}

async function handle(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  let body: any = {};
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch {
      return new NextResponse('Invalid JSON', { status: 400 });
    }
  }
  const apiKey = (body.api_key as string) || params.get('api_key');
  const data: any = { api_version: 3, auth: 0 };
  const authed = await authenticate(apiKey);
  if (!authed) {
    return NextResponse.json(data, { status: 401 });
  }
  data.auth = 1;

  // mark items read/unread/saved
  if (req.method === 'POST' && body.mark === 'item' && body.as && body.id) {
    const itemId = parseInt(body.id, 10);
    if (
      Number.isNaN(itemId) ||
      !['read', 'unread', 'saved', 'unsaved'].includes(body.as)
    ) {
      return new NextResponse('Invalid item mark', { status: 400 });
    }
    await prisma.item.update({
      where: { id: itemId },
      data: {
        read: body.as === 'read' ? true : body.as === 'unread' ? false : undefined,
        saved: body.as === 'saved' ? true : body.as === 'unsaved' ? false : undefined,
      },
    });
  }

  // mark feed read/unread
  if (req.method === 'POST' && body.mark === 'feed' && body.as && body.id) {
    const feedId = parseInt(body.id, 10);
    const before = parseInt(body.before ?? '0', 10);
    if (Number.isNaN(feedId) || !['read', 'unread'].includes(body.as)) {
      return new NextResponse('Invalid feed mark', { status: 400 });
    }
    await prisma.item.updateMany({
      where: {
        feedId,
        ...(before ? { createdAt: { lt: new Date(before * 1000) } } : {}),
      },
      data: { read: body.as === 'read' },
    });
  }

  // mark group read/unread
  if (req.method === 'POST' && body.mark === 'group' && body.as && body.id) {
    const groupId = parseInt(body.id, 10);
    const before = parseInt(body.before ?? '0', 10);
    if (Number.isNaN(groupId) || !['read', 'unread'].includes(body.as)) {
      return new NextResponse('Invalid group mark', { status: 400 });
    }
    const feeds = await prisma.feed.findMany({
      where: groupId === 0 ? {} : { groupId },
      select: { id: true },
    });
    const feedIds = feeds.map(f => f.id);
    await prisma.item.updateMany({
      where: {
        ...(feedIds.length > 0 ? { feedId: { in: feedIds } } : {}),
        ...(before ? { createdAt: { lt: new Date(before * 1000) } } : {}),
      },
      data: { read: body.as === 'read' },
    });
  }

  if (req.method === 'POST' && !['item', 'feed', 'group'].includes(body.mark ?? '')) {
    return new NextResponse('Unknown mark type', { status: 400 });
  }

  if (params.has('groups')) {
    const groups = await prisma.group.findMany();
    data.groups = groups.map(g => ({ id: g.id, title: g.name }));
  }

  if (params.has('feeds')) {
    const feeds = await prisma.feed.findMany();
    data.feeds = feeds.map(f => ({
      id: f.id,
      favicon_id: 1,
      title: f.title || '',
      url: f.url,
      site_url: f.siteUrl,
      group_id: f.groupId,
    }));
  }

  if (params.has('items')) {
    const where: any = {};
    if (params.get('feed_ids')) {
      where.feedId = {
        in: params
          .get('feed_ids')!
          .split(',')
          .map(id => parseInt(id, 10)),
      };
    }
    if (params.get('since_id')) {
      where.id = { gt: parseInt(params.get('since_id')!, 10) };
    }
    if (params.get('search')) {
      const q = params.get('search')!.toLowerCase();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }
    const items = await prisma.item.findMany({
      where,
      orderBy: { id: 'asc' },
      take: 50,
    });
    data.items = items.map(it => ({
      id: it.id,
      feed_id: it.feedId,
      title: it.title,
      html: it.content,
      url: it.link,
      is_saved: it.saved ? 1 : 0,
      is_read: it.read ? 1 : 0,
      created_on_time: Math.floor(it.pubDate.getTime() / 1000),
    }));
  }

  if (params.has('unread_item_ids')) {
    const unread = await prisma.item.findMany({
      where: { read: false },
      select: { id: true },
    });
    data.unread_item_ids = unread.map(u => u.id).join(',');
  }

  if (params.has('saved_item_ids')) {
    const saved = await prisma.item.findMany({
      where: { saved: true },
      select: { id: true },
    });
    data.saved_item_ids = saved.map(s => s.id).join(',');
  }

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
