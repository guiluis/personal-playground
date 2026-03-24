import type { ComponentType } from 'react'

export interface PlaygroundEntry {
  slug: string
  label: string
  load: () => Promise<{ default: ComponentType }>
}

// Matches src/components/*/playground.tsx (one folder deep — excludes nested dirs)
const rawModules = import.meta.glob('../components/*/playground.tsx')

function pathToSlug(path: string): string {
  return path.match(/\/components\/([^/]+)\/playground\.tsx$/)?.[1].toLowerCase() ?? ''
}

function pathToLabel(path: string): string {
  const name = path.match(/\/components\/([^/]+)\/playground\.tsx$/)?.[1] ?? ''
  // "DatePicker" → "Date Picker", "Button" → "Button"
  return name.replace(/([A-Z])/g, ' $1').trim()
}

export const playgroundEntries: PlaygroundEntry[] = Object.entries(rawModules)
  .map(([path, load]) => ({
    slug: pathToSlug(path),
    label: pathToLabel(path),
    load: load as PlaygroundEntry['load'],
  }))
  .filter(e => e.slug !== '')
  .sort((a, b) => a.label.localeCompare(b.label))
