const STEPS = ['Datos', 'Pago', 'Listo']

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-3 mb-10 font-mono text-xs uppercase tracking-widest">
      {STEPS.map((label, i) => {
        const step = i + 1
        const active = step === current
        const done = step < current
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  done
                    ? 'bg-rose border-rose text-ink'
                    : active
                    ? 'border-rose text-rose'
                    : 'border-mist text-ink-mute'
                }`}
              >
                {done ? '✓' : step}
              </span>
              <span className={active ? 'text-ink' : 'text-ink-mute'}>{label}</span>
            </div>
            {step < STEPS.length && <span className="w-6 h-px bg-mist" />}
          </div>
        )
      })}
    </div>
  )
}
