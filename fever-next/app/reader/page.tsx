'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Item {
  id: number
  title: string
  link: string
  content: string | null
  pubDate: string
  read: boolean
}

export default function ReaderPage() {
  const [items, setItems] = useState<Item[]>([])
  const { data: session } = useSession()
  const [active, setActive] = useState(0)

  useEffect(() => {
    async function loadItems() {
      const res = await fetch('/api/items?feedId=1')
      const data = await res.json()
      setItems(data)
    }
    loadItems()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'j') {
        setActive((a) => Math.min(a + 1, items.length - 1))
      } else if (e.key === 'k') {
        setActive((a) => Math.max(a - 1, 0))
      } else if (e.key === 'm') {
        const item = items[active]
        if (!item) return
        fetch(`/api/items/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: !item.read })
        }).then(async res => {
          const updated = await res.json()
          setItems(items.map(i => i.id === updated.id ? updated : i))
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items, active])

  return (
    <div className="p-4 space-y-4">
      <a href="/settings" className="underline text-blue-500">Settings</a>
      {items.map((item, idx) => (
        <article key={item.id} className={`border p-2 ${idx === active ? 'bg-gray-100' : ''}`}>
          <h2 className="font-bold text-lg"><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h2>
          <div dangerouslySetInnerHTML={{ __html: item.content || '' }} />
        </article>
      ))}
    </div>
  )
}
