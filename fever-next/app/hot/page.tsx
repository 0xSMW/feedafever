'use client'
import { useEffect, useState } from 'react'

interface HotLink {
  title: string
  link: string
  temperature: number
}

export default function HotPage() {
  const [links, setLinks] = useState<HotLink[]>([])

  useEffect(() => {
    fetch('/api/hot').then(res => res.json()).then(setLinks)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Hot Links</h1>
      <ul className="space-y-2">
        {links.map(l => (
          <li key={l.link} className="border p-2 rounded">
            <span className="font-bold mr-2">{l.temperature}&deg;</span>
            <a href={l.link} className="underline" target="_blank" rel="noopener noreferrer">{l.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
