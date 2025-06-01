import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function getGroups() {
  const prisma = new PrismaClient()
  const groups = await prisma.group.findMany()
  await prisma.$disconnect()
  return groups
}

export default async function GroupListPage() {
  const groups = await getGroups()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.id} className="border p-2 rounded">
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
