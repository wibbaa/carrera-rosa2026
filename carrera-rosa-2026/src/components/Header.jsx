import { motion } from 'framer-motion'
import locosLogo from '../assets/brand/altruistamente-locos.png'
import { EVENT } from '../lib/content'

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b-2 border-mist"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-white border border-mist p-1 shrink-0 flex items-center justify-center">
            <img src={locosLogo} alt="Altruistamente Locos" className="w-full h-full object-contain" />
          </div>
          <span className="font-display uppercase text-sm md:text-base leading-none truncate">
            {EVENT.edition} Carrera Rosa Nogales
          </span>
        </a>
        <a
          href="/registro"
          className="shrink-0 bg-rose hover:bg-rose-glow transition-colors text-ink font-display uppercase text-xs md:text-sm px-4 md:px-6 py-2.5 tracking-wide"
        >
          Regístrate
        </a>
      </div>
    </motion.header>
  )
}
