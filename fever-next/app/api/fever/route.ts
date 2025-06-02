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
      body = {};
    }
  }
  const apiKey = (body.api_key as string) || params.get('api_key');
  const data: any = { api_version: 3, auth: 0 };
  const authed = await authenticate(apiKey);
  if (!authed) {
    return NextResponse.json(data);
  }
  data.auth = 1;

  // mark items read/unread
  if (req.method === 'POST' && body.mark === 'item' && body.as && body.id) {
    const itemId = parseInt(body.id, 10);
    if (!Number.isNaN(itemId) && (body.as === 'read' || body.as === 'unread')) {
      await prisma.item.update({
        where: { id: itemId },
        data: { read: body.as === 'read' },
      });
    }
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
      is_saved: 0,
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

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
