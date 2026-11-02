import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, Loader2, MessageSquare, Phone, Send, User, Users } from 'lucide-react'
import { wedding } from '../config/wedding'
import { isRsvpLive, submitRsvp, type RsvpResult } from '../api/rsvp'
import { recordRsvpSubmission } from '../utils/guestStorage'
import { FlowerParticles } from './FlowerParticles'

const MAX = wedding.rsvp.maxGuests

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80, 'Name is too long'),
  phone: z.string().trim().refine((v) => /^\+?\d{10,13}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid phone number (10–13 digits)'),
  attending: z.enum(['yes', 'no'], { required_error: 'Please choose one' }),
  guests: z.number({ invalid_type_error: 'Select number of guests' }).int().min(0).max(MAX),
  message: z.string().trim().max(300, 'Please keep it under 300 characters').optional(),
}).superRefine((v, ctx) => {
  if (v.attending === 'yes' && v.guests < 1) ctx.addIssue({ code: 'custom', path: ['guests'], message: 'Select at least 1 guest' })
})
type Values = z.infer<typeof schema>

const input = 'w-full rounded-xl border border-gold/70 bg-white/80 py-3 pl-11 pr-4 font-body text-[15px] text-burgundy placeholder:text-burgundy/45 shadow-inner focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/60'

function Field({ id, label, icon: Icon, error, children }: { id: string; label: string; icon: typeof User; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-body text-sm font-medium text-burgundy">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gold" aria-hidden />
        {children}
      </div>
      {error && <p id={`${id}-err`} role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{error}</p>}
    </div>
  )
}

export function RSVPForm() {
  const live = isRsvpLive()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<RsvpResult | null>(null)
  const [guestName, setGuestName] = useState('')
  const [attendingDone, setAttendingDone] = useState<'yes' | 'no'>('yes')

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema), defaultValues: { attending: 'yes', guests: 1 }, mode: 'onTouched',
  })
  const attending = watch('attending')

  const onSubmit = async (v: Values) => {
    setState('loading')
    recordRsvpSubmission({
      name: v.name,
      phone: v.phone,
      attending: v.attending,
      guests: v.attending === 'yes' ? v.guests : 0,
      message: v.message || undefined,
    })
    const r = await submitRsvp({ name: v.name, phone: v.phone, attending: v.attending, guests: v.attending === 'yes' ? v.guests : 0, message: v.message || undefined })
    setResult(r)
    if (r.ok) { setGuestName(v.name.split(' ')[0]); setAttendingDone(v.attending); setState('done'); reset({ attending: 'yes', guests: 1 }) }
    else setState('error')
  }

  if (state === 'done' && result) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-gold bg-ivory p-8 text-center shadow-card" role="status">
        {attendingDone === 'yes' && <FlowerParticles petals={16} sparkles={10} />}
        <motion.svg viewBox="0 0 80 80" className="relative mx-auto h-24 w-24" initial="h" animate="v" aria-hidden>
          <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#D4AF37" strokeWidth="4" variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.8 }} />
          <motion.path d="M24 41 L35 52 L57 29" fill="none" stroke="#570019" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.6, delay: 0.7 }} />
        </motion.svg>
        <h3 className="relative mt-3 font-script text-4xl font-bold italic text-burgundy">{attendingDone === 'yes' ? `Thank you, ${guestName}!` : `Thank you, ${guestName}`}</h3>
        <p className="relative mt-2 font-body text-burgundy/80">
          {result.mode === 'live'
            ? attendingDone === 'yes' ? 'Your response has been received. We can’t wait to celebrate with you!' : 'Your response has been received. You will be missed, and we are grateful for your blessings.'
            : 'This is a preview of the confirmation screen.'}
        </p>
        {result.mode === 'demo' && (
          <p className="relative mx-auto mt-4 max-w-sm rounded-xl border border-[#C4122F]/40 bg-[#C4122F]/10 px-4 py-3 font-body text-sm font-medium text-[#8E0A22]">
            Demo mode: this response was NOT saved or sent to anyone. Online RSVP is not enabled yet.
          </p>
        )}
        <button type="button" className="btn-maroon relative mt-6" onClick={() => setState('idle')}>Send another response</button>
      </div>
    )
  }

  const err = (k: keyof Values) => errors[k]?.message as string | undefined
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-3xl border border-gold/80 bg-ivory/90 p-6 shadow-card backdrop-blur sm:p-8" aria-label="RSVP form">
      {!live && (
        <p className="rounded-xl border border-gold/70 bg-gold/15 px-3 py-2 text-center font-body text-xs font-medium text-burgundy">
          Demo mode · online RSVP isn’t connected yet, so responses are not saved.
        </p>
      )}
      <Field id="rsvp-name" label="Your name" icon={User} error={err('name')}>
        <input id="rsvp-name" type="text" autoComplete="name" placeholder="Your Name" className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'rsvp-name-err' : undefined} {...register('name')} />
      </Field>
      <Field id="rsvp-phone" label="Phone number" icon={Phone} error={err('phone')}>
        <input id="rsvp-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone Number" className={input} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'rsvp-phone-err' : undefined} {...register('phone')} />
      </Field>

      <fieldset>
        <legend className="mb-1.5 font-body text-sm font-medium text-burgundy">Will you attend?</legend>
        <div className="grid grid-cols-2 gap-3">
          {([['yes', 'Joyfully attending'], ['no', 'Regretfully declining']] as const).map(([val, label]) => (
            <label key={val} className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center font-body text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${attending === val ? 'border-burgundy bg-burgundy text-gold' : 'border-gold/70 bg-white/70 text-burgundy hover:bg-gold/15'}`}>
              <input type="radio" value={val} className="sr-only" {...register('attending')} />
              {attending === val && <Check className="h-4 w-4" aria-hidden />}{label}
            </label>
          ))}
        </div>
        {err('attending') && <p role="alert" className="mt-1 font-body text-xs text-[#B3122F]">{err('attending')}</p>}
      </fieldset>

      {attending === 'yes' && (
        <Field id="rsvp-guests" label="Number of guests (including you)" icon={Users} error={err('guests')}>
          <select id="rsvp-guests" className={`${input} appearance-none`} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? 'rsvp-guests-err' : undefined} {...register('guests', { valueAsNumber: true })}>
            {Array.from({ length: MAX }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
          </select>
        </Field>
      )}

      <Field id="rsvp-msg" label="Message for the couple (optional)" icon={MessageSquare} error={err('message')}>
        <textarea id="rsvp-msg" rows={3} placeholder="Your blessings & wishes…" className={`${input} resize-none`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'rsvp-msg-err' : undefined} {...register('message')} />
      </Field>

      {state === 'error' && result?.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-[#C4122F]/50 bg-[#C4122F]/10 px-3 py-2 font-body text-sm text-[#8E0A22]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{result.error}
        </p>
      )}

      <button type="submit" disabled={state === 'loading'} className="btn-maroon w-full !py-3.5 font-royal uppercase tracking-[0.18em]">
        {state === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : <>Confirm RSVP <Send className="h-4 w-4" aria-hidden /></>}
      </button>
    </form>
  )
}
