import papanicolaou from '../assets/brand/papanicolaou.png'
import cintaRosa from '../assets/brand/cinta-rosa.png'
import { EVENT } from '../lib/content'
import Reveal from '../components/Reveal'

export default function Cause() {
  return (
    <section className="bg-paper py-16 md:py-20 border-b-2 border-mist overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <Reveal direction="scale" className="shrink-0 flex items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-2 border-mist p-4 flex items-center justify-center shadow-sm">
              <img
                src={cintaRosa}
                alt="Listón rosa, símbolo de lucha contra el cáncer de mama"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-2 border-mist p-3.5 flex items-center justify-center shadow-sm">
              <img
                src={papanicolaou}
                alt="Agrupación George Papanicolaou de Nogales, Sonora I.A.P."
                className="w-full h-full object-contain"
              />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.15}>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-rose-deep mb-2">
              La causa
            </p>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl">
              {EVENT.cause}. Cada dorsal registrado es un donativo directo a la prevención,
              detección oportuna y atención del cáncer de mama en Nogales.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
