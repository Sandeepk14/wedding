import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { wedding } from '../config/wedding'
import { CoupleImage } from '../components/CoupleImage'
import { EVENT_ICONS } from '../components/EventCard'
import { FloralCorner, GoldDivider, Lantern, PalaceSilhouette } from '../components/Ornaments'
import { FlowerParticles } from '../components/FlowerParticles'
import { Reveal } from '../components/Reveal'
import { formatDate } from '../utils/format'

/** SCREEN 03 – Home: couple on the left, invitation text on the right (as in the reference). */
export function HomeSection() {
  const go = () => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden"
      style={{ background: 'radial-gradient(90% 90% at 70% 35%, #8A1236 0%, #570019 48%, #2A000C 100%)' }}>
      <PalaceSilhouette className="absolute inset-x-0 bottom-0 h-[42vh] w-full opacity-80 lg:left-[28%] lg:w-[72%]" />
      <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-[radial-gradient(circle_at_70%_60%,rgba(245,182,58,.28),transparent_60%)] lg:block" aria-hidden />
      <FloralCorner className="absolute -left-3 top-10 w-32 sm:w-52" />
      <FloralCorner className="absolute -right-3 top-10 w-32 sm:w-52" flip />
      <div className="absolute -bottom-3 -right-3 w-36 rotate-180 sm:w-56" aria-hidden><FloralCorner /></div>
      <Lantern className="absolute left-[44%] top-0 hidden h-28 lg:block" delay={0.3} />
      <Lantern className="absolute right-[10%] top-0 hidden h-32 sm:block" delay={1.2} />
      <FlowerParticles petals={14} sparkles={26} />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-0 px-5 pt-24 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div className="order-2 flex items-end justify-center self-end lg:order-1 lg:justify-start">
          <CoupleImage variant="main" eager entrance="left" className="w-[88vw] max-w-[540px] sm:max-w-[620px] lg:w-[46vw] lg:max-w-[740px]" />
        </div>

        <div className="order-1 pb-6 text-center lg:order-2 lg:pb-24">
          <Reveal><p className="font-script text-2xl italic text-ivory sm:text-3xl">Welcome to Our</p></Reveal>
          <Reveal delay={0.1}><h2 className="gold-text font-script text-5xl font-bold italic leading-[1.05] sm:text-7xl">Wedding Celebration</h2></Reveal>
          <Reveal delay={0.15}><p className="font-script text-2xl italic text-champagne">of</p></Reveal>
          <Reveal delay={0.2}>
            <p className="gold-text font-script text-6xl font-bold italic leading-[0.95] sm:text-8xl">{wedding.groom}<br /><span className="text-4xl sm:text-5xl">&amp;</span><br />{wedding.bride}</p>
          </Reveal>
          <Reveal delay={0.25}><GoldDivider className="mx-auto my-3 w-44" /></Reveal>
          <Reveal delay={0.3}><p className="mx-auto max-w-md font-body text-sm leading-relaxed text-ivory/90 sm:text-base">{wedding.invitationMessage}</p></Reveal>

          <ul className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4">
            {wedding.events.map((e, i) => {
              const Icon = EVENT_ICONS[e.id]
              return (
                <motion.li key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 * i, duration: 0.6 }}>
                  <button type="button" onClick={go} className="w-full rounded-2xl border border-gold/50 bg-black/30 px-2 py-3 backdrop-blur-sm transition hover:-translate-y-1 hover:border-gold hover:bg-black/45">
                    <Icon className="float-y mx-auto h-6 w-6 text-gold" strokeWidth={1.5} style={{ animationDelay: `${i * 0.4}s` }} aria-hidden />
                    <span className="mt-1 block font-display text-base font-bold text-ivory">{e.shortName}</span>
                    <span className="block font-body text-[10px] text-champagne">{formatDate(e.date)}</span>
                  </button>
                </motion.li>
              )
            })}
          </ul>
          <button type="button" onClick={go} className="btn-gold mt-6">View Celebrations <ChevronDown className="h-4 w-4" aria-hidden /></button>
        </div>
      </div>
    </section>
  )
}
