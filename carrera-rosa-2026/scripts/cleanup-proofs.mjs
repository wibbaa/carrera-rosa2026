// scripts/cleanup-proofs.mjs
//
// Borra los comprobantes de pago de Storage para inscripciones que ya llevan
// N días marcadas como "verificado" — así no acumulas miles de fotos/PDFs una
// vez que ya no los necesitas. NO borra la fila de la inscripción, solo el
// archivo del comprobante (deja registro en la BD de que se borró y cuándo).
//
// Corre con la SERVICE ROLE key (nunca la anon key) porque necesita saltarse
// RLS y tener permiso de borrado en el bucket privado. Esa key NUNCA debe
// meterse en el código del sitio ni en el repo público — solo vive en las
// variables de entorno donde corras este script (ver README para opciones:
// cron local, GitHub Actions, etc).
//
// Uso:
//   node --env-file=.env.cleanup scripts/cleanup-proofs.mjs
//   node --env-file=.env.cleanup scripts/cleanup-proofs.mjs --days=5   (opcional, default 3)
//   node --env-file=.env.cleanup scripts/cleanup-proofs.mjs --dry-run  (solo muestra qué borraría)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'comprobantes-pago'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const daysArg = args.find((a) => a.startsWith('--days='))
const days = daysArg ? Number(daysArg.split('=')[1]) : 3

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Corre con: node --env-file=.env.cleanup scripts/cleanup-proofs.mjs\n' +
      '(la service_role key está en Supabase → Project Settings → API → service_role)'
  )
  process.exit(1)
}

if (!Number.isFinite(days) || days < 0) {
  console.error('--days debe ser un número >= 0')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function main() {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}Buscando comprobantes verificados antes de ${cutoff} (${days} días)…`
  )

  const { data: candidates, error } = await supabase
    .from('registrations')
    .select('id, folio, payment_proof_path, confirmed_at')
    .eq('payment_status', 'verificado')
    .not('payment_proof_path', 'is', null)
    .lte('confirmed_at', cutoff)

  if (error) {
    console.error('Error consultando registrations:', error.message)
    process.exit(1)
  }

  if (!candidates || candidates.length === 0) {
    console.log('Nada que borrar por ahora.')
    return
  }

  console.log(`Encontrados ${candidates.length} comprobante(s) para borrar.`)

  let ok = 0
  let failed = 0

  for (const row of candidates) {
    console.log(` - ${row.folio}: ${row.payment_proof_path}`)

    if (dryRun) continue

    const { error: removeError } = await supabase.storage.from(BUCKET).remove([row.payment_proof_path])
    if (removeError) {
      console.error(`   ⚠️  no se pudo borrar el archivo: ${removeError.message}`)
      failed++
      continue
    }

    const { error: updateError } = await supabase
      .from('registrations')
      .update({ payment_proof_path: null, proof_deleted_at: new Date().toISOString() })
      .eq('id', row.id)

    if (updateError) {
      console.error(`   ⚠️  archivo borrado pero no se pudo actualizar la fila: ${updateError.message}`)
      failed++
      continue
    }

    ok++
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] Se habrían borrado ${candidates.length} comprobante(s). Nada se tocó.`)
  } else {
    console.log(`\nListo — ${ok} comprobante(s) borrados, ${failed} con error.`)
  }
}

main()
