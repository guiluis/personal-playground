import Home from '@/pages/Home'
import { InterfaceKit } from 'interface-kit/react'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Home />
      {import.meta.env.DEV && <InterfaceKit />}
    </div>
  )
}
