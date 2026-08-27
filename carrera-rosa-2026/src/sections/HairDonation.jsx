import cintaRosa from '../assets/brand/cinta-rosa.png'
import { HAIR_DONATION, WHATSAPP_NUMBER } from '../lib/content'
import Reveal from '../components/Reveal'

export default function HairDonation() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
    HAIR_DONATION.waMessage
  )}`

  return (
    <section className="bg-rose-deep text-paper py-16 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <Reveal direction="scale" className="shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-white/40 p-3.5 flex items-center justify-center shadow-lg">
              <img
                src={cintaRosa}
                alt="Listón rosa, símbolo de lucha contra el cáncer de mama"
                className="w-full h-full object-contain"
              />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="flex-1 text-center md:text-left">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-paper/70 mb-2">
              También puedes ayudar así
            </p>
            <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight mb-3">
              {HAIR_DONATION.title}
            </h2>
            <p className="text-paper/85 max-w-2xl leading-relaxed">{HAIR_DONATION.description}</p>
          </Reveal>

          <Reveal direction="left" delay={0.2} className="shrink-0">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-paper-dim transition-colors text-rose-deep font-display uppercase text-sm md:text-base px-6 py-4 tracking-wide whitespace-nowrap"
            >
              {HAIR_DONATION.ctaLabel} →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
