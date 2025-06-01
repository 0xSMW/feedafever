import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function cacheFavicons() {
  const feeds = await prisma.feed.findMany();
  for (const feed of feeds) {
    if (feed.favicon) continue;
    try {
      const url = new URL(feed.url);
      const faviconUrl = `${url.protocol}//${url.host}/favicon.ico`;
      const res = await fetch(faviconUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        await prisma.feed.update({
          where: { id: feed.id },
          data: { favicon: `image/x-icon;base64,${base64}` },
        });
        console.log(`Cached favicon for ${feed.url}`);
      }
    } catch (err) {
      console.error(`Failed favicon ${feed.url}`, err);
    }
  }
}

cacheFavicons().finally(() => prisma.$disconnect());
