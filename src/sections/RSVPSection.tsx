import { RSVPForm } from '../components/RSVPForm'
import { GroomCharacter } from '../components/GroomCharacter'
import { BrideCharacter } from '../components/BrideCharacter'
import { FloralCorner, GoldDivider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

/** SCREEN 10 – RSVP */
export function RSVPSection() {
  return (
    <section id="rsvp" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32" style={{ background: 'radial-gradient(90% 80% at 20% 50%, #FFF4E3 0%, #F8EBDD 55%, #EAD3B4 100%)' }}>
      <FloralCorner className="absolute -left-4 -top-4 w-32 sm:w-52" />
      <FloralCorner className="absolute -right-4 -top-4 w-32 sm:w-52" flip />
      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="order-2 flex items-end justify-center gap-2 lg:order-1">
          <GroomCharacter variant="smiling" className="h-[230px] sm:h-[340px] lg:h-[440px]" />
          <BrideCharacter variant="main" className="h-[215px] sm:h-[320px] lg:h-[415px]" />
        </div>
        <div className="order-1 lg:order-2">
          <div className="mb-6 text-center">
            <Reveal><h2 className="section-title burgundy-text">RSVP</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-1 font-display text-xl font-semibold text-burgundy sm:text-2xl">Will you be joining us?</p></Reveal>
            <Reveal delay={0.15}><GoldDivider className="mx-auto my-3 w-36" /></Reveal>
            <Reveal delay={0.2}><p className="font-body text-sm text-burgundy/75">Please let us know your presence so we can plan better for you.</p></Reveal>
          </div>
          <Reveal delay={0.25}><RSVPForm /></Reveal>
        </div>
      </div>
    </section>
  )
}
