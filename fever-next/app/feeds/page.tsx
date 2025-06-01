import { PrismaClient } from '@prisma/client';

interface FeedRecord {
  id: number;
  url: string;
  title: string | null;
  groupId: number | null;
  siteUrl: string | null;
}

export const dynamic = 'force-dynamic';

async function getFeeds(): Promise<FeedRecord[]> {
  const prisma = new PrismaClient();
  const feeds = await prisma.feed.findMany({ include: { group: true } });
  await prisma.$disconnect();
  return feeds;
}

export default async function FeedListPage() {
  const feeds = await getFeeds();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feeds</h1>
      <ul className="space-y-2">
        {feeds.map((feed: FeedRecord) => (
          <li key={feed.id} className="border p-2 rounded">
            {feed.title || feed.url}
          </li>
        ))}
      </ul>
    </div>
  );
}
