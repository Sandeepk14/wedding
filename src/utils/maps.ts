import type { Venue } from '../config/wedding'

const enc = (q: string) => encodeURIComponent(q)

/** Google Maps search link built purely from the supplied address text. */
export const mapsSearchUrl = (v: Venue) =>
  `https://www.google.com/maps/search/?api=1&query=${enc(v.mapsQuery)}`

/** Google Maps directions link (user's current location → venue). */
export const mapsDirectionsUrl = (v: Venue) =>
  `https://www.google.com/maps/dir/?api=1&destination=${enc(v.mapsQuery)}`

/** Keyless embeddable map for the address search. */
export const mapsEmbedUrl = (v: Venue) =>
  `https://www.google.com/maps?q=${enc(v.mapsQuery)}&output=embed`
