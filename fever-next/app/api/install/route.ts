import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const user = await prisma.user.findFirst()
  return NextResponse.json({ installed: Boolean(user) })
}

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  const existing = await prisma.user.findFirst()
  if (existing) {
    return NextResponse.json({ error: 'Already installed' }, { status: 400 })
  }
  await prisma.user.create({ data: { email, password } })
  return NextResponse.json({ success: true })
}
