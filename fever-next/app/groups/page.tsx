'use client'
import { useEffect, useState } from 'react'

interface Group { id: number; name: string }

export default function GroupListPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(setGroups)
  }, [])

  async function addGroup(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    if (res.ok) {
      const group = await res.json()
      setGroups([...groups, group])
      setName('')
    }
  }

  async function remove(id: number) {
    await fetch(`/api/groups/${id}`, { method: 'DELETE' })
    setGroups(groups.filter(g => g.id !== id))
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Groups</h1>
      <form onSubmit={addGroup} className="space-x-2">
        <input value={name} onChange={e => setName(e.target.value)} className="border p-1 rounded" placeholder="Group name" required />
        <button type="submit" className="border px-2 py-1 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {groups.map(group => (
          <li key={group.id} className="border p-2 rounded flex justify-between">
            <span>{group.name}</span>
            <button onClick={() => remove(group.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
