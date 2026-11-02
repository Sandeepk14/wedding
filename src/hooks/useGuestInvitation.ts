import { useCallback, useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'
import { submitRsvp, type RsvpResult } from '../api/rsvp'
import { emptyGuest, hasNames, saveSession, type GuestData, type InvitationPhase } from '../utils/invitation'
import { recordPopupSubmission, recordRsvpSubmission } from '../utils/guestStorage'
import type { RsvpValues } from '../utils/validation'

/**
 * Central state machine for the personalized invitation experience:
 * waiting → nameModal → generating → invitation ⇄ rsvp → success  (idle = nothing showing)
 */
export function useGuestInvitation(siteReady: boolean) {
  const [guest, setGuest] = useState<GuestData>(() => emptyGuest())
  // Always start in 'waiting' so that every page refresh shows the popup after the 10-second timer
  const [phase, setPhase] = useState<InvitationPhase>('waiting')
  const [result, setResult] = useState<RsvpResult | null>(null)
  const guestRef = useRef(guest)
  guestRef.current = guest

  // Show the name popup on every page refresh, 10 seconds after the site is ready.
  useEffect(() => {
    if (!siteReady || phase !== 'waiting') return
    const t = window.setTimeout(() => setPhase('nameModal'), wedding.invitation.popupDelayMs)
    return () => window.clearTimeout(t)
  }, [siteReady, phase])

  const submitNames = useCallback((names: { englishName: string; hindiName: string }) => {
    const clean = { englishName: names.englishName.trim(), hindiName: names.hindiName.trim() }
    setGuest((g) => ({ ...g, ...clean }))
    saveSession(clean)
    recordPopupSubmission(clean)
    setPhase('generating')
  }, [])

  const closeModal = useCallback(() => {
    setPhase('idle')
  }, [])

  const finishGenerating = useCallback(() => setPhase('invitation'), [])
  const openInvitation = useCallback(() => setPhase(hasNames(guestRef.current) ? 'invitation' : 'nameModal'), [])
  const editNames = useCallback(() => setPhase('nameModal'), [])
  const closeInvitation = useCallback(() => setPhase('idle'), [])
  const startRsvp = useCallback(() => setPhase('rsvp'), [])
  const backToInvitation = useCallback(() => setPhase('invitation'), [])

  const sendRsvp = useCallback(async (v: RsvpValues): Promise<RsvpResult> => {
    const g = guestRef.current
    recordRsvpSubmission({
      name: g.englishName,
      nameHindi: g.hindiName,
      phone: v.phone,
      attending: v.attendance === 'accept' ? 'yes' : 'no',
      guests: v.attendance === 'accept' ? v.guestCount : 0,
      message: v.message || undefined,
    })
    const r = await submitRsvp({
      name: g.englishName || g.hindiName,
      nameHindi: g.hindiName || undefined,
      phone: v.phone,
      attending: v.attendance === 'accept' ? 'yes' : 'no',
      guests: v.attendance === 'accept' ? v.guestCount : 0,
      message: v.message || undefined,
    })
    setResult(r)
    if (r.ok) {
      setGuest((x) => ({ ...x, phone: v.phone, guestCount: v.guestCount, attendance: v.attendance, message: v.message ?? '' }))
      setPhase('success')
    }
    return r
  }, [])

  return {
    phase, guest, result, hasGuest: hasNames(guest),
    submitNames, closeModal, finishGenerating, openInvitation, editNames, closeInvitation, startRsvp, backToInvitation, sendRsvp,
  }
}
export type GuestInvitation = ReturnType<typeof useGuestInvitation>
