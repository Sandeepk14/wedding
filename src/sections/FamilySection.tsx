import { Users } from 'lucide-react'
import { wedding, type FamilyInfo } from '../config/wedding'
import { FloralCorner, GoldDivider, Mandala } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

function FamilyFrame({ f, delay }: { f: FamilyInfo; delay: number }) {
  return (
    <Reveal delay={delay} className="mx-auto w-full max-w-md">
      <figure className="text-center">
        <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl border-2 border-gold p-2" style={{ background: 'linear-gradient(180deg,#7A0B2E,#3A0412)', boxShadow: 'inset 0 0 0 5px rgba(212,175,55,.2), 0 25px 50px -20px rgba(0,0,0,.7)' }}>
          <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_30%,#9B1B44,#4A0A1F)]">
            {f.photo ? (
              <img src={f.photo} alt={f.subtitle} loading="lazy" decoding="async" className="relative h-auto max-h-full w-full object-contain object-bottom px-2 drop-shadow-[0_10px_14px_rgba(0,0,0,.4)]" />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <Mandala className="absolute inset-0 h-full w-full spin-slow" opacity={0.18} />
                <div className="relative text-center">
                  <Users className="mx-auto h-14 w-14 text-gold/90" strokeWidth={1.2} aria-hidden />
                  <p className="mt-2 font-body text-xs text-champagne/80">Family photo coming soon</p>
                </div>
              </div>
            )}
          </div>
          <FloralCorner className="pointer-events-none absolute -left-3 -top-1 w-20 sm:w-24" />
          <FloralCorner className="pointer-events-none absolute -right-3 -top-1 w-20 sm:w-24" flip />
        </div>
        <figcaption className="relative -mt-5">
          <span className="inline-block rounded-full border-2 border-gold px-6 py-2 text-center shadow-gold" style={{ background: 'linear-gradient(180deg,#F6DE8D,#D4AF37)' }}>
            <span className="block font-display text-lg font-bold leading-tight text-maroon">{f.title}</span>
            <span className="block font-body text-xs text-maroon/80">({f.subtitle})</span>
          </span>
          <p className="mx-auto mt-4 max-w-xs font-body text-sm leading-relaxed text-ivory/85">{f.intro}</p>
          {f.members.length > 0 && (
            <ul className="mt-3 space-y-1 font-script text-xl italic text-champagne">{f.members.map((m) => <li key={m}>{m}</li>)}</ul>
          )}
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** SCREEN 05 – Families (names are editable in config; none are invented) */
export function FamilySection() {
  return (
    <section id="families" className="relative overflow-hidden px-5 py-24 sm:py-32" style={{ background: 'radial-gradient(100% 70% at 50% 0%, #7A0B2E 0%, #570019 50%, #2A000C 100%)' }}>
      <FloralCorner className="absolute -left-4 -top-2 w-32 sm:w-52" />
      <FloralCorner className="absolute -right-4 -top-2 w-32 sm:w-52" flip />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal><h2 className="section-title gold-text">Our Families</h2></Reveal>
        <Reveal delay={0.1}><GoldDivider className="mx-auto my-3 w-40" /></Reveal>
        <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
          <FamilyFrame f={wedding.families.groom} delay={0} />
          <FamilyFrame f={wedding.families.bride} delay={0.15} />
        </div>
      </div>
    </section>
  )
}
