import { motion } from 'framer-motion'
import { EVENT } from '../lib/content'
import locosLogo from '../assets/brand/altruistamente-locos.png'
import papanicolaou from '../assets/brand/papanicolaou.png'
import cintaRosa from '../assets/brand/cinta-rosa.png'
import Reveal from '../components/Reveal'

export default function CTA() {
  return (
    <section className="bg-rose text-ink py-20 md:py-28 text-center overflow-hidden">
      <Reveal direction="scale" className="max-w-2xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight mb-4">
          ¡Tu dorsal te espera!
        </h2>
        <p className="text-ink/80 mb-8">
        Regístrate en tres simples pasos, toca el botón de abajo y asegura tu lugar en la carrera más emocionante del año.
        </p>
        <motion.a
          href="/registro"
          className="inline-block bg-ink text-paper hover:bg-ink-soft transition-colors font-display text-lg uppercase px-10 py-5 tracking-wide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          ¡Quiero registrarme! →
        </motion.a>
      </Reveal>
    </section>
  )
}

export function Footer() {
  const logos = [
    { src: locosLogo, alt: 'Altruistamente Locos' },
    { src: papanicolaou, alt: 'Agrupación George Papanicolaou de Nogales' },
    { src: cintaRosa, alt: 'Listón rosa — lucha contra el cáncer de mama' },
  ]
  return (
    <footer className="bg-ink text-paper/50 py-12 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        {logos.map((l) => (
          <div
            key={l.alt}
            className="w-12 h-12 rounded-full bg-white border border-mist-dark p-1.5 flex items-center justify-center"
          >
            <img src={l.src} alt={l.alt} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
      <p className="font-mono text-xs tracking-widest uppercase">
        {EVENT.edition} Gran Carrera Rosa Nogales ·{' '}
        <a
          href="https://www.facebook.com/CarreraRosaNogales"
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper hover:text-paper/80 transition-colors"
        >
          Altruistamente Locos
        </a>
        {' '}· Hecho con ❤️ en Nogales por{' '}
        <a
          href="https://www.instagram.com/asapwibba/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper hover:text-paper/80 transition-colors"
        >
          Wilberth Ramírez
        </a>
      </p>
    </footer>
  )
}
