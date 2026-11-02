import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Loader2, User, X } from 'lucide-react'
import { BrideCharacter } from '../BrideCharacter'
import { GroomCharacter } from '../GroomCharacter'
import { FloralCorner } from '../Ornaments'
import { FlowerParticles } from '../FlowerParticles'
import { Envelope } from './Envelope'
import { validateNames, type NameErrors } from '../../utils/validation'

interface Props {
  initial: { englishName: string; hindiName: string }
  onSubmit: (names: { englishName: string; hindiName: string }) => void
  onClose: () => void
}

const field = 'w-full rounded-xl border border-gold/70 bg-white/85 py-2.5 pl-12 pr-3 text-[15px] text-burgundy shadow-inner transition placeholder:text-burgundy/40 hover:border-burgundy/60 focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-gold/40'

/** STEP 3–5 – "You're Our Special Guest!" popup with English + Hindi name inputs. */
export function GuestNameModal({ initial, onSubmit, onClose }: Props) {
  const reduce = useReducedMotion()
  const [englishName, setEnglish] = useState(initial.englishName)
  const [hindiName, setHindi] = useState(initial.hindiName)
  const [errors, setErrors] = useState<NameErrors>({})
  const [busy, setBusy] = useState(false)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    first.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const r = validateNames({ englishName, hindiName })
    if (!r.ok) { setErrors(r.errors); return }
    setErrors({})
    setBusy(true) // button stays disabled until the popup transitions out
    onSubmit(r.clean)
  }

  return (
    <motion.div className="fixed inset-0 z-[85] overflow-y-auto bg-night/75 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <FlowerParticles petals={10} sparkles={12} className="!fixed" />
      <div className="relative flex min-h-full items-center justify-center px-3 py-10 sm:px-6">
        <motion.div
          role="dialog" aria-modal="true" aria-labelledby="gm-title"
          className="relative w-full max-w-xl"
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* characters flank the panel on large screens */}
          <GroomCharacter variant="waving" className="pointer-events-auto absolute -left-36 -bottom-6 z-10 hidden h-[340px] lg:block" />
          <BrideCharacter variant="namaste" className="pointer-events-auto absolute -right-32 -bottom-6 z-10 hidden h-[320px] lg:block" />

          <div className="relative overflow-hidden rounded-[28px] border-2 border-gold p-6 pb-8 text-center shadow-card sm:p-9" style={{ background: 'radial-gradient(120% 100% at 50% 0%, #FFFBF1 0%, #FFF4E3 55%, #F4E1C6 100%)', boxShadow: 'inset 0 0 0 6px #FFF4E3, inset 0 0 0 7.5px rgba(212,175,55,.7), 0 30px 70px -20px rgba(0,0,0,.7)' }}>
            <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-24 sm:w-32" />
            <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-24 sm:w-32" flip />
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-burgundy/40 bg-ivory text-burgundy transition hover:bg-burgundy hover:text-gold"><X className="h-4 w-4" /></button>

            <Envelope className="relative mx-auto h-16 w-20 drop-shadow-lg" />
            <h2 id="gm-title" className="mt-2 font-script text-4xl font-bold italic text-burgundy sm:text-5xl">You’re Our Special Guest!</h2>
            <p className="mx-auto mt-2 max-w-sm font-body text-sm text-burgundy/80">Please enter your name in English or Hindi to receive your personalized wedding invitation.</p>

            <form onSubmit={submit} noValidate className="relative mx-auto mt-5 max-w-md space-y-3.5 text-left">
              <div>
                <label htmlFor="gm-en" className="mb-1 block font-body text-xs font-medium text-burgundy">
                  Your Name (in English) <span className="font-normal text-burgundy/60">— English or Hindi</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-3 h-5 w-5 text-burgundy" aria-hidden />
                  <input ref={first} id="gm-en" value={englishName} onChange={(e) => setEnglish(e.target.value)} placeholder="e.g. Rahul Sharma" autoComplete="name" autoCapitalize="words" inputMode="text" maxLength={60}
                    aria-invalid={!!errors.englishName} aria-describedby={errors.englishName ? 'gm-en-err' : undefined} className={`${field} font-body`} />
                </div>
                {errors.englishName && <motion.p id="gm-en-err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 rounded-lg bg-[#C4122F]/10 px-3 py-1 font-body text-xs text-[#9B0C25]">{errors.englishName}</motion.p>}
              </div>
              <div>
                <label htmlFor="gm-hi" lang="hi" className="mb-1 block font-deva text-xs font-medium text-burgundy">
                  आपका नाम (हिंदी में) <span className="font-body text-[11px] font-normal text-burgundy/60">— हिंदी या अंग्रेजी</span>
                </label>
                <div className="relative">
                  <span aria-hidden className="pointer-events-none absolute left-4 top-[7px] font-deva text-xl font-bold text-burgundy">अ</span>
                  <input id="gm-hi" lang="hi" value={hindiName} onChange={(e) => setHindi(e.target.value)} placeholder="उदा. राहुल शर्मा" autoComplete="off" autoCapitalize="none" inputMode="text" maxLength={60}
                    aria-invalid={!!errors.hindiName} aria-describedby={errors.hindiName ? 'gm-hi-err' : undefined} className={`${field} font-deva`} />
                </div>
                {errors.hindiName && <motion.p id="gm-hi-err" role="alert" lang="hi" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 rounded-lg bg-[#C4122F]/10 px-3 py-1 font-deva text-xs text-[#9B0C25]">{errors.hindiName}</motion.p>}
              </div>
              <button type="submit" disabled={busy} className="btn-maroon w-full !py-3.5 font-royal uppercase tracking-[0.16em]">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Please wait…</> : <>Get My Invitation <ArrowRight className="h-4 w-4" aria-hidden /></>}
              </button>
            </form>

            {/* small screens: characters sit under the form */}
            <div className="mt-5 flex items-end justify-center gap-4 lg:hidden">
              <GroomCharacter variant="waving" className="h-28" />
              <BrideCharacter variant="namaste" className="h-[104px]" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
