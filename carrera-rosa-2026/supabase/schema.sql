-- ============================================================================
-- 3ra Gran Carrera Rosa Nogales 2026 — esquema completo de Supabase
-- Corre esto completo en el SQL editor de tu proyecto (Supabase → SQL Editor).
-- Es seguro volver a correrlo si ya tenías una versión anterior instalada:
-- usa "if not exists" / "or replace" / "drop policy if exists" en todos lados.
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
  modality text not null check (modality in ('caminata', 'caminata_playera', 'carrera', 'ciclismo')),
  category text not null,
  shirt_size text,
  team_name text,
  amount numeric not null,
  payment_proof_path text,
  payment_status text not null default 'pendiente'
    check (payment_status in ('pendiente', 'verificado', 'rechazado')),
  whatsapp_verified boolean not null default false,
  -- se llenan solos vía trigger / script de limpieza — no los toca el cliente
  confirmed_at timestamptz,
  proof_deleted_at timestamptz,
  created_at timestamptz not null default now()
);

-- por si vienes de una versión anterior del schema, agrega las columnas nuevas sin tronar nada
alter table public.registrations add column if not exists confirmed_at timestamptz;
alter table public.registrations add column if not exists proof_deleted_at timestamptz;
alter table public.registrations add column if not exists team_name text; -- opcional, puede quedar vacío
alter table public.registrations add column if not exists disability boolean not null default false;
alter table public.registrations add column if not exists disability_details text;

-- idem para el check de modalidades: "create table if not exists" no toca una tabla que
-- ya existe, así que si tu tabla ya estaba creada sin 'caminata_playera' hay que
-- actualizar el constraint a mano aquí.
alter table public.registrations drop constraint if exists registrations_modality_check;
alter table public.registrations add constraint registrations_modality_check
  check (modality in ('caminata', 'caminata_playera', 'carrera', 'ciclismo'));

create index if not exists registrations_folio_idx on public.registrations (folio);
create index if not exists registrations_modality_idx on public.registrations (modality);
create index if not exists registrations_payment_status_idx on public.registrations (payment_status);
create index if not exists registrations_cleanup_idx
  on public.registrations (payment_status, confirmed_at)
  where payment_proof_path is not null;
create index if not exists registrations_team_name_idx
  on public.registrations (team_name)
  where team_name is not null;

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
    modality, category, shirt_size, team_name,
    disability, disability_details,
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
    nullif(trim(payload->>'team_name'), ''), -- opcional: cadena vacía o ausente se guarda como null
    coalesce((payload->>'disability')::boolean, false),
    nullif(trim(payload->>'disability_details'), ''),
    (payload->>'amount')::numeric
  )
  returning registrations.id into new_id;

  return query select new_folio, new_id;
end;
$$;

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

-- 4.1) RPC para cancelar una inscripción que quedó a medias (p. ej. si falló la
--      subida del comprobante después de crear el folio).
create or replace function public.cancel_registration(p_folio text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.registrations
  where folio = p_folio
    and payment_proof_path is null; -- nunca borra una inscripción que ya tenga comprobante adjunto
end;
$$;

grant execute on function public.cancel_registration(text) to anon, authenticated;

-- 4.2) RPC pública para el contador en vivo de la landing. Solo regresa un
--      número (nada de nombres/teléfonos), así que es seguro exponerla a
--      cualquiera aunque el resto de la tabla esté bloqueada por RLS.
--      No cuenta los 'rechazado' porque esos liberan su kit de vuelta.
create or replace function public.get_registration_count()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer
  from public.registrations
  where payment_status <> 'rechazado';
$$;

grant execute on function public.get_registration_count() to anon, authenticated;

-- 5) Trigger: cuando un admin marca "verificado", sella la fecha automáticamente.
create or replace function public.set_confirmed_at()
returns trigger
language plpgsql
as $$
begin
  if new.payment_status = 'verificado' and (old.payment_status is distinct from 'verificado') then
    new.confirmed_at := now();
  elsif new.payment_status <> 'verificado' then
    new.confirmed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_confirmed_at on public.registrations;
create trigger trg_set_confirmed_at
before update on public.registrations
for each row execute function public.set_confirmed_at();

-- 6) Row Level Security
alter table public.registrations enable row level security;

-- Limpia cualquier policy vieja e insegura de versiones anteriores de este archivo
-- (esta dejaba leer TODA la tabla con la anon key pública).
drop policy if exists "select_by_exact_folio" on public.registrations;

-- El cliente público (anon) NUNCA lee la tabla directo — solo inserta vía las RPC
-- de arriba, y solo cuenta filas vía get_registration_count(). No hay policy de
-- select/update/delete para anon a propósito: si no hay policy, no hay acceso.

-- Solo usuarios autenticados (el/los admin que crees a mano en Supabase Auth)
-- pueden leer y actualizar inscripciones — esto es lo que usa el panel /admin.
drop policy if exists "admin_select_all" on public.registrations;
create policy "admin_select_all"
  on public.registrations for select
  to authenticated
  using (true);

drop policy if exists "admin_update_status" on public.registrations;
create policy "admin_update_status"
  on public.registrations for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- 7) Storage: bucket privado para comprobantes de pago
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('comprobantes-pago', 'comprobantes-pago', false)
on conflict (id) do nothing;

drop policy if exists "anyone_can_upload_proof" on storage.objects;
create policy "anyone_can_upload_proof"
  on storage.objects for insert
  to public
  with check (bucket_id = 'comprobantes-pago');

drop policy if exists "admin_view_proofs" on storage.objects;
create policy "admin_view_proofs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'comprobantes-pago');

drop policy if exists "admin_delete_proofs" on storage.objects;
create policy "admin_delete_proofs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'comprobantes-pago');

-- ============================================================================
-- 8) Crear tu usuario admin (hazlo UNA vez, a mano, no por SQL):
--    Supabase Dashboard → Authentication → Users → Add user
-- ============================================================================
