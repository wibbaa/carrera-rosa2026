import locosLogo from '../assets/brand/altruistamente-locos.png'
import organizersPhoto from '../assets/photos/organizadores.jpg'
import { ORGANIZERS } from '../lib/content'
import { Eyebrow } from '../components/UI'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'

export default function About() {
  return (
    <section className="bg-paper py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20">
          <Reveal direction="left">
            <Eyebrow>Quiénes organizan</Eyebrow>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-mist p-2 shrink-0 flex items-center justify-center">
                <img
                  src={locosLogo}
                  alt="Altruistamente Locos"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight">
                {ORGANIZERS.name}
              </h2>
            </div>
            <p className="text-ink-mute leading-relaxed mb-8">{ORGANIZERS.description}</p>

            <RevealGroup className="space-y-4" stagger={0.08}>
              {ORGANIZERS.team.map((member) => (
                <RevealItem key={member.name} direction="up">
                  <div className="flex items-baseline gap-3 border-b border-mist pb-3">
                    <span className="font-mono text-xs uppercase text-rose-deep tracking-wider shrink-0 w-40">
                      {member.role}
                    </span>
                    <span className="font-semibold">{member.name}</span>
                    <span className="text-ink-mute text-sm italic">“{member.nickname}”</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <div>
            <Reveal direction="right" delay={0.1} className="mb-10 flex justify-center md:justify-end">
              <div className="bg-paper border-8 border-white shadow-lg rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs">
                <img
                  src={organizersPhoto}
                  alt="Equipo de coordinación en la 1ra Carrera Rosa Nogales"
                  className="w-full h-auto"
                />
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute text-center py-2">
                  1ra Carrera Rosa · Fundadores y muchos más que nos sumamos
                </p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <Eyebrow>La ruta hasta hoy</Eyebrow>
              <h3 className="font-display text-2xl uppercase mb-8">Checkpoints</h3>
              <RevealGroup as="ol" className="relative border-l-2 border-mist ml-3 space-y-8" stagger={0.12}>
                {ORGANIZERS.timeline.map((item, i) => (
                  <RevealItem key={i} as="li" direction="right" className="pl-8 relative list-none">
                    <span
                      className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 ${
                        item.current ? 'bg-rose border-rose' : 'bg-paper border-ink-mute'
                      }`}
                    />
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                      {item.year}
                    </span>
                    <p
                      className={`font-display text-xl uppercase leading-tight ${
                        item.current ? 'text-rose' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
