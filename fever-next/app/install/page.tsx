'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InstallPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/install')
      .then(res => res.json())
      .then(data => {
        if (data.installed) router.replace('/login')
      })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || 'Install failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Install Fever</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Install
        </button>
      </form>
    </div>
  )
}
