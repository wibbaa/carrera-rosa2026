import { WHATSAPP_NUMBER } from '../../lib/content'

export default function Step3Confirmation({ folio, name }) {
  const waMessage = encodeURIComponent(
    `¡Hola! Soy ${name || ''} y ya me registré a la Gran Carrera Rosa Nogales. Mi folio es ${folio}, les mando mi comprobante de pago por aquí para verificación.`
  )
  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${waMessage}`

  return (
    <div className="text-center py-6">
      <p className="font-mono text-xs uppercase tracking-widest text-rose-deep mb-2">
        Inscripción recibida
      </p>
      <h2 className="font-display text-3xl uppercase mb-6">¡Ya tienes tu dorsal!</h2>

      <div className="bib-notch inline-block border-4 border-ink px-10 py-6 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1">
          Folio
        </span>
        <span className="font-display text-4xl md:text-5xl text-rose">{folio}</span>
      </div>

      <p className="text-ink-mute max-w-md mx-auto mb-8 leading-relaxed">
        ¡Guarda tu folio! Para confirmar tu lugar, manda tu comprobante de pago por WhatsApp, así
        verificamos tu inscripción más rápido. También te invitamos a tomar una captura de pantalla a esta página.
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#25D366] hover:opacity-90 transition-opacity text-white font-display uppercase text-lg px-10 py-4 tracking-wide"
      >
        Verificar por WhatsApp →
      </a>

      <p className="mt-8">
        <a href="/" className="font-mono text-xs uppercase tracking-widest text-ink-mute underline">
          Volver al inicio
        </a>
      </p>
    </div>
  )
}
