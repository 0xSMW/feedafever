import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const feeds = await prisma.feed.findMany()
  const outlines = feeds
    .map(
      (f) => `    <outline text="${f.title ?? f.url}" xmlUrl="${f.url}" />`
    )
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="1.0">\n  <head>\n    <title>Fever Feeds</title>\n  </head>\n  <body>\n${outlines}\n  </body>\n</opml>`
  return new NextResponse(body, {
    headers: { 'Content-Type': 'application/xml' },
  })
}

export async function POST(req: Request) {
  const text = await req.text()
  const urls = Array.from(text.matchAll(/xmlUrl="([^"]+)"/g)).map((m) => m[1])
  for (const url of urls) {
    await prisma.feed.upsert({
      where: { url },
      update: {},
      create: { url },
    })
  }
  return NextResponse.json({ imported: urls.length })
}
