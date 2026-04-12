import type { ComponentType } from 'react'

export interface PlaygroundEntry {
  slug: string
  label: string
  description: string
  load: () => Promise<{ default: ComponentType }>
}

// Lazy load for the component render
const rawModules = import.meta.glob('../components/*/playground.tsx')

// Eager load for metadata only
const rawMeta = import.meta.glob('../components/*/playground.tsx', { eager: true }) as Record<
  string,
  { meta?: { description?: string } }
>

function pathToSlug(path: string): string {
  return path.match(/\/components\/([^/]+)\/playground\.tsx$/)?.[1].toLowerCase() ?? ''
}

function pathToLabel(path: string): string {
  const name = path.match(/\/components\/([^/]+)\/playground\.tsx$/)?.[1] ?? ''
  return name.replace(/([A-Z])/g, ' $1').trim()
}

export const playgroundEntries: PlaygroundEntry[] = Object.entries(rawModules)
  .map(([path, load]) => ({
    slug: pathToSlug(path),
    label: pathToLabel(path),
    description: rawMeta[path]?.meta?.description ?? '',
    load: load as PlaygroundEntry['load'],
  }))
  .filter(e => e.slug !== '')
  .sort((a, b) => a.label.localeCompare(b.label))
