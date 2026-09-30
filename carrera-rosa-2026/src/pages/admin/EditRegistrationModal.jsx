import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MODALITIES } from '../../lib/content'
import { inputClass } from '../../components/Field'

const SHIRT_SIZES = ['', 'CH', 'M', 'G', 'XG', 'XXG']

export default function EditRegistrationModal({ registration, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: registration.full_name ?? '',
    phone: registration.phone ?? '',
    birth_date: registration.birth_date ?? '',
    gender: registration.gender ?? '',
    modality: registration.modality ?? '',
    category: registration.category ?? '',
    shirt_size: registration.shirt_size ?? '',
    team_name: registration.team_name ?? '',
    amount: registration.amount ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSaving(true)
    setError('')

    const patch = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      birth_date: form.birth_date,
      gender: form.gender,
      modality: form.modality,
      category: form.category.trim(),
      shirt_size: form.shirt_size || null,
      team_name: form.team_name.trim() || null,
      amount: Number(form.amount),
    }

    if (!patch.full_name || !patch.phone || !patch.birth_date || !patch.gender || !patch.modality || !patch.category) {
      setError('Nombre, teléfono, fecha de nacimiento, género, modalidad y categoría no pueden quedar vacíos.')
      setSaving(false)
      return
    }
    if (!Number.isFinite(patch.amount) || patch.amount < 0) {
      setError('El monto debe ser un número válido.')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('registrations')
      .update(patch)
      .eq('folio', registration.folio)

    setSaving(false)
    if (updateError) {
      setError('No se pudo guardar: ' + updateError.message)
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-paper border-2 border-ink max-w-lg w-full p-6 my-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-xl uppercase">Editar inscripción</h2>
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-widest text-ink-mute hover:text-ink"
          >
            ✕ Cerrar
          </button>
        </div>
        <p className="font-mono text-xs text-rose-deep font-bold mb-6">{registration.folio}</p>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Nombre completo
              </span>
              <input className={inputClass} value={form.full_name} onChange={set('full_name')} />
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Teléfono (con LADA, ej. +526XXXXXXXXX)
              </span>
              <input className={inputClass} value={form.phone} onChange={set('phone')} />
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Fecha de nacimiento
              </span>
              <input
                type="date"
                className={inputClass}
                value={form.birth_date}
                onChange={set('birth_date')}
              />
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Género
              </span>
              <select className={inputClass} value={form.gender} onChange={set('gender')}>
                <option value="femenil">Femenil</option>
                <option value="varonil">Varonil</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Modalidad
              </span>
              <select className={inputClass} value={form.modality} onChange={set('modality')}>
                {MODALITIES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Categoría
              </span>
              <input className={inputClass} value={form.category} onChange={set('category')} />
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Talla de playera
              </span>
              <select className={inputClass} value={form.shirt_size} onChange={set('shirt_size')}>
                {SHIRT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s || 'Sin playera'}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Equipo (opcional)
              </span>
              <input className={inputClass} value={form.team_name} onChange={set('team_name')} />
            </label>

            <label className="block mb-4 sm:col-span-2">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
                Monto (MXN)
              </span>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={form.amount}
                onChange={set('amount')}
              />
            </label>
          </div>

          {error && <p className="text-rose-deep text-sm mb-4">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="border-2 border-mist hover:border-ink transition-colors font-mono text-xs uppercase tracking-widest px-5 py-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-paper hover:bg-ink-soft disabled:opacity-50 transition-colors font-display uppercase px-6 py-3 tracking-wide"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
