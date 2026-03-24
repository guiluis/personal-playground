import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { playgroundEntries } from '@/lib/discover'
import Sidebar from '@/shell/Sidebar'
import Home from '@/pages/Home'

function LoadingFallback() {
  return (
    <div className="text-[14px]" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
      Loading…
    </div>
  )
}

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 's') {
        e.preventDefault()
        setSidebarVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
        {sidebarVisible && <Sidebar entries={playgroundEntries} />}
        <main className={`flex-1 p-0 transition-[margin] duration-200 ${sidebarVisible ? 'ml-[240px]' : 'ml-0'}`}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {playgroundEntries.map(entry => {
                const Page = lazy(entry.load)
                return (
                  <Route
                    key={entry.slug}
                    path={`/${entry.slug}`}
                    element={<Page />}
                  />
                )
              })}
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  )
}
