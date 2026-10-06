// Contenido extraído del PowerPoint "Equipo de Coordinación - Gran Carrera Rosa Nogales"
// Ajusta fechas, hora y montos exactos antes de publicar — quedaron marcados con TODO.

export const EVENT = {
  edition: '3ra',
  name: 'Gran Carrera Rosa Nogales',
  year: 2026,
  cause: 'En PRO de la Agrupación George Papanicolaou de Nogales y el Grupo Reconstruyendo la Esperanza',
  goalParticipants: 1201,
  // TODO: confirmar fecha y hora exactas de la 3ra edición
  date: '11 de Octubre',
  time: '7:00 AM',
  // Sonora no cambia de horario (sin horario de verano) → UTC-7 fijo todo el año.
  // Si la fecha de arriba cambia, actualiza esta también — de aquí lee la cuenta regresiva.
  dateTimeISO: '2026-10-11T07:00:00-07:00',
  venue: 'Plaza Miguel Hidalgo, Nogales, Sonora',
}

export const ORGANIZERS = {
  name: 'Altruistamente Locos',
  description:
    'Grupo de corredores que desde el 2024 organiza carreras para apoyar a instituciones de la comunidad.',
  timeline: [
    { year: '2024', label: '1ra Carrera Rosa' },
    { year: '2025', label: 'Carrera Todos con Saúl (TEApoyo)' },
    { year: '2025', label: '2da Carrera Rosa' },
    { year: '2026', label: 'Carrera Todos por Alejandrito'},
    { year: '2026', label: 'Carrera Asilo de Ancianos Franciscano'},
    { year: '2026', label: '3ra Carrera Rosa', current: true },
  ],
  team: [
    { role: 'El Loco Mayor', nickname: 'Señor Exigencias', name: 'Víctor Garay' },
    { role: 'Clima y seguridad', nickname: 'Tata Jaime', name: 'Jaime Castro' },
    { role: 'Relaciones públicas y social', nickname: 'Flaco', name: 'Plácido Quintero' },
    { role: 'Organizadora / Administradora', nickname: 'La Jefa', name: 'Carmina Ramírez' },
  ],
}

export const PAST_EDITIONS = [
  {
    label: '1ra Carrera Rosa · 2024',
    date: '27 de octubre 2024, 7:00 hrs',
    description:
      'Evento benéfico en pro de mujeres que padecen cáncer, con caminata, carrera y ciclismo.',
    stats: [
      { label: 'Caminantes', value: 111 },
      { label: 'Corredores', value: 171 },
      { label: 'Ciclistas', value: 51 },
    ],
    total: 333,
  },
  {
    label: '2da Carrera Rosa · 2025',
    description:
      'En beneficio de la Agrupación George Papanicolaou de Nogales, para prevención, detección oportuna y atención del cáncer.',
    highlight: 'Exitosísima',
    raised: '$405,069 MXN',
    total: 650,
    totalLabel: 'más de 650 personas',
  },
]

export const MODALITIES = [
  {
    id: 'caminata_playera',
    name: 'Caminata Familiar',
    distance: '2 KM',
    donativo: 300,
    includes: 'Playera y medalla de participación',
    route:
      'Salida Plaza Miguel Hidalgo sobre Av. Alvaro Obregon hacia el sur, Vuelta a la Izquierda en Cuidado con el Perro hacia Av. Plutarco Elias Calles hacia el norte hasta llegar a Gasolinera Calle Vazquez, vuelta a la izquierda y tomar Av. Adolfo Lopez Mateos hacia el sur para llegar a la Meta Plaza Miguel Hidalgo.',
  },
  {
    id: 'carrera',
    name: 'Carrera',
    distance: '5 KM',
    donativo: 300,
    includes: 'Playera y medalla de participación',
    route:
      'Salida Plaza Miguel Hidalgo sobre la Ave. Álvaro Obregón hacia el sur, vuelta a la izquierda en Florería Alcatraz Calle Manuel Pelayo, tomando Plutarco Elías Calles hacia el norte hasta llegar a Gasolinería Calle Vásquez, vuelta a la izquierda y tomar la Av. López Mateos hacia el sur para llegar a la meta Plaza Miguel Hidalgo.',
  },
  {
    id: 'ciclismo',
    name: 'Rodada MTB',
    distance: '15 KM',
    donativo: 300,
    includes: 'Playera y medalla de participación',
    route:
      'Salida Plaza Miguel Hidalgo por calle Obregón hacia el sur, vuelta a la derecha en Servicentro Llantero Nogales, Periférico Luis Donaldo Colosio hacia el norte, vuelta a la derecha hasta Reforma, vuelta a la derecha hasta Av. Obregón hacia el sur, meta Plaza Miguel Hidalgo.',
  },
]

export const KIDS_RACE = {
  name: 'Carreras infantiles',
  description: 'En fomento a la actividad física; categorías de 100 y 200 metros.',
}

export const CATEGORIES = {
  carrera: {
    title: 'Carrera de 5 KM',
    groups: [
      'Menor de 9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39',
      '40-44', '45-49', '50-54', '55-59', '60-69', '70 y más',
    ],
    special: 'Categoría especial Incluyente (femenil y varonil)',
    prize: 'Los primeros 5 lugares de cada categoría reciben medalla conmemorativa de oro, plata, bronce, cuarto y quinto lugar. Habrá chips de cronometraje para los corredores.',
  },
  ciclismo: {
    title: 'Rodada de 15 KM',
    groups: ['Principiantes', 'Intermedio', 'Avanzados (femenil y varonil)'],
    prize: 'Los primeros 5 lugares de cada categoría reciben medalla conmemorativa de oro, plata, bronce, cuarto y quinto lugar. Habrá chips de cronometraje para los ciclistas.',
  },
  absolutos: 'Premiación a los absolutos: 5K pedestre y 15K ciclismo (femenil y varonil).',
  kids: 'Premiación a niños: 100 y 200 metros.',
}

export const BANK_DETAILS = {
  bank: 'BBVA México',
  accountHolder: 'Agrupación George Papanicolaou de Nogales Sonora IAP',
  clabe: '012778001275763077',
}

export const KITS_INFO = {
  total: 1200,
  fallbackAmount: 150,
  title: '¡Todos podemos ser parte de esta causa!',
  paragraphs: [
    'Una vez alcanzados los 1,200 kits disponibles, podrás seguir inscribiéndote y participar en la carrera con una aportación de $150 pesos.',
    'Tu inscripción será destinada a apoyar los recursos de nuestra causa. Estas inscripciones ya no incluirán camiseta ni medalla, pero tu participación y apoyo cuentan igual.',
    '¡Súmate, corre con nosotros y ayúdanos a hacer la diferencia!',
  ],
}

export const HAIR_DONATION = {
  title: 'Dona tu cabello',
  description:
    'Además de correr, caminar o rodar, también puedes apoyar donando tu cabello para pelucas de pacientes con cáncer. Si te gustaría donar, anótate por WhatsApp y te contactamos con toda la información.',
  ctaLabel: 'Quiero donar mi cabello',
  waMessage:
    'Hola, me gustaría donar mi cabello para la Gran Carrera Rosa Nogales. ¿Me pueden dar más información?',
}

export const WHATSAPP_NUMBER = 'TODO: 526311058180'
