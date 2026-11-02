import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { GuestInvitation } from '../../hooks/useGuestInvitation'
import { GuestNameModal } from './GuestNameModal'
import { InvitationLoader } from './InvitationLoader'
import { PersonalizedInvitationCard } from './PersonalizedInvitationCard'
import { InvitationActions } from './InvitationActions'
import { InvitationRSVP, InvitationSuccess } from './InvitationRSVP'
import { FlowerParticles } from '../FlowerParticles'
import { FloralCorner, Lantern } from '../Ornaments'

/** Renders whichever step of the personalized flow is active. */
export function InvitationExperience({ inv }: { inv: GuestInvitation }) {
  const { phase, guest } = inv
  const captureRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number>()
  const notify = (m: string) => { setToast(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(''), 2800) }
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showCard = phase === 'invitation' || phase === 'rsvp' || phase === 'success'

  useEffect(() => {
    if (!showCard) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && inv.closeInvitation()
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [showCard, inv])

  return (
    <>
      <AnimatePresence>
        {phase === 'nameModal' && <GuestNameModal key="name" initial={guest} onSubmit={inv.submitNames} onClose={inv.closeModal} />}
        {phase === 'generating' && <InvitationLoader key="gen" onDone={inv.finishGenerating} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCard && (
          <motion.div key="card" className="fixed inset-0 z-[85] overflow-y-auto backdrop-blur-md" style={{ background: 'radial-gradient(90% 70% at 50% 35%, rgba(150,30,60,.9), rgba(60,5,20,.96) 70%, rgba(25,5,13,.98))' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} role="dialog" aria-modal="true" aria-label="Your personalized wedding invitation">
            <FlowerParticles petals={14} sparkles={14} className="!fixed" />
            <div className="pointer-events-none fixed inset-0" aria-hidden>
              <FloralCorner className="absolute -left-4 -top-4 w-40 sm:w-64" />
              <FloralCorner className="absolute -right-4 -top-4 w-40 sm:w-64" flip />
              <div className="absolute -bottom-4 -left-4 w-36 scale-y-[-1] sm:w-60"><FloralCorner /></div>
              <div className="absolute -bottom-4 -right-4 w-36 rotate-180 sm:w-60"><FloralCorner /></div>
              <Lantern className="absolute left-[20%] top-0 hidden h-24 sm:block" delay={0.3} />
              <Lantern className="absolute right-[22%] top-0 hidden h-28 sm:block" delay={1} />
            </div>
            <button type="button" onClick={inv.closeInvitation} aria-label="Close invitation" className="fixed right-3 top-3 z-[90] grid h-11 w-11 place-items-center rounded-full border border-gold bg-maroon text-gold shadow-gold transition hover:bg-gold hover:text-maroon sm:right-6 sm:top-6"><X className="h-5 w-5" /></button>
            <div className="relative flex min-h-full flex-col items-center justify-center gap-5 px-3 py-16 sm:px-6" style={{ perspective: 1400 }}>
              {phase === 'invitation' && (
                <>
                  <PersonalizedInvitationCard ref={captureRef} guest={guest} onRsvp={inv.startRsvp} />
                  <InvitationActions guest={guest} captureRef={captureRef} onEditNames={inv.editNames} onNotify={notify} />
                </>
              )}
              {phase === 'rsvp' && <InvitationRSVP guest={guest} onSubmit={inv.sendRsvp} onBack={inv.backToInvitation} />}
              {phase === 'success' && <InvitationSuccess guest={guest} result={inv.result} onBack={inv.backToInvitation} onClose={inv.closeInvitation} />}
            </div>
            <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4">
              <AnimatePresence>{toast && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-full border border-gold bg-maroon px-5 py-2.5 font-body text-sm text-ivory shadow-gold">{toast}</motion.p>}</AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
