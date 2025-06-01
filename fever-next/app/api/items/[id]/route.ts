import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await req.json();
  const item = await prisma.item.update({ where: { id }, data });
  return NextResponse.json(item);
}
