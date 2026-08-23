import { CATEGORIES } from '../lib/content'
import { Eyebrow } from '../components/UI'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'

export default function Categories() {
  return (
    <section className="bg-paper py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal direction="up">
          <Eyebrow>Categorías y premiación</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-12 max-w-2xl">
            Oro, plata y bronce en cada rama
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Reveal direction="left">
            <h3 className="font-display text-xl uppercase text-rose-deep mb-4">
              {CATEGORIES.carrera.title}
            </h3>
            <RevealGroup className="flex flex-wrap gap-2 mb-4" stagger={0.03}>
              {CATEGORIES.carrera.groups.map((g) => (
                <RevealItem key={g} direction="fade">
                  <span className="font-mono text-xs border border-mist px-3 py-1.5 whitespace-nowrap inline-block">
                    {g}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="text-sm text-ink-mute italic mb-3">{CATEGORIES.carrera.special}</p>
            <p className="text-sm text-ink-mute leading-relaxed">{CATEGORIES.carrera.prize}</p>
          </Reveal>

          <Reveal direction="right">
            <h3 className="font-display text-xl uppercase text-rose-deep mb-4">
              {CATEGORIES.ciclismo.title}
            </h3>
            <RevealGroup className="flex flex-wrap gap-2 mb-4" stagger={0.05}>
              {CATEGORIES.ciclismo.groups.map((g) => (
                <RevealItem key={g} direction="fade">
                  <span className="font-mono text-xs border border-mist px-3 py-1.5 whitespace-nowrap inline-block">
                    {g}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="text-sm text-ink-mute leading-relaxed">{CATEGORIES.ciclismo.prize}</p>
          </Reveal>
        </div>

        <RevealGroup className="grid sm:grid-cols-2 gap-4" stagger={0.1}>
          <RevealItem direction="up">
            <div className="bg-gold/10 border border-gold px-5 py-4">
              <p className="text-sm">{CATEGORIES.absolutos}</p>
            </div>
          </RevealItem>
          <RevealItem direction="up">
            <div className="bg-gold/10 border border-gold px-5 py-4">
              <p className="text-sm">{CATEGORIES.kids}</p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
