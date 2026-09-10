import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/** Lee el contador de inscritos vía la RPC pública get_registration_count()
 *  y lo refresca solo cada `pollMs` — sensación de "en vivo" sin necesitar
 *  Supabase Realtime. */
export function useRegistrationCount(pollMs = 45000) {
  const [count, setCount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCount() {
      const { data, error } = await supabase.rpc('get_registration_count')
      if (cancelled) return
      if (error) {
        setError(error.message)
        return
      }
      setCount(data)
    }

    fetchCount()
    const id = setInterval(fetchCount, pollMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [pollMs])

  return { count, error }
}
