import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { wedding } from '../config/wedding'

function Unit({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion()
  const text = String(value).padStart(2, '0')
  return (
    <div className="gold-frame flex w-[22%] min-w-[68px] max-w-[130px] flex-col items-center rounded-2xl bg-black/35 py-3 backdrop-blur-sm sm:py-5" style={{ aspectRatio: '1 / 1.08' }}>
      <div className="relative h-[1.15em] overflow-hidden font-display text-4xl font-bold leading-[1.15] text-ivory sm:text-6xl" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={text} className="block tabular-nums"
            initial={reduce ? false : { y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? undefined : { y: '-70%', opacity: 0 }} transition={{ duration: 0.35 }}>
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-auto font-body text-[10px] uppercase tracking-[0.18em] text-champagne sm:text-xs">{label}</span>
    </div>
  )
}

/** Live countdown to the wedding (absolute IST instant). Stops at zero and shows a celebration message. */
export function Countdown() {
  const c = useCountdown(wedding.countdownTarget)
  if (c.done) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-gold/70 bg-black/35 p-8 text-center backdrop-blur-sm" role="status">
        <PartyPopper className="float-y mx-auto h-12 w-12 text-gold" aria-hidden />
        <p className="gold-text mt-3 font-script text-4xl font-bold italic sm:text-5xl">The celebrations have begun!</p>
        <p className="mt-2 font-body text-ivory/90">Pradeep &amp; Archana are beginning their beautiful journey together. Thank you for your blessings.</p>
      </div>
    )
  }
  return (
    <div role="timer" aria-label={`Time left until the wedding: ${c.days} days, ${c.hours} hours, ${c.minutes} minutes, ${c.seconds} seconds`}
      className="mx-auto flex max-w-2xl justify-center gap-2.5 sm:gap-5">
      <Unit value={c.days} label="Days" /><Unit value={c.hours} label="Hours" /><Unit value={c.minutes} label="Minutes" /><Unit value={c.seconds} label="Seconds" />
    </div>
  )
}
