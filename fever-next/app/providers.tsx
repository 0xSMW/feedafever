'use client';
import { SessionProvider } from 'next-auth/react'
import { createContext, useEffect, useState } from 'react'

export const LayoutContext = createContext<{
  layout: 'mobile' | 'desktop'
  setLayout: (layout: 'mobile' | 'desktop') => void
}>({ layout: 'desktop', setLayout: () => {} })

export default function Providers({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<'mobile' | 'desktop'>('desktop')

  useEffect(() => {
    const saved = localStorage.getItem('layout') as 'mobile' | 'desktop' | null
    if (saved) setLayout(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('layout', layout)
  }, [layout])

  return (
    <SessionProvider>
      <LayoutContext.Provider value={{ layout, setLayout }}>
        {children}
      </LayoutContext.Provider>
    </SessionProvider>
  )
}
