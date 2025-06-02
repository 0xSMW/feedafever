import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const feed = await prisma.feed.update({ where: { id: Number(params.id) }, data })
  return NextResponse.json(feed)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.feed.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ success: true })
}
