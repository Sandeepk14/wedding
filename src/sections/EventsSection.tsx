import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { wedding } from '../config/wedding'
import { EventCard } from '../components/EventCard'
import { FloralCorner, GoldDivider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

/** SCREEN 06 – Wedding events / schedule with animated timeline */
export function EventsSection() {
  const list = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  return (
    <section id="events" className="relative overflow-hidden px-5 py-24 sm:py-32" style={{ background: 'linear-gradient(180deg,#F8EBDD,#FFF4E3 50%,#F1DCC0)' }}>
      <FloralCorner className="absolute -left-4 -top-4 w-32 sm:w-56" />
      <FloralCorner className="absolute -right-4 -top-4 w-32 sm:w-56" flip />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-center">
          <Reveal><h2 className="section-title burgundy-text">Wedding Celebrations</h2></Reveal>
          <Reveal delay={0.1}><GoldDivider className="mx-auto my-3 w-40" /></Reveal>
          <Reveal delay={0.15}><p className="font-script text-xl italic text-burgundy/75 sm:text-2xl">Four days of joy, blessings and togetherness</p></Reveal>
        </div>
        <div className="relative mt-14">
          <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-gold/30 sm:left-8" aria-hidden />
          <motion.div className="absolute bottom-6 left-6 top-6 w-0.5 origin-top bg-gradient-to-b from-gold to-burgundy sm:left-8" style={{ scaleY: reduce ? 1 : fill }} aria-hidden />
          <ol ref={list} className="relative space-y-8">
            {wedding.events.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </ol>
        </div>
      </div>
    </section>
  )
}
