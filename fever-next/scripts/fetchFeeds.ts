import RSSParser from 'rss-parser';
import { PrismaClient } from '@prisma/client';

const parser = new RSSParser();
const prisma = new PrismaClient();

async function fetchFeeds() {
  const feeds = await prisma.feed.findMany();
  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const entry of parsed.items) {
        await prisma.item.upsert({
          where: { link: entry.link || '' },
          update: {},
          create: {
            feedId: feed.id,
            title: entry.title || 'No title',
            link: entry.link || '',
            content: entry.contentSnippet || '',
            pubDate: entry.isoDate ? new Date(entry.isoDate) : new Date(),
          },
        });
      }
    } catch (err) {
      console.error(`Error fetching feed ${feed.url}:`, err);
    }
  }
}

fetchFeeds().finally(() => prisma.$disconnect());
