import { useState } from 'react'

import { BANK_DETAILS } from '../../lib/content'
import { supabase } from '../../lib/supabase'

export default function Step2Payment({ data, onBack, onDone }) {
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)

  async function handleSubmit(ev) {
    ev.preventDefault()

    if (!file) {
      setError('Sube tu comprobante de pago para continuar.')
      return
    }

    setSubmitting(true)
    setError('')

    let folio = null
    let path = null
    let uploaded = false

    try {
      // ============================================================
      // 1) Crear la inscripción
      // ============================================================
      // El folio se genera de forma atómica dentro de la base de datos.

      const { data: rows, error: rpcError } = await supabase.rpc(
        'create_registration',
        {
          payload: {
            full_name: data.full_name,
            phone: data.phone,
            birth_date: data.birth_date,
            gender: data.gender,
            modality: data.modality,
            category: data.category,
            shirt_size: data.shirt_size ?? null,
            amount: data.amount,
          },
        }
      )

      if (rpcError) {
        throw rpcError
      }

      folio = rows?.[0]?.folio

      if (!folio) {
        throw new Error('No se generó el folio, intenta de nuevo.')
      }

      // ============================================================
      // 2) Preparar la ruta del comprobante
      // ============================================================

      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'

      path = `${folio}/comprobante.${ext}`

      // ============================================================
      // 3) Subir comprobante a Storage
      // ============================================================

      const { error: uploadError } = await supabase.storage
        .from('comprobantes-pago')
        .upload(path, file)

      if (uploadError) {
        throw uploadError
      }

      uploaded = true

      // ============================================================
      // 4) Vincular comprobante con la inscripción
      // ============================================================

      const { error: attachError } = await supabase.rpc(
        'attach_payment_proof',
        {
          p_folio: folio,
          p_path: path,
        }
      )

      if (attachError) {
        throw attachError
      }

      // ============================================================
      // 5) Todo salió correctamente
      // ============================================================

      onDone({ folio })
    } catch (err) {
      console.error('Error al registrar inscripción:', err)

      // ============================================================
      // LIMPIEZA
      // ============================================================
      // Si ya teníamos un folio, significa que la inscripción sí
      // llegó a crearse. Intentamos eliminar todo lo que alcanzamos
      // a crear para no dejar registros incompletos.

      if (folio) {
        // Si el archivo ya fue subido, intentamos eliminarlo.
        if (uploaded && path) {
          const { error: removeError } = await supabase.storage
            .from('comprobantes-pago')
            .remove([path])

          if (removeError) {
            console.error(
              'No se pudo eliminar el comprobante después del error:',
              removeError
            )
          }
        }

        // Intentamos eliminar la inscripción incompleta.
        const { error: cancelError } = await supabase.rpc(
          'cancel_registration',
          {
            p_folio: folio,
          }
        )

        if (cancelError) {
          console.error(
            'No se pudo cancelar la inscripción después del error:',
            cancelError
          )
        }
      }

      setError(
        'Algo falló al registrar tu inscripción. Revisa tu conexión e intenta de nuevo — si el problema sigue, contáctanos por WhatsApp.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-display text-2xl uppercase mb-1">
        Tu pago
      </h2>

      <p className="text-ink-mute text-sm mb-8">
        Transfiere tu donativo de{' '}
        <span className="text-rose-deep font-semibold">
          ${data.amount} MXN
        </span>{' '}
        y sube tu comprobante. Verificamos por WhatsApp en cuanto lo
        recibimos.
      </p>

      <div className="bg-paper-dim border-2 border-mist p-6 mb-8 font-mono text-sm space-y-2">
        <Row label="Banco" value={BANK_DETAILS.bank} />
        <Row label="Titular" value={BANK_DETAILS.accountHolder} />

        <div className="flex justify-between gap-4 items-center">
          <span className="text-ink-mute">CLABE</span>

          <div className="flex items-center gap-2">
            <span className="text-ink font-semibold">
              {BANK_DETAILS.clabe}
            </span>

            <button
              type="button"
              onClick={async () => {
                try {
                  setCopying(true)

                  // Intentar Clipboard API primero
                  if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(
                      BANK_DETAILS.clabe
                    )
                  } else {
                    // Fallback para navegadores sin Clipboard API
                    const ta = document.createElement('textarea')

                    ta.value = BANK_DETAILS.clabe
                    ta.style.position = 'fixed'
                    ta.style.left = '-9999px'

                    document.body.appendChild(ta)

                    ta.select()
                    document.execCommand('copy')

                    document.body.removeChild(ta)
                  }

                  setCopied(true)

                  setTimeout(() => {
                    setCopied(false)
                  }, 2000)
                } catch (err) {
                  console.error('copy failed', err)

                  setError(
                    'No se pudo copiar la CLABE. Cópiala manualmente.'
                  )
                } finally {
                  setCopying(false)
                }
              }}
              disabled={copying}
              className="ml-2 bg-ink text-paper text-xs uppercase px-3 py-2 rounded"
              aria-label="Copiar CLABE"
            >
              {copied
                ? 'Copiado'
                : copying
                  ? 'Copiando…'
                  : 'Copiar CLABE'}
            </button>
          </div>
        </div>
      </div>

      <label className="block mb-2 font-mono text-xs uppercase tracking-widest text-ink-mute">
        Comprobante de pago (foto o captura)
      </label>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null)
          setError('')
        }}
        className="w-full border-2 border-dashed border-mist px-4 py-6 mb-2 bg-paper file:mr-4 file:border-0 file:bg-ink file:text-paper file:px-4 file:py-2 file:font-mono file:text-xs file:uppercase"
      />

      {file && (
        <p className="text-xs text-ink-mute mb-4">
          Archivo: {file.name}
        </p>
      )}

      {error && (
        <p className="text-rose-deep text-sm mb-4">
          {error}
        </p>
      )}

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="border-2 border-mist hover:border-ink transition-colors font-mono text-xs uppercase tracking-widest px-6 py-4"
        >
          ← Atrás
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="bg-rose hover:bg-rose-glow disabled:opacity-50 transition-colors text-ink font-display uppercase text-lg px-10 py-4 tracking-wide"
        >
          {submitting
            ? 'Registrando…'
            : 'Confirmar registro →'}
        </button>
      </div>
    </form>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink font-semibold">{value}</span>
    </div>
  )
}