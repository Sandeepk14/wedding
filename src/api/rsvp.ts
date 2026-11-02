import { wedding } from '../config/wedding'

export interface RsvpPayload {
  name: string
  /** Hindi (Devanagari) name when the guest used the personalized invitation */
  nameHindi?: string
  phone: string
  guests: number
  attending: 'yes' | 'no'
  message?: string
}

export interface RsvpResult {
  ok: boolean
  /** 'live' = sent to your endpoint, 'demo' = NOT stored anywhere */
  mode: 'live' | 'demo'
  error?: string
}

export const isRsvpLive = () => Boolean(wedding.rsvp.endpoint)

/**
 * Backend-ready: set VITE_RSVP_ENDPOINT to any URL that accepts
 * POST application/json { name, phone, guests, attending, message, submittedAt }
 * (Google Apps Script web app, Formspree-style endpoint, your own API …).
 * Without an endpoint this runs in demo mode and never claims data was saved.
 */
export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResult> {
  if (!isRsvpLive()) {
    await new Promise((r) => setTimeout(r, 900))
    return { ok: true, mode: 'demo' }
  }
  try {
    const res = await fetch(wedding.rsvp.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
    })
    if (!res.ok) return { ok: false, mode: 'live', error: `Server responded with ${res.status}` }
    return { ok: true, mode: 'live' }
  } catch {
    return { ok: false, mode: 'live', error: 'Network error. Please check your connection and try again.' }
  }
}
