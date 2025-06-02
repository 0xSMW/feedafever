import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function prune() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  await prisma.item.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })

  await prisma.feed.deleteMany({
    where: {
      createdAt: { lt: cutoff },
      items: { none: {} },
    },
  })
}

prune().catch(err => {
  console.error('Prune failed', err)
  process.exit(1)
}).finally(() => prisma.$disconnect())

