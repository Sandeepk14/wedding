import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Check, Loader2, MessageSquare, Phone, Send, Users } from 'lucide-react'
import { wedding } from '../../config/wedding'
import { isRsvpLive, type RsvpResult } from '../../api/rsvp'
import { FloralCorner, GoldDivider } from '../Ornaments'
import { FlowerParticles } from '../FlowerParticles'
import { DecorBadge } from '../DecorBadge'
import { rsvpSchema, type RsvpValues } from '../../utils/validation'
import type { GuestData } from '../../utils/invitation'

const shell = 'relative w-full max-w-xl overflow-hidden rounded-[28px] border-2 border-gold p-6 text-center shadow-card sm:p-9'
const shellStyle = { background: 'radial-gradient(120% 100% at 50% 0%, #FFFBF1, #FFF4E3 55%, #F1DCC0)', boxShadow: 'inset 0 0 0 6px #FFF4E3, inset 0 0 0 7.5px rgba(212,175,55,.7), 0 30px 70px -20px rgba(0,0,0,.7)' }
const input = 'w-full rounded-xl border border-gold/70 bg-white/85 py-3 pl-11 pr-3 font-body text-[15px] text-burgundy shadow-inner placeholder:text-burgundy/40 focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-gold/40'

interface Props {
  guest: GuestData
  onSubmit: (v: RsvpValues) => Promise<RsvpResult>
  onBack: () => void
}

/** STEP 8 – RSVP form, pre-filled with the guest's names. */
export function InvitationRSVP({ guest, onSubmit, onBack }: Props) {
  const reduce = useReducedMotion()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RsvpValues>({
    resolver: zodResolver(rsvpSchema), mode: 'onTouched',
    defaultValues: { guestCount: 1, attendance: guest.attendance || undefined, phone: guest.phone, message: guest.message },
  })
  const attendance = watch('attendance')

  const submit = async (v: RsvpValues) => {
    setBusy(true); setError('')
    const r = await onSubmit(v)
    if (!r.ok) { setError(r.error ?? 'Something went wrong. Please try again.'); setBusy(false) }
  }
  const e = (k: keyof RsvpValues) => errors[k]?.message as string | undefined

  return (
    <motion.section className={shell} style={shellStyle} aria-label="RSVP"
      initial={reduce ? false : { opacity: 0, rotateY: -70, scale: 0.95 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-24 sm:w-28" />
      <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-24 sm:w-28" flip />
      <button type="button" onClick={onBack} className="absolute left-4 top-4 z-10 hidden items-center gap-1 font-body text-xs font-semibold text-burgundy hover:underline sm:inline-flex"><ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Invitation</button>

      <h2 className="mt-2 font-script text-4xl font-bold italic text-burgundy sm:text-5xl">RSVP</h2>
      <GoldDivider className="mx-auto my-2 w-32" />
      <p className="font-script text-2xl italic text-burgundy">Dear {guest.englishName || guest.hindiName}</p>
      {guest.englishName && guest.hindiName && (
        <p lang="hi" className="font-deva text-lg font-bold text-burgundy/85">({guest.hindiName})</p>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="relative mx-auto mt-5 max-w-md space-y-3.5 text-left">
        {!isRsvpLive() && <p className="rounded-xl border border-gold/70 bg-gold/15 px-3 py-2 text-center font-body text-xs font-medium text-burgundy">Demo mode · online RSVP isn’t connected yet, so responses are not saved.</p>}

        <fieldset>
          <legend className="mb-1.5 font-body text-sm font-medium text-burgundy">Will you attend?</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {([['accept', 'Joyfully Accept'], ['decline', 'Regretfully Decline']] as const).map(([val, label]) => (
              <label key={val} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center font-body text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${attendance === val ? 'border-burgundy bg-burgundy text-gold' : 'border-gold/70 bg-white/70 text-burgundy hover:bg-gold/15'}`}>
                <input type="radio" value={val} className="sr-only" {...register('attendance')} />
                {attendance === val && <Check className="h-4 w-4" aria-hidden />}{label}
              </label>
            ))}
          </div>
          {e('attendance') && <p role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{e('attendance')}</p>}
        </fieldset>

        <div>
          <label htmlFor="ir-phone" className="mb-1 block font-body text-sm font-medium text-burgundy">Phone number</label>
          <div className="relative"><Phone className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gold" aria-hidden />
            <input id="ir-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone Number" className={input} aria-invalid={!!errors.phone} {...register('phone')} /></div>
          {e('phone') && <p role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{e('phone')}</p>}
        </div>

        {attendance !== 'decline' && (
          <div>
            <label htmlFor="ir-guests" className="mb-1 block font-body text-sm font-medium text-burgundy">Number of guests (including you)</label>
            <div className="relative"><Users className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gold" aria-hidden />
              <select id="ir-guests" className={`${input} appearance-none`} {...register('guestCount', { valueAsNumber: true })}>
                {Array.from({ length: wedding.rsvp.maxGuests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select></div>
            {e('guestCount') && <p role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{e('guestCount')}</p>}
          </div>
        )}

        <div>
          <label htmlFor="ir-msg" className="mb-1 block font-body text-sm font-medium text-burgundy">Message (optional)</label>
          <div className="relative"><MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gold" aria-hidden />
            <textarea id="ir-msg" rows={3} placeholder="Your blessings & wishes…" className={`${input} resize-none`} {...register('message')} /></div>
          {e('message') && <p role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{e('message')}</p>}
        </div>

        {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-[#C4122F]/50 bg-[#C4122F]/10 px-3 py-2 font-body text-sm text-[#8E0A22]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{error}</p>}

        <button type="submit" disabled={busy} className="btn-maroon w-full !py-3.5 font-royal uppercase tracking-[0.18em]">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : <>Submit RSVP <Send className="h-4 w-4" aria-hidden /></>}
        </button>
        <button type="button" onClick={onBack} className="mx-auto block font-body text-xs font-semibold text-burgundy underline-offset-4 hover:underline sm:hidden">← Back to invitation</button>
      </form>
    </motion.section>
  )
}

/** Success state after RSVP submission. Demo mode is stated honestly. */
export function InvitationSuccess({ guest, result, onBack, onClose }: { guest: GuestData; result: RsvpResult | null; onBack: () => void; onClose: () => void }) {
  const live = result?.mode === 'live'
  return (
    <motion.section className={shell} style={shellStyle} role="status" aria-label="RSVP submitted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
      {guest.attendance === 'accept' && <FlowerParticles petals={18} sparkles={10} />}
      <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-24 sm:w-28" />
      <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-24 sm:w-28" flip />
      <motion.svg viewBox="0 0 80 80" className="relative mx-auto h-24 w-24" initial="h" animate="v" aria-hidden>
        <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#D4AF37" strokeWidth="4" variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.8 }} />
        <motion.path d="M24 41 L35 52 L57 29" fill="none" stroke="#570019" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.6, delay: 0.7 }} />
      </motion.svg>
      <div className="relative mt-3 flex justify-center"><DecorBadge name="flowerShower" label="Flower shower" className="h-12 w-12" /></div>
      <h2 className="relative mt-2 break-words font-script text-4xl font-bold italic text-burgundy sm:text-5xl">Thank You, {guest.englishName}!</h2>
      <p lang="hi" className="relative font-deva text-lg font-bold text-burgundy/85">({guest.hindiName})</p>
      <p className="relative mt-3 font-body text-burgundy/85">Your response means a lot to {wedding.groom} &amp; {wedding.bride}.</p>
      {!live && (
        <p className="relative mx-auto mt-4 max-w-sm rounded-xl border border-[#C4122F]/40 bg-[#C4122F]/10 px-4 py-3 font-body text-sm font-medium text-[#8E0A22]">
          Demo mode: this response was NOT saved or sent to anyone. Online RSVP is not enabled yet.
        </p>
      )}
      <div className="relative mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onBack} className="btn-maroon">View Invitation</button>
        <button type="button" onClick={onClose} className="btn-ghost !border-burgundy/60 !text-burgundy hover:!bg-burgundy/10">Back to Website</button>
      </div>
    </motion.section>
  )
}
