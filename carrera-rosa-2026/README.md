# 3ra Gran Carrera Rosa Nogales 2026

Landing + sistema de registro + panel admin (React + Vite + Supabase).

## 1. Instalar

```bash
npm install
cp .env.example .env
```

Llena `.env` con tu URL y anon key de Supabase (Project Settings -> API).

## 2. Base de datos

En el SQL Editor de tu proyecto de Supabase, corre completo `supabase/schema.sql`.
Esto crea:
- La tabla `registrations` (con `confirmed_at` y `proof_deleted_at` para limpieza automática)
- La secuencia y la función `create_registration` (folio atómico tipo `CRN26-00001`)
- Las funciones `attach_payment_proof`, `cancel_registration` y `get_registration_count`
  (esta última es la que alimenta el contador en vivo de la landing)
- El bucket privado `comprobantes-pago` para los comprobantes de pago
- El trigger que sella `confirmed_at` cuando marcas una inscripción como verificada
- Las políticas de RLS: el público NUNCA puede leer la tabla directo (solo insertar vía
  las funciones de arriba, y contar vía `get_registration_count`); solo un admin
  autenticado puede leer/actualizar

Es seguro volver a correrlo aunque ya tengas datos — no borra nada que ya tengas.

**Importante:** revisa que el `schema.sql` que tienes corrido en tu proyecto de Supabase
en vivo coincida con este archivo. Si llevas tiempo editando el sitio "entre bambalinas"
es fácil que un zip viejo se cuele — este archivo es siempre la versión correcta y completa,
y es seguro volver a correrlo aunque ya tengas datos.

## 3. Crear tu usuario admin

El panel de `/admin` usa Supabase Auth. No hay pantalla de registro pública — el admin se crea
a mano, una sola vez:

Supabase Dashboard -> Authentication -> Users -> **Add user** -> pon tu correo y una contraseña.

Con eso ya puedes entrar a `tu-sitio.com/admin`, poner ese correo y contraseña, y listo.

## 4. Antes de publicar - pendientes marcados con TODO

- `src/lib/content.js`:
  - `BANK_DETAILS` - datos bancarios reales
  - `WHATSAPP_NUMBER` - número en formato `52XXXXXXXXXX`
  - `EVENT.date` / `EVENT.dateTimeISO` - fecha y hora exactas de la 3ra edición
    (`dateTimeISO` es la que usa la cuenta regresiva — mantenla igual a `date`/`time`)

## Panel admin (`/admin`)

Login con el usuario que creaste en el paso 3. Desde ahí puedes:
- Ver inscripciones por pestaña: Pendientes / Verificados / Rechazados / Todos
- Buscar por folio, nombre o equipo
- Abrir el comprobante de pago (link firmado, expira en 2 minutos, no queda público)
- Marcar como **Verificado** o **Rechazado**
- **Editar** cualquier dato del participante (nombre, teléfono, fecha de nacimiento, género,
  modalidad, categoría, talla, equipo, monto) — útil, por ejemplo, para ajustar el monto a mano
  cuando se agoten los 1,200 kits y alguien se registre con la tarifa de $150 sin playera/medalla
- Botón de **WhatsApp** por participante — abre `wa.me` directo al número que la persona
  capturó al registrarse (el mismo campo `phone`, con LADA incluida, que usa la confirmación
  del registro), con un mensaje inicial ya escrito

## Registro por equipo (opcional)

En "Tus datos" del wizard hay un campo **"Equipo (opcional)"** — se puede dejar vacío sin
problema, no es obligatorio ni bloquea el registro. Se guarda en la columna `team_name` de
`registrations` (nula si no se llenó) y aparece en el panel admin, tanto en su propia columna
como en el buscador.

## Contador de kits en vivo

La sección "¡Todos podemos ser parte de esta causa!" (`src/sections/KitsProgress.jsx`) lee
el total de inscritos en tiempo real desde Supabase vía la función `get_registration_count()`
(solo regresa un número, no expone datos de nadie) y se refresca sola cada 45 segundos.

- El texto y el total de kits (1,200) están en `KITS_INFO` dentro de `src/lib/content.js`.
- Cuenta todas las inscripciones excepto las `rechazado` (esas liberan su kit de vuelta).
- Si algún día quieres que además cambie el precio automáticamente a $150 sin playera/medalla
  cuando se agoten los kits (ahora mismo es solo informativo, el precio real lo sigue
  definiendo `MODALITIES`), avísame y lo conectamos al flujo de registro.

## Cuenta regresiva

En el Hero, debajo de la fecha/hora/sede — componente reutilizable en
`src/components/Countdown.jsx`, recibe un `targetISO` (usa `EVENT.dateTimeISO` de
`content.js`). Sonora no tiene horario de verano, así que ese ISO siempre lleva `-07:00` fijo.

## Panel admin — recordatorio de seguridad

La `service_role` key de Supabase **nunca** va en el código del sitio ni en un repo público.
Si en algún punto armas un script de limpieza automática (borrar comprobantes viejos, etc.)
esa key solo debe vivir en variables de entorno del lugar donde corra ese script.

## Logos y fotos

Los 3 logos (Altruistamente Locos, Agrupación George Papanicolaou, listón rosa) están en
`src/assets/brand/`, y las 2 fotos del evento (banner del hero y equipo de coordinación) están
en `src/assets/photos/`. Es una landing pura de inscripción — no tiene sección de
patrocinadores.

## Animaciones

Usa `framer-motion` para las animaciones de scroll (`src/components/Reveal.jsx` — componentes
`Reveal`, `RevealGroup`, `RevealItem`). Respetan la preferencia de "reducir movimiento" del
sistema operativo automáticamente vía `MotionConfig` en `main.jsx`, así que no hay que hacer
nada extra para accesibilidad.

## Correr local

```bash
npm run dev
```

## Estructura

```
src/
  assets/brand/           <- logos: Altruistamente Locos, Papanicolaou, listón rosa
  assets/photos/           <- fotos del evento (banner, equipo de coordinación)
  lib/
    content.js             <- todo el copy y datos del evento (editar aquí)
    categorize.js           <- cálculo automático de categoría por edad (carrera 5K)
    useRegistrationCount.js  <- hook del contador en vivo de kits
    supabase.js
  components/
    Header.jsx               <- barra superior con logo + botón de registro
    Reveal.jsx                <- animaciones de scroll
    Countdown.jsx              <- cuenta regresiva en vivo
  sections/                     <- secciones de la landing (Hero, Cause, HairDonation, About,
                                    KitsProgress, Routes, Categories, CTA)
  pages/
    Landing.jsx
    Registration.jsx             <- wizard de 3 pasos
    registration/
      Step1PersonalInfo.jsx
      Step2Payment.jsx
      Step3Confirmation.jsx
    Admin.jsx                     <- decide entre login y dashboard según la sesión
    admin/
      AdminLogin.jsx
      AdminDashboard.jsx
      EditRegistrationModal.jsx
supabase/
  schema.sql                      <- correr en el SQL editor de Supabase
```

## Deploy

Cualquier hosting de estáticos sirve (Vercel, Netlify, Cloudflare Pages). Solo asegúrate de
configurar las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel
del hosting también.
