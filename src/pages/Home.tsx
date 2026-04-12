import { lazy, Suspense } from 'react'
import { playgroundEntries } from '@/lib/discover'

const lazyComponents = playgroundEntries.map(entry => lazy(entry.load))

export default function Home() {
  return (
    <div className="max-w-[400px] mx-auto px-6 py-16 flex flex-col gap-10">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <a
          href="https://glhrm.me"
          className="text-[11px] font-semibold tracking-widest uppercase mb-4 select-none inline-block"
          style={{ color: 'var(--color-muted)', opacity: 0.5 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          [ Back to glhrm.me ]
        </a>
        <h1 className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
          Design Playground
        </h1>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          A place to create, iterate and test ideas
        </p>
      </div>

      {/* Component feed */}
      {playgroundEntries.map((entry, i) => {
        const Component = lazyComponents[i]
        return (
          <div key={entry.slug} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
                {entry.label}
              </h2>
              {entry.description && (
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {entry.description}
                </p>
              )}
            </div>
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: '#F6F6F6', height: 320 }}
            >
              <Suspense fallback={null}>
                <Component />
              </Suspense>
            </div>
          </div>
        )
      })}
    </div>
  )
}
