import { NavLink, Link } from 'react-router-dom'
import type { PlaygroundEntry } from '@/lib/discover'

interface SidebarProps {
  entries: PlaygroundEntry[]
}

export default function Sidebar({ entries }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="px-6 py-5">
        <Link
          to="/"
          className="text-[11px] font-semibold tracking-widest uppercase select-none"
          style={{ color: 'var(--color-muted)', opacity: 0.5 }}
        >
          [ Playground ]
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto flex flex-col justify-center py-4">
        <p
          className="px-6 pb-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-muted)', opacity: 0.5 }}
          >
          Components
        </p>
        <ul>
          {entries.length === 0 ? (
            <li
              className="px-6 py-2 text-[13px] italic"
              style={{ color: 'var(--color-muted)', opacity: 0.4 }}
            >
              No components yet
            </li>
          ) : (
            entries.map(entry => (
              <li key={entry.slug}>
                <NavLink
                  to={`/${entry.slug}`}
                  className={({ isActive }) =>
                    [
                      'flex items-center py-[7px] text-[14px] transition-colors duration-100',
                      isActive
                        ? 'font-medium pl-[21px]'
                        : 'pl-[21px] hover:opacity-100',
                    ].join(' ')
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                  })}
                >
                  {entry.label}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4">
        <a
          href="https://glhrm.me"
          className="text-[12px] transition-colors duration-100"
          style={{ color: 'var(--color-muted)' }}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-accent)')}
          onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-muted)')}
        >
          glhrm.me ↗
        </a>
      </div>
    </aside>
  )
}
