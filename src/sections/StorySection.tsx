import { wedding } from '../config/wedding'
import { CoupleImage } from '../components/CoupleImage'
import { DecorBadge } from '../components/DecorBadge'
import { FloralCorner, GoldDivider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

/** SCREEN 04 – Our Story (placeholder copy lives in config; no relationship history is invented) */
export function StorySection() {
  const s = wedding.story
  return (
    <section id="story" className="relative overflow-hidden px-5 py-24 sm:py-32"
      style={{ background: 'radial-gradient(90% 80% at 30% 40%, #FFF4E3 0%, #F8EBDD 60%, #EAD3B4 100%)' }}>
      <FloralCorner className="absolute -left-4 -top-4 w-36 sm:w-60" />
      <FloralCorner className="absolute -right-4 -top-4 w-36 sm:w-60" flip />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal x={-40}>
          <div className="relative mx-auto w-[min(82vw,440px)]">
            <div className="gold-frame relative aspect-square overflow-hidden rounded-full p-0" style={{ background: 'radial-gradient(circle at 50% 30%, #FFE9B8, #F4C97A 50%, #C77F2A)', boxShadow: '0 0 0 8px #FFF4E3, 0 0 0 10px #D4AF37, 0 30px 60px -20px rgba(87,0,25,.5)' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(87,0,25,.35),transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center"><CoupleImage variant="romantic" className="w-[104%] max-w-none" /></div>
            </div>
            <div className="absolute -right-2 top-4"><DecorBadge name="heart" label="Heart" pulse className="h-14 w-14" /></div>
          </div>
        </Reveal>

        <div className="text-center md:text-left">
          <Reveal><h2 className="section-title burgundy-text">{s.heading}</h2></Reveal>
          <Reveal delay={0.1}><GoldDivider className="mx-auto my-3 w-40 md:mx-0" /></Reveal>
          <Reveal delay={0.15}><p className="font-script text-3xl italic text-burgundy sm:text-4xl">{wedding.groom} &amp; {wedding.bride}</p></Reveal>
          <Reveal delay={0.25}><p className="mt-4 font-script text-2xl italic text-burgundy/80">“{s.quote}”</p></Reveal>
          {s.paragraphs.map((p, i) => (
            <Reveal key={p} delay={0.3 + i * 0.12}><p className="mx-auto mt-4 max-w-md font-body leading-relaxed text-burgundy/80 md:mx-0">{p}</p></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
