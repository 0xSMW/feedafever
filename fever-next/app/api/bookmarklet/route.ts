import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const feedUrl = url.searchParams.get('url')
  if (!feedUrl) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }
  const existing = await prisma.feed.findUnique({ where: { url: feedUrl } })
  let message = 'Feed added successfully.'
  if (existing) {
    message = 'Feed already subscribed.'
  } else {
    await prisma.feed.create({ data: { url: feedUrl } })
  }
  const html = `<!doctype html><html><body><p>${message} You can close this window.</p></body></html>`
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
