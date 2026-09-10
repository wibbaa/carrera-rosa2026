import { MODALITIES, KIDS_RACE } from '../lib/content'
import { Eyebrow } from '../components/UI'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'

export default function Routes() {
  return (
    <section id="rutas" className="bg-paper-dim py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal direction="up">
          <Eyebrow>Modalidades</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-12 max-w-2xl">
            Elige cómo llegas a la meta
          </h2>
        </Reveal>

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-5xl mx-auto" stagger={0.12}>
          {MODALITIES.map((m) => (
            <RevealItem key={m.id} direction="up" className="w-full">
              <div className="bg-paper border-2 border-mist flex flex-col h-full w-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="p-6 border-b-2 border-mist flex items-baseline justify-between">
                  <h3 className="font-display text-2xl uppercase">{m.name}</h3>
                  <span className="font-mono text-rose-deep font-bold">{m.distance}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-ink-mute leading-relaxed mb-6">{m.route}</p>
                  <div className="mt-auto pt-4 border-t border-mist flex items-end justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute block">
                        Donativo
                      </span>
                      <span className="font-display text-3xl text-rose">${m.donativo}</span>
                    </div>
                    <span className="text-xs text-ink-mute text-right max-w-[9rem]">
                      {m.includes}
                    </span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="up" delay={0.2}>
          <div className="mt-8 bg-ink text-paper p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="font-display text-xl uppercase text-rose-glow">{KIDS_RACE.name}</h4>
              <p className="text-paper/70 text-sm">{KIDS_RACE.description}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
