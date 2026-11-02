import { wedding } from '../config/wedding'

export type InvitationPhase = 'idle' | 'waiting' | 'nameModal' | 'generating' | 'invitation' | 'rsvp' | 'success'
export type Attendance = '' | 'accept' | 'decline'

export interface GuestData {
  englishName: string
  hindiName: string
  phone: string
  guestCount: number
  attendance: Attendance
  message: string
}

export const emptyGuest = (): GuestData => ({ englishName: '', hindiName: '', phone: '', guestCount: 1, attendance: '', message: '' })

interface Stored { englishName?: string; hindiName?: string; dismissed?: boolean }
const KEY = wedding.invitation.sessionKey

/** sessionStorage only – cleared when the browser tab/session ends. Never throws. */
export function loadSession(): Stored {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Stored } catch { return {} }
}
export function saveSession(v: Stored) {
  try { sessionStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage blocked */ }
}

export const hasNames = (g: GuestData) => Boolean(g.englishName || g.hindiName)

export function downloadFileName(g: GuestData) {
  const name = g.englishName || g.hindiName || 'Guest'
  const slug = name.trim().replace(/[^A-Za-z0-9\u0900-\u097F]+/g, '-').replace(/^-|-$/g, '') || 'Guest'
  return `Wedding-Invitation-${slug}.png`
}
