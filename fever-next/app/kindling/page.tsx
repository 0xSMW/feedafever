'use client'
import { useEffect, useState } from 'react'

interface Item {
  id: number
  title: string
  link: string
  content: string | null
}

export default function KindlingPage() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/items?kindling=1').then(res => res.json()).then(setItems)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Kindling</h1>
      {items.map(it => (
        <article key={it.id} className="border p-2 rounded">
          <h2 className="font-bold text-lg">
            <a href={it.link} target="_blank" rel="noopener noreferrer">{it.title}</a>
          </h2>
          <div dangerouslySetInnerHTML={{ __html: it.content || '' }} />
        </article>
      ))}
    </div>
  )
}
