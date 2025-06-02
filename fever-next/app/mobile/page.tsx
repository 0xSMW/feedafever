'use client'
import { useEffect, useRef, useState } from 'react'

interface Item {
  id: number
  title: string
  link: string
  content: string | null
  read: boolean
}

export default function MobilePage() {
  const [items, setItems] = useState<Item[]>([])
  const startX = useRef(0)
  const startY = useRef(0)

  useEffect(() => {
    fetch('/api/items?feedId=1')
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  function onStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  function onEnd(item: Item) {
    return (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current
      const dy = e.changedTouches[0].clientY - startY.current
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        fetch(`/api/items/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: !item.read }),
        })
          .then(res => res.json())
          .then(updated =>
            setItems(items.map(i => (i.id === updated.id ? updated : i)))
          )
      }
    }
  }

  return (
    <div className="p-4 space-y-4 text-sm bg-white min-h-screen">
      <a href="/settings" className="underline text-blue-500">Settings</a>
      {items.map(item => (
        <article
          key={item.id}
          className={`border-b pb-2 ${item.read ? 'opacity-60' : ''}`}
          onTouchStart={onStart}
          onTouchEnd={onEnd(item)}
        >
          <a
            href={item.link}
            className="font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
          </a>
        </article>
      ))}
    </div>
  )
}
