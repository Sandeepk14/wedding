import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Envelope } from './Envelope'
import { FloralCorner } from '../Ornaments'
import { FlowerParticles } from '../FlowerParticles'

/** STEP 6 – envelope opens while the personalized invitation is "prepared" (~2.6 s). */
export function InvitationLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const total = reduce ? 900 : 2600

  useEffect(() => {
    const t1 = window.setTimeout(() => setOpen(true), total * 0.4)
    const t2 = window.setTimeout(onDone, total)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div className="fixed inset-0 z-[85] grid place-items-center bg-night/85 px-4 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} role="status" aria-live="polite">
      <FlowerParticles petals={12} sparkles={16} className="!fixed" />
      <motion.div className="relative w-full max-w-md overflow-hidden rounded-[28px] border-2 border-gold px-6 pb-8 pt-10 text-center"
        style={{ background: 'radial-gradient(120% 100% at 50% 0%, #FFFBF1, #FFF4E3 55%, #F1DCC0)', boxShadow: 'inset 0 0 0 6px #FFF4E3, inset 0 0 0 7.5px rgba(212,175,55,.7), 0 30px 70px -20px rgba(0,0,0,.7)' }}
        initial={reduce ? false : { scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-24" />
        <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-24" flip />
        <Envelope open={open} animate className="mx-auto h-32 w-44 drop-shadow-xl" />
        <p className="mt-5 font-script text-3xl font-bold italic leading-tight text-burgundy sm:text-4xl">Preparing Your<br />Personalized Invitation…</p>
        <div className="mx-auto mt-5 h-3 w-4/5 overflow-hidden rounded-full border border-gold/70 bg-burgundy/10" aria-hidden>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#F6DE8D,#D4AF37 45%,#8E0A22)' }} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: total / 1000, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </motion.div>
  )
}
