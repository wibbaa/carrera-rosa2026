import { motion } from 'framer-motion'
import { KITS_INFO } from '../lib/content'
import { useRegistrationCount } from '../lib/useRegistrationCount'
import { Eyebrow } from '../components/UI'
import Reveal from '../components/Reveal'

export default function KitsProgress() {
  const { count } = useRegistrationCount()
  const known = count !== null
  const pct = known ? Math.min(100, Math.round((count / KITS_INFO.total) * 100)) : 0
  const soldOut = known && count >= KITS_INFO.total

  return (
    <section className="bg-ink text-paper py-20 md:py-28 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal direction="up">
          <Eyebrow dark>Kits limitados</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-8 leading-tight">
            {KITS_INFO.title}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="mb-10">
          <div className="flex items-end justify-center gap-2 mb-3 font-mono">
            <span className="text-4xl md:text-5xl font-bold text-rose-glow tabular-nums">
              {known ? count.toLocaleString('es-MX') : '—'}
            </span>
            <span className="text-paper/50 text-lg pb-1">
              / {KITS_INFO.total.toLocaleString('es-MX')} kits reservados
            </span>
          </div>

          <div className="h-3 w-full max-w-md mx-auto bg-paper/10 overflow-hidden">
            <motion.div
              className={`h-full ${soldOut ? 'bg-gold' : 'bg-rose'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {soldOut && (
            <p className="font-mono text-xs uppercase tracking-widest text-gold mt-3">
              Kits agotados — las inscripciones siguen abiertas
            </p>
          )}
        </Reveal>

        <Reveal direction="up" delay={0.2} className="space-y-4 text-paper/80 leading-relaxed">
          {KITS_INFO.paragraphs.map((p, i) => (
            <p key={i} className={i === KITS_INFO.paragraphs.length - 1 ? 'font-display text-xl uppercase text-rose-glow pt-2' : ''}>
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
