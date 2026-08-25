import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="font-mono text-sm text-ink-mute">Cargando…</p>
      </div>
    )
  }

  if (!session) {
    return <AdminLogin onLoggedIn={() => {}} />
  }

  return (
    <AdminDashboard
      userEmail={session.user.email}
      onLogout={() => supabase.auth.signOut()}
    />
  )
}
