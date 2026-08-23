# 3ra Gran Carrera Rosa Nogales 2026

Landing + sistema de registro (React + Vite + Supabase).

## 1. Instalar

```bash
npm install
cp .env.example .env
```

Llena `.env` con tu URL y anon key de Supabase (Project Settings -> API).

## 2. Base de datos

En el SQL Editor de tu proyecto de Supabase, corre completo `supabase/schema.sql`.
Esto crea:
- La tabla `registrations`
- La secuencia y la función `create_registration` (folio atómico tipo `CRN26-00001`)
- La función `attach_payment_proof`
- El bucket privado `comprobantes-pago` para los comprobantes de pago

## 3. Antes de publicar - pendientes marcados con TODO

- `src/lib/content.js`:
  - `BANK_DETAILS` - datos bancarios reales
  - `WHATSAPP_NUMBER` - número en formato `52XXXXXXXXXX`
  - `EVENT.date` - fecha exacta de la 3ra edición

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

## 4. Correr local

```bash
npm run dev
```

## 5. Verificación de pagos

Por ahora es manual: la persona sube su comprobante y te escribe por WhatsApp con su folio.
Tú revisas el comprobante en Storage -> `comprobantes-pago` -> carpeta con el folio, y marcas
`payment_status = 'verificado'` a mano desde el Table Editor de Supabase (o dime y armamos un
panel admin sencillo).

## Estructura

```
src/
  assets/brand/          <- logos: Altruistamente Locos, Papanicolaou, listón rosa
  lib/
    content.js           <- todo el copy y datos del evento (editar aquí)
    categorize.js         <- cálculo automático de categoría por edad (carrera 5K)
    supabase.js
  components/
    Header.jsx            <- barra superior con logo + botón de registro
  sections/                <- secciones de la landing (Hero, Cause, About, Impact, Routes, Categories, CTA)
  pages/
    Landing.jsx
    Registration.jsx       <- wizard de 3 pasos
    registration/
      Step1PersonalInfo.jsx
      Step2Payment.jsx
      Step3Confirmation.jsx
supabase/
  schema.sql               <- correr en el SQL editor de Supabase
```

## Deploy

Cualquier hosting de estáticos sirve (Vercel, Netlify, Cloudflare Pages). Solo asegúrate de
configurar las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel
del hosting también.
