'use client'
import { useContext, useEffect, useState } from 'react'
import { LayoutContext } from '../providers'

export default function SettingsPage() {
  const { layout, setLayout } = useContext(LayoutContext)
  const [current, setCurrent] = useState<'mobile' | 'desktop'>(layout)

  useEffect(() => {
    setCurrent(layout)
  }, [layout])

  function toggle() {
    const next = current === 'desktop' ? 'mobile' : 'desktop'
    setCurrent(next)
    setLayout(next)
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
    </div>
  )
}
