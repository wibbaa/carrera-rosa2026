// Calcula la categoría de edad para la carrera de 5K a partir de la fecha de nacimiento,
// usando los mismos rangos del PowerPoint del evento.
export function ageCategoryFor5k(birthDateStr) {
  if (!birthDateStr) return null
  const birth = new Date(birthDateStr)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

  if (age < 9) return 'Menor de 9'
  if (age <= 14) return '10-14'
  if (age <= 19) return '15-19'
  if (age <= 24) return '20-24'
  if (age <= 29) return '25-29'
  if (age <= 34) return '30-34'
  if (age <= 39) return '35-39'
  if (age <= 44) return '40-44'
  if (age <= 49) return '45-49'
  if (age <= 54) return '50-54'
  if (age <= 59) return '55-59'
  if (age <= 69) return '60-69'
  return '70 y más'
}
