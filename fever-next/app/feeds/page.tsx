'use client'
import { useEffect, useState } from 'react'

interface Feed { id: number; url: string; title?: string | null; groupId?: number | null }
interface Group { id: number; name: string }

export default function FeedListPage() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [url, setUrl] = useState('')
  const [groupId, setGroupId] = useState<number | ''>('' as any)

  useEffect(() => {
    fetch('/api/feeds').then(res => res.json()).then(setFeeds)
    fetch('/api/groups').then(res => res.json()).then(setGroups)
  }, [])

  async function addFeed(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, groupId: groupId || null })
    })
    if (res.ok) {
      const feed = await res.json()
      setFeeds([...feeds, feed])
      setUrl('')
      setGroupId('' as any)
    }
  }

  async function remove(id: number) {
    await fetch(`/api/feeds/${id}`, { method: 'DELETE' })
    setFeeds(feeds.filter(f => f.id !== id))
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Feeds</h1>
      <form onSubmit={addFeed} className="space-x-2">
        <input value={url} onChange={e => setUrl(e.target.value)} className="border p-1 rounded" placeholder="Feed URL" required />
        <select value={groupId} onChange={e => setGroupId(e.target.value ? Number(e.target.value) : '' as any)} className="border p-1 rounded">
          <option value="">No group</option>
          {groups.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
        </select>
        <button type="submit" className="border px-2 py-1 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {feeds.map(feed => (
          <li key={feed.id} className="border p-2 rounded flex justify-between">
            <span>{feed.title || feed.url}</span>
            <button onClick={() => remove(feed.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
