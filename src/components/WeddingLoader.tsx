import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Animated invitation-preparation progress indicator. Calls onDone at 100%. */
export function WeddingLoader({ onDone, duration = 4200 }: { onDone: () => void; duration?: number }) {
  const reduce = useReducedMotion()
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const total = reduce ? 1200 : duration
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)
      // ease: quick start, slow finish
      setPct(Math.round((1 - Math.pow(1 - t, 2.2)) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(onDone, 450)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = pct < 35 ? 'Preparing Our Special Invitation…' : pct < 75 ? 'Arranging the flowers & lights…' : pct < 100 ? 'Almost ready…' : 'Welcome!'

  return (
    <div className="mx-auto w-full max-w-xs" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Loading invitation">
      <p className="mb-3 text-center font-body text-sm text-ivory/90">{label}</p>
      <div className="h-2.5 overflow-hidden rounded-full border border-gold/60 bg-maroon/70">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#B8891B,#F6DE8D,#D4AF37)', boxShadow: '0 0 12px #D4AF37' }} />
      </div>
      <p className="mt-2 text-right font-body text-xs text-champagne">{pct}%</p>
    </div>
  )
}
