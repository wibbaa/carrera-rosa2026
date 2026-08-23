export function Field({ label, error, children }) {
  return (
    <label className="block mb-5">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="text-rose-deep text-xs mt-1 block">{error}</span>}
    </label>
  )
}

export const inputClass =
  'w-full border-2 border-mist focus:border-rose outline-none px-4 py-3 bg-paper transition-colors'
