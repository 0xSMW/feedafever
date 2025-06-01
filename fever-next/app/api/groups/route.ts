import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const groups = await prisma.group.findMany()
  return NextResponse.json(groups)
}

export async function POST(req: Request) {
  const data = await req.json()
  const group = await prisma.group.create({ data })
  return NextResponse.json(group)
}
