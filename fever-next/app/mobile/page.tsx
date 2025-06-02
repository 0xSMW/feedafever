'use client'
import { useEffect, useState } from 'react'

interface Item {
  id: number
  title: string
  link: string
  content: string | null
}

export default function MobilePage() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/items?feedId=1')
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])

  return (
    <div className="p-2 space-y-4 text-sm">
      {items.map(item => (
        <article key={item.id} className="border-b pb-2">
          <a href={item.link} className="font-semibold" target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </article>
      ))}
    </div>
  )
}
