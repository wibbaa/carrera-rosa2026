import { useMemo, useState } from 'react'
import { Field, inputClass } from '../../components/Field'
import { MODALITIES, CATEGORIES } from '../../lib/content'
import { ageCategoryFor5k } from '../../lib/categorize'

// LADAs más comunes para corredores en Nogales — border town, muchos con número de EE.UU.
const COUNTRY_CODES = [
  { code: '+52', label: '🇲🇽', country: 'México' },
  { code: '+1', label: '🇺🇸', country: 'EE.UU. / Canadá' },
]

export default function Step1PersonalInfo({ data, onNext }) {
  const [form, setForm] = useState({ phone_country: '+52', ...data })
  const [errors, setErrors] = useState({})

  const modality = form.modality
  const requiresShirtSize = modality === 'carrera' || modality === 'ciclismo' || modality === 'caminata_playera'
  const autoCategory = modality === 'carrera' ? ageCategoryFor5k(form.birth_date) : null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const modalityAmount = useMemo(
    () => MODALITIES.find((m) => m.id === modality)?.donativo ?? 0,
    [modality]
  )

  function validate() {
    const e = {}
    if (!form.full_name?.trim()) e.full_name = 'Falta tu nombre completo'
    const phoneDigits = (form.phone || '').replace(/\D/g, '')
    if (!phoneDigits) e.phone = 'Falta tu teléfono'
    else if (phoneDigits.length < 10) e.phone = 'Debe tener 10 dígitos'
    if (!form.birth_date) e.birth_date = 'Falta tu fecha de nacimiento'
    if (!form.gender) e.gender = 'Elige una opción'
    if (!form.modality) e.modality = 'Elige una modalidad'
    if (modality === 'ciclismo' && !form.category) e.category = 'Elige tu categoría'
    if (requiresShirtSize && !form.shirt_size) e.shirt_size = 'Elige tu talla'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const category =
      modality === 'carrera' ? autoCategory : modality === 'ciclismo' ? form.category : 'Libre'

    // Número completo en formato internacional (LADA + dígitos), listo para WhatsApp / wa.me
    const phoneDigits = (form.phone || '').replace(/\D/g, '')
    const fullPhone = `${form.phone_country}${phoneDigits}`

    onNext({ ...form, phone: fullPhone, category, amount: modalityAmount })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-display text-2xl uppercase mb-1">Tus datos</h2>
      <p className="text-ink-mute text-sm mb-8">Así aparecerás en tu dorsal y en la meta.</p>

      <div className="grid sm:grid-cols-2 gap-x-6">
        <Field label="Nombre completo" error={errors.full_name}>
          <input className={inputClass} value={form.full_name || ''} onChange={set('full_name')} />
        </Field>

        <Field label="Teléfono / WhatsApp" error={errors.phone}>
          <div className="flex items-stretch gap-2">
            <select
              className={`${inputClass} shrink-0 px-1 text-center`}
              style={{ width: '72px', minWidth: '72px', maxWidth: '72px' }}
              value={form.phone_country || '+52'}
              onChange={set('phone_country')}
              aria-label="Lada / código de país"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="tel"
              inputMode="numeric"
              className={`${inputClass} flex-1 min-w-0`}
              value={form.phone || ''}
              onChange={set('phone')}
              placeholder="631-000-000"
            />
          </div>
        </Field>

        <Field label="Fecha de nacimiento" error={errors.birth_date}>
          <input
            type="date"
            lang="es-MX"
            className={inputClass}
            value={form.birth_date || ''}
            onChange={set('birth_date')}
          />
        </Field>
        <Field label="Género" error={errors.gender}>
          <select className={inputClass} value={form.gender || ''} onChange={set('gender')}>
            <option value="">Selecciona</option>
            <option value="femenil">Femenil</option>
            <option value="varonil">Varonil</option>
          </select>
        </Field>
        <Field label="Modalidad" error={errors.modality}>
          <select className={inputClass} value={form.modality || ''} onChange={set('modality')}>
            <option value="">Selecciona</option>
            {MODALITIES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.distance} (${m.donativo}) {m.includes}
              </option>
            ))}
          </select>
        </Field>

        {modality === 'carrera' && (
          <Field label="Tu categoría (calculada por edad)">
            <div className={`${inputClass} bg-paper-dim text-ink-mute`}>
              {autoCategory ?? 'Captura tu fecha de nacimiento'}
            </div>
          </Field>
        )}

        {modality === 'ciclismo' && (
          <Field label="Categoría" error={errors.category}>
            <select className={inputClass} value={form.category || ''} onChange={set('category')}>
              <option value="">Selecciona</option>
              {CATEGORIES.ciclismo.groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
        )}

        {requiresShirtSize && (
          <Field label="Talla de playera" error={errors.shirt_size}>
            <select
              className={inputClass}
              value={form.shirt_size || ''}
              onChange={set('shirt_size')}
            >
              <option value="">Selecciona</option>
              {['CH', 'M', 'G', 'XG', 'XXG'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 bg-ink text-paper hover:bg-ink-soft transition-colors font-display uppercase text-lg px-10 py-4 tracking-wide"
      >
        Continuar →
      </button>
    </form>
  )
}
