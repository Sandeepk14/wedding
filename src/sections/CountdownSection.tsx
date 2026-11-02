import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { wedding } from '../config/wedding'
import { Countdown } from '../components/Countdown'
import { Fireworks } from '../components/Fireworks'
import { FlowerParticles } from '../components/FlowerParticles'
import { CoupleImage } from '../components/CoupleImage'
import { PalaceSilhouette } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'
import { formatDate } from '../utils/format'

gsap.registerPlugin(ScrollTrigger)

const STARS = Array.from({ length: 46 }, (_, i) => ({ x: (i * 37.3) % 100, y: (i * 53.7) % 55, s: 1 + (i % 3), d: (i % 7) * 0.4 }))

/** SCREEN 07 – Countdown (night palace, fireworks, couple from behind, GSAP parallax) */
export function CountdownSection() {
  const root = useRef<HTMLElement>(null)
  const palace = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !root.current || !palace.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(palace.current, { yPercent: 14 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="countdown" ref={root} className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pb-0 pt-24 text-center"
      style={{ background: 'linear-gradient(180deg,#0B0220 0%,#1E0838 38%,#3A0A33 66%,#570019 100%)' }}>
      {STARS.map((s, i) => (
        <span key={i} className="twinkle absolute rounded-full bg-champagne" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} aria-hidden />
      ))}
      <Fireworks />
      <div ref={palace} className="absolute inset-x-0 bottom-0 h-[50vh]" aria-hidden>
        <PalaceSilhouette className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#2A000C] to-transparent" />
      </div>
      <FlowerParticles petals={10} sparkles={34} />

      <div className="relative z-10 w-full max-w-3xl">
        <Reveal><p className="font-royal text-xs uppercase tracking-[0.35em] text-champagne sm:text-sm">The Big Day Is Coming</p></Reveal>
        <Reveal delay={0.1}><h2 className="gold-text mt-2 font-script text-6xl font-bold italic sm:text-8xl">The Big Day</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-2 font-script text-xl italic text-ivory/90 sm:text-3xl">{wedding.title} are getting married!</p></Reveal>
        <div className="mt-8 sm:mt-10"><Countdown /></div>
        <p className="mt-5 font-body text-xs text-champagne/80 sm:text-sm">
          Counting down to <time dateTime={wedding.weddingDate}>{formatDate(wedding.weddingDate)}</time> · India Standard Time
        </p>
      </div>

      <div className="relative z-10 mt-auto flex items-end justify-center gap-1 pt-6 sm:gap-3" style={{ perspective: 800 }}>
        <CoupleImage variant="back" pose="back" className="h-[34svh] sm:h-[42svh]" />
      </div>
    </section>
  )
}
