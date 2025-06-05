import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const items = await prisma.item.findMany({
    where: { pubDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    include: { feed: true },
  })
  const map = new Map<string, { title: string; link: string; weight: number }>()
  for (const it of items) {
    const key = it.link
    const entry = map.get(key) || { title: it.title, link: it.link, weight: 0 }
    entry.weight += it.feed.isSpark ? 0.5 : 1
    map.set(key, entry)
  }
  const links = Array.from(map.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 20)
    .map(l => ({
      title: l.title,
      link: l.link,
      temperature: Number((98.6 + l.weight * 5).toFixed(1)),
    }))
  return NextResponse.json(links)
}
