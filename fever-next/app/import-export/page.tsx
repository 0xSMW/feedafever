'use client'
import { useState } from 'react'

export default function ImportExportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const text = await file.text()
    const res = await fetch('/api/opml', { method: 'POST', body: text })
    if (res.ok) {
      const data = await res.json()
      setMessage(`Imported ${data.imported} feeds`)
    } else {
      setMessage('Import failed')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Import / Export</h1>
      <a href="/api/opml" className="underline text-blue-600">Download OPML</a>
      <form onSubmit={handleImport} className="space-y-2">
        <input type="file" accept="text/xml" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="border px-2 py-1 rounded">Import</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
