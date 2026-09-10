import { motion } from 'framer-motion'
import { EVENT } from '../lib/content'
import bannerPhoto from '../assets/photos/banner-hero.jpg'
import Countdown from '../components/Countdown'

export default function Hero() {
  return (
    <section className="relative bg-ink text-paper overflow-hidden">
      {/* photo backdrop — Ken Burns style slow zoom on load */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={bannerPhoto}
          alt="Corredores calentando antes de la salida de la Carrera Rosa Nogales"
          className="w-full h-full object-cover"
        />
      </motion.div>
      {/* dark gradient so text stays legible over the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
      <div className="absolute inset-0 bg-ink/15" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.div
          className="flex items-start gap-6 md:gap-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="font-display text-[5.5rem] md:text-[9rem] leading-[0.8] text-rose shrink-0 select-none"
            aria-hidden="true"
          >
            03
          </div>
          <div className="pt-2 md:pt-6">
            <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-rose-glow mb-2">
              Edición {EVENT.year} · Dorsal abierto
            </p>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] uppercase">
              Gran Carrera
              <br />
              Rosa Nogales
            </h1>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 max-w-xl text-paper/80 text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {EVENT.cause}. Caminata, carrera y rodada. Un mismo día, una misma meta.
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-paper/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <span>📍 {EVENT.venue}</span>
          <span>🕖 {EVENT.time}</span>
          <span>📅 {EVENT.date}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50 mt-6 mb-2">
            Faltan
          </p>
          <Countdown targetISO={EVENT.dateTimeISO} />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="/registro"
            className="bg-rose hover:bg-rose-glow transition-colors text-ink font-display text-lg uppercase px-8 py-4 tracking-wide"
          >
            ¡Quiero mi dorsal! →
          </a>
          <a
            href="#rutas"
            className="border-2 border-paper/30 hover:border-paper transition-colors font-mono text-sm uppercase tracking-widest px-8 py-4"
          >
            Muéstrame las rutas
          </a>
        </motion.div>
      </div>
    </section>
  )
}
