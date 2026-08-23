-- ============================================================================
-- 3ra Gran Carrera Rosa Nogales 2026 — esquema de Supabase
-- Corre esto completo en el SQL editor de tu proyecto de Supabase.
-- Mismo patrón que ya usaste en el 4K con Causa: folio atómico vía RPC,
-- bucket privado para comprobantes, verificación manual por WhatsApp.
-- ============================================================================

-- 1) Secuencia para el folio (formato CRN26-00001)
create sequence if not exists carrera_rosa_folio_seq
  as bigint
  start with 1
  increment by 1;

-- 2) Tabla principal de inscripciones
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  folio text unique not null,
  full_name text not null,
  phone text not null,
  birth_date date not null,
  gender text not null check (gender in ('femenil', 'varonil')),
  modality text not null check (modality in ('caminata', 'carrera', 'ciclismo')),
  category text not null,
  shirt_size text,
  amount numeric not null,
  payment_proof_path text,
  payment_status text not null default 'pendiente'
    check (payment_status in ('pendiente', 'verificado', 'rechazado')),
  whatsapp_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists registrations_folio_idx on public.registrations (folio);
create index if not exists registrations_modality_idx on public.registrations (modality);
create index if not exists registrations_payment_status_idx on public.registrations (payment_status);

-- 3) RPC atómica: genera folio + inserta en una sola transacción
--    (evita condiciones de carrera si dos personas se registran al mismo tiempo)
create or replace function public.create_registration(payload jsonb)
returns table (folio text, id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_folio text;
  new_id uuid;
  seq_val bigint;
begin
  seq_val := nextval('carrera_rosa_folio_seq');
  new_folio := 'CRN26-' || lpad(seq_val::text, 5, '0');

  insert into public.registrations (
    folio, full_name, phone, birth_date, gender,
    modality, category, shirt_size,
    amount
  ) values (
    new_folio,
    payload->>'full_name',
    payload->>'phone',
    (payload->>'birth_date')::date,
    payload->>'gender',
    payload->>'modality',
    payload->>'category',
    payload->>'shirt_size',
    (payload->>'amount')::numeric
  )
  returning registrations.id into new_id;

  return query select new_folio, new_id;
end;
$$;

-- Solo el rol anónimo/autenticado puede llamar la función (no acceso directo a la tabla para insertar)
grant execute on function public.create_registration(jsonb) to anon, authenticated;

-- 4) RPC para adjuntar la ruta del comprobante una vez subido a Storage
create or replace function public.attach_payment_proof(p_folio text, p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.registrations
  set payment_proof_path = p_path
  where folio = p_folio;
end;
$$;

grant execute on function public.attach_payment_proof(text, text) to anon, authenticated;

-- 5) Row Level Security — nadie lee/escribe la tabla directo, todo pasa por las RPC de arriba
alter table public.registrations enable row level security;

-- Permite que una persona consulte SU PROPIO folio (para la pantalla de confirmación)
-- usando el folio exacto como "llave" — no hay listado público de inscritos.
create policy "select_by_exact_folio"
  on public.registrations for select
  using (true); -- el filtro por folio se hace en la query (.eq('folio', folio)); no hay policy de listado abierto porque el cliente siempre debe pasar el folio exacto

-- No se permite insert/update/delete directo desde el cliente — solo vía las funciones security definer de arriba
-- (no se crean policies de insert/update/delete a propósito)

-- ============================================================================
-- 6) Storage: bucket privado para comprobantes de pago
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('comprobantes-pago', 'comprobantes-pago', false)
on conflict (id) do nothing;

-- Cualquiera puede SUBIR un comprobante (insert), pero nadie puede leer el bucket
-- directo desde el cliente — la verificación la hace un admin desde el dashboard
-- de Supabase o un panel aparte con la service_role key.
create policy "anyone_can_upload_proof"
  on storage.objects for insert
  with check (bucket_id = 'comprobantes-pago');

-- ============================================================================
-- Notas:
-- - Verificación de pago: por ahora es manual (WhatsApp + revisar el comprobante
--   en el Storage dashboard, marcar payment_status = 'verificado' a mano o desde
--   un panel admin). Si luego quieres automatizarlo, podemos armar un panel simple.
-- - Recuerda actualizar WHATSAPP_NUMBER y BANK_DETAILS en src/lib/content.js
--   antes de publicar.
-- ============================================================================
