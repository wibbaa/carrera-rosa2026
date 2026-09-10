import { useEffect, useState } from 'react'

function getTimeLeft(targetISO) {
  const diff = new Date(targetISO).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

/** Cuenta regresiva en vivo hacia targetISO (formato ISO con zona horaria, ej. '2026-10-11T07:00:00-07:00'). */
export default function Countdown({ targetISO, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetISO))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  if (!timeLeft) {
    return (
      <p className={`font-display text-xl uppercase text-rose-glow ${className}`}>
        ¡Hoy es el día! 🎉
      </p>
    )
  }

  const units = [
    { value: timeLeft.days, label: 'días' },
    { value: timeLeft.hours, label: 'hrs' },
    { value: timeLeft.minutes, label: 'min' },
    { value: timeLeft.seconds, label: 'seg' },
  ]

  return (
    <div className={`flex gap-3 md:gap-4 ${className}`}>
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="font-mono text-2xl md:text-3xl font-bold text-rose-glow tabular-nums">
            {String(u.value).padStart(2, '0')}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-paper/60">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  )
}
