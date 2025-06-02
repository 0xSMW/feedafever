import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { password } = await req.json()
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }
  const user = await prisma.user.findFirst()
  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 400 })
  }
  await prisma.user.update({ where: { id: user.id }, data: { password } })
  return NextResponse.json({ success: true })
}
