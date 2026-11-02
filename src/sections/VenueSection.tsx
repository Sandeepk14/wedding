import { wedding } from '../config/wedding'
import { VenueCard } from '../components/VenueCard'
import { FloralCorner, GoldDivider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

/** SCREEN 08 – Venues */
export function VenueSection() {
  const withVenue = wedding.events.filter((e) => e.venue)
  const pending = wedding.events.filter((e) => !e.venue)
  return (
    <section id="venues" className="relative overflow-hidden px-5 py-24 sm:py-32" style={{ background: 'linear-gradient(180deg,#F1DCC0,#FFF4E3 40%,#F8EBDD)' }}>
      <FloralCorner className="absolute -left-4 -top-4 w-32 sm:w-52" />
      <FloralCorner className="absolute -right-4 -top-4 w-32 sm:w-52" flip />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
          <Reveal><h2 className="section-title burgundy-text">Wedding Locations</h2></Reveal>
          <Reveal delay={0.1}><GoldDivider className="mx-auto my-3 w-40" /></Reveal>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {withVenue.map((e, i) => <Reveal key={e.id} delay={i * 0.12}><VenueCard event={e} /></Reveal>)}
        </div>
        {pending.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pending.map((e, i) => <Reveal key={e.id} delay={i * 0.1}><VenueCard event={e} /></Reveal>)}
          </div>
        )}
      </div>
    </section>
  )
}
