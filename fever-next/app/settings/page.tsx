'use client'
import { useContext, useEffect, useState } from 'react'
import { LayoutContext } from '../providers'

export default function SettingsPage() {
  const { layout, setLayout } = useContext(LayoutContext)
  const [current, setCurrent] = useState<'mobile' | 'desktop'>(layout)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setCurrent(layout)
  }, [layout])

  function toggle() {
    const next = current === 'desktop' ? 'mobile' : 'desktop'
    setCurrent(next)
    setLayout(next)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/user/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      setMessage('Password updated')
      setPassword('')
    } else {
      const data = await res.json()
      setMessage(data.error || 'Error')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="space-x-2">
        <span>Preferred layout:</span>
        <button
          onClick={toggle}
          className="border px-2 py-1 rounded"
        >
          {current === 'desktop' ? 'Switch to mobile' : 'Switch to desktop'}
        </button>
      </div>
      <form onSubmit={changePassword} className="space-y-2">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="border px-2 py-1 rounded">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
