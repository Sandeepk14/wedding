import { motion, useReducedMotion } from 'framer-motion'

export type CurtainPhase = 'open' | 'closing' | 'opening'

const panel = 'absolute top-0 h-full w-1/2'
const fabric = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(0,0,0,.28) 0 6px, rgba(255,255,255,.05) 6px 14px, rgba(0,0,0,.18) 14px 22px), linear-gradient(180deg,#7A0B2E,#570019 60%,#35000F)',
}

/** Royal curtain: closes over the hero, then parts to reveal the main invitation. */
export function Curtain({ phase, onClosed, onOpened }: { phase: CurtainPhase; onClosed: () => void; onOpened: () => void }) {
  const reduce = useReducedMotion()
  const dur = reduce ? 0.01 : phase === 'closing' ? 0.9 : 1.6
  const closed = phase === 'closing'
  const done = () => (phase === 'closing' ? onClosed() : phase === 'opening' ? onOpened() : undefined)

  return (
    <div className={`fixed inset-0 z-[90] overflow-hidden ${phase === 'open' ? 'pointer-events-none' : ''}`} aria-hidden>
      <motion.div
        className={`${panel} left-0 border-r-4 border-gold`}
        style={{ ...fabric, boxShadow: '12px 0 40px rgba(0,0,0,.5)' }}
        initial={{ x: '-102%' }}
        animate={{ x: closed ? '0%' : '-102%' }}
        transition={{ duration: dur, ease: [0.65, 0, 0.35, 1] }}
        onAnimationComplete={done}
      >
        <div className="absolute right-3 top-1/2 h-20 w-2 -translate-y-1/2 rounded-full bg-gold/80" />
      </motion.div>
      <motion.div
        className={`${panel} right-0 border-l-4 border-gold`}
        style={{ ...fabric, boxShadow: '-12px 0 40px rgba(0,0,0,.5)' }}
        initial={{ x: '102%' }}
        animate={{ x: closed ? '0%' : '102%' }}
        transition={{ duration: dur, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="absolute left-3 top-1/2 h-20 w-2 -translate-y-1/2 rounded-full bg-gold/80" />
      </motion.div>
    </div>
  )
}
