const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** '2026-11-16' → '16 November 2026' (DD Month YYYY, locale independent). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`
}

export function dayOf(iso: string): string {
  return String(Number(iso.split('-')[2])).padStart(2, '0')
}

export function monthShort(iso: string): string {
  return MONTHS[Number(iso.split('-')[1]) - 1].slice(0, 3)
}
