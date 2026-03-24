export default function Home() {
  return (
    <div className="max-w-[640px] mt-10 ml-10">
      <h1
        className="text-2xl font-semibold mb-3"
        style={{ color: 'var(--color-text)' }}
      >
        Component Playground
      </h1>
      <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--color-muted)' }}>
        Select a component from the sidebar to preview it, or create a new one to get started.
      </p>

      <div
        className="rounded-[8px] border p-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-muted)', opacity: 0.5 }}
        >
          Adding a component
        </p>
        <ol className="space-y-3">
          {[
            ['Create a folder', 'src/components/MyComponent/'],
            ['Build the component', 'src/components/MyComponent/MyComponent.tsx'],
            ['Add the demo', 'src/components/MyComponent/playground.tsx'],
          ].map(([step, path]) => (
            <li key={step} className="flex items-start gap-3 text-[14px]">
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold mt-px"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                {['1', '2', '3'][['Create a folder', 'Build the component', 'Add the demo'].indexOf(step)]}
              </span>
              <span style={{ color: 'var(--color-muted)' }}>
                {step} —{' '}
                <code
                  className="text-[13px] px-1 py-px rounded"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {path}
                </code>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[13px]" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          The component will appear in the sidebar automatically — no registration needed.
        </p>
      </div>
    </div>
  )
}
