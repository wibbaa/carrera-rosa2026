import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { inputClass } from '../../components/Field'

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    onLoggedIn()
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-2xl uppercase mb-1">Panel admin</h1>
        <p className="text-ink-mute text-sm mb-8">
          Gran Carrera Rosa Nogales. Acceso restringido.
        </p>

        <label className="block mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
            Correo
          </span>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-mute block mb-1.5">
            Contraseña
          </span>
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="text-rose-deep text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper hover:bg-ink-soft disabled:opacity-50 transition-colors font-display uppercase text-lg px-6 py-3.5 tracking-wide"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
