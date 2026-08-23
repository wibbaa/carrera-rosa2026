export function Eyebrow({ children, dark = false }) {
  return (
    <p
      className={`font-mono text-xs tracking-[0.25em] uppercase mb-3 ${
        dark ? 'text-rose-glow' : 'text-rose-deep'
      }`}
    >
      {children}
    </p>
  )
}

export function BibNumber({ value, className = '' }) {
  return (
    <span
      className={`font-display leading-none ${className}`}
      style={{ WebkitTextStroke: '1px currentColor' }}
    >
      {value}
    </span>
  )
}

export function StatTag({ value, label, dark = false }) {
  return (
    <div
      className={`bib-notch ${dark ? 'bib-notch-dark' : ''} border-2 ${
        dark ? 'border-mist-dark bg-ink-soft text-paper' : 'border-mist bg-paper text-ink'
      } px-6 py-5 text-center`}
    >
      <div className="font-display text-4xl md:text-5xl text-rose">{value}</div>
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase mt-1 opacity-70">
        {label}
      </div>
    </div>
  )
}
