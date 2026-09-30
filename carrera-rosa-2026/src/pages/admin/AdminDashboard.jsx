import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MODALITIES } from '../../lib/content'
import EditRegistrationModal from './EditRegistrationModal'

const TABS = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'verificado', label: 'Verificados' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'todos', label: 'Todos' },
]

const modalityName = (id) => MODALITIES.find((m) => m.id === id)?.name ?? id

// Mismo formato que usa Step3Confirmation.jsx para el wa.me del organizador,
// pero aquí apuntando al número del PARTICIPANTE — el que él mismo capturó al
// registrarse (con LADA incluida), no el del organizador.
function waLinkForParticipant(r) {
  const digits = (r.phone ?? '').replace(/\D/g, '')
  const message = `¡Hola ${r.full_name}! Te contactamos por tu inscripción a la Gran Carrera Rosa Nogales, folio ${r.folio}.`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export default function AdminDashboard({ userEmail, onLogout }) {
  const [tab, setTab] = useState('pendiente')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyFolio, setBusyFolio] = useState(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (tab !== 'todos') query = query.eq('payment_status', tab)
    const { data, error } = await query
    if (error) setError('No se pudo cargar la lista: ' + error.message)
    setRows(data ?? [])
    setLoading(false)
  }, [tab])

  useEffect(() => {
    load()
  }, [load])

  async function updateStatus(folio, payment_status) {
    setBusyFolio(folio)
    const { error } = await supabase.from('registrations').update({ payment_status }).eq('folio', folio)
    setBusyFolio(null)
    if (error) {
      alert('No se pudo actualizar: ' + error.message)
      return
    }
    load()
  }

  async function viewProof(path) {
    const { data, error } = await supabase.storage
      .from('comprobantes-pago')
      .createSignedUrl(path, 120) // el link expira en 2 minutos
    if (error) {
      alert('No se pudo abrir el comprobante: ' + error.message)
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const filteredRows = rows.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.folio.toLowerCase().includes(q) ||
      r.full_name.toLowerCase().includes(q) ||
      (r.team_name ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b-2 border-mist bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-lg uppercase">Panel admin · Carrera Rosa</h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-paper/60 hidden sm:inline">{userEmail}</span>
            <button
              onClick={onLogout}
              className="font-mono text-xs uppercase tracking-widest border border-paper/30 hover:border-paper px-3 py-1.5 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border-2 transition-colors ${
                  tab === t.id
                    ? 'bg-ink text-paper border-ink'
                    : 'border-mist text-ink-mute hover:border-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar por folio, nombre o equipo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-mist focus:border-rose outline-none px-4 py-2 bg-paper text-sm w-64"
          />
        </div>

        {error && <p className="text-rose-deep mb-4">{error}</p>}
        {loading ? (
          <p className="text-ink-mute font-mono text-sm">Cargando…</p>
        ) : filteredRows.length === 0 ? (
          <p className="text-ink-mute font-mono text-sm">No hay inscripciones en esta vista.</p>
        ) : (
          <div className="border-2 border-mist overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-paper-dim font-mono text-[11px] uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="text-left px-4 py-3">Folio</th>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Equipo</th>
                  <th className="text-left px-4 py-3">Teléfono</th>
                  <th className="text-left px-4 py-3">Modalidad</th>
                  <th className="text-left px-4 py-3">Categoría</th>
                  <th className="text-left px-4 py-3">Monto</th>
                  <th className="text-left px-4 py-3">Comprobante</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.id} className="border-t border-mist">
                    <td className="px-4 py-3 font-mono font-bold text-rose-deep whitespace-nowrap">
                      {r.folio}
                    </td>
                    <td className="px-4 py-3">{r.full_name}</td>
                    <td className="px-4 py-3 text-ink-mute">{r.team_name || '—'}</td>
                    <td className="px-4 py-3 font-mono">{r.phone}</td>
                    <td className="px-4 py-3">{modalityName(r.modality)}</td>
                    <td className="px-4 py-3">{r.category}</td>
                    <td className="px-4 py-3 font-mono">${r.amount}</td>
                    <td className="px-4 py-3">
                      {r.payment_proof_path ? (
                        <button
                          onClick={() => viewProof(r.payment_proof_path)}
                          className="text-rose-deep underline font-mono text-xs"
                        >
                          Ver
                        </button>
                      ) : (
                        <span className="text-ink-mute text-xs italic">
                          {r.proof_deleted_at ? 'borrado' : 'sin subir'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {r.payment_status !== 'verificado' && (
                          <button
                            disabled={busyFolio === r.folio}
                            onClick={() => updateStatus(r.folio, 'verificado')}
                            className="font-mono text-[11px] uppercase bg-rose hover:bg-rose-glow disabled:opacity-50 text-ink px-2.5 py-1.5 transition-colors"
                          >
                            Verificar
                          </button>
                        )}
                        {r.payment_status !== 'rechazado' && (
                          <button
                            disabled={busyFolio === r.folio}
                            onClick={() => updateStatus(r.folio, 'rechazado')}
                            className="font-mono text-[11px] uppercase border border-mist hover:border-ink disabled:opacity-50 px-2.5 py-1.5 transition-colors"
                          >
                            Rechazar
                          </button>
                        )}
                        <a
                          href={waLinkForParticipant(r)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] uppercase bg-[#25D366] hover:opacity-90 text-white px-2.5 py-1.5 transition-opacity"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => setEditing(r)}
                          className="font-mono text-[11px] uppercase border border-mist hover:border-ink px-2.5 py-1.5 transition-colors"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="font-mono text-[11px] text-ink-mute mt-4">
          Los comprobantes de inscripciones se borrarán automáticamente ~3 días después
          de marcarse como verificadas para ahorrar espacio.
        </p>
      </div>

      {editing && (
        <EditRegistrationModal
          registration={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pendiente: 'bg-gold/15 text-gold border-gold',
    verificado: 'bg-rose/10 text-rose-deep border-rose',
    rechazado: 'bg-mist text-ink-mute border-mist-dark',
  }
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-1 ${styles[status] ?? ''}`}
    >
      {status}
    </span>
  )
}
