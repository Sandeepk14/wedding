import { forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { wedding } from '../../config/wedding'
import { BrideCharacter } from '../BrideCharacter'
import { CoupleImage } from '../CoupleImage'
import { DecorBadge } from '../DecorBadge'
import { GroomCharacter } from '../GroomCharacter'
import { FloralCorner, GoldDivider, Lantern } from '../Ornaments'
import { FlowerParticles } from '../FlowerParticles'
import { InvitationEventList } from './InvitationEventList'
import type { GuestData } from '../../utils/invitation'

interface Props { guest: GuestData; onRsvp: () => void }

/** STEP 7 – the personalized card. The wrapper (forwarded ref) is what the PNG download captures. */
export const PersonalizedInvitationCard = forwardRef<HTMLDivElement, Props>(function PersonalizedInvitationCard({ guest, onRsvp }, ref) {
  const reduce = useReducedMotion()
  return (
    <div ref={ref} className="relative w-full max-w-4xl px-0 lg:pl-56 lg:pr-8">
      <div className="absolute -left-24 bottom-10 z-10 hidden w-[340px] lg:block xl:-left-32 xl:w-[390px]"><CoupleImage variant="romantic" className="w-full" /></div>
      <Lantern className="pointer-events-none absolute -right-2 -top-8 z-10 hidden h-28 lg:block" delay={0.5} />
      <Lantern className="pointer-events-none absolute right-10 -top-10 z-10 hidden h-20 lg:block" delay={1.2} />

      <motion.article
        aria-label={`Wedding invitation for ${guest.englishName || guest.hindiName}`}
        className="relative overflow-hidden rounded-[30px] border-2 border-gold px-5 pb-8 pt-10 text-center sm:px-10"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, #FFFCF3 0%, #FFF4E3 50%, #F4E1C6 100%)', boxShadow: 'inset 0 0 0 7px #FFF4E3, inset 0 0 0 8.5px rgba(212,175,55,.8), inset 0 0 0 14px rgba(212,175,55,.12), 0 40px 90px -30px rgba(0,0,0,.8)' }}
        initial={reduce ? false : { opacity: 0, y: 50, scale: 0.94, rotateX: 12 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div data-no-export="true" aria-hidden className="pointer-events-none absolute inset-0"><FlowerParticles petals={10} sparkles={8} /></div>
        <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-24 sm:w-36" />
        <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-24 sm:w-36" flip />
        <div className="pointer-events-none absolute -bottom-2 -left-2 w-20 scale-y-[-1] sm:w-28" aria-hidden><FloralCorner /></div>
        <div className="pointer-events-none absolute -bottom-2 -right-2 w-20 rotate-180 sm:w-28" aria-hidden><FloralCorner /></div>
        <Lantern className="pointer-events-none absolute left-[22%] top-0 hidden h-14 sm:block" />
        <Lantern className="pointer-events-none absolute right-[22%] top-0 hidden h-16 sm:block" delay={0.9} />

        <div className="relative">
          <div className="flex justify-center"><DecorBadge name="namaste" label="Namaste" className="h-12 w-12" /></div>
          <p className="mt-1 font-script text-2xl italic text-burgundy/80">— Dear —</p>
          {guest.englishName ? (
            <>
              <h3 className="mt-1 break-words font-script text-5xl font-bold italic leading-tight text-burgundy sm:text-6xl">{guest.englishName}</h3>
              {guest.hindiName && (
                <p lang="hi" className="mt-1 break-words font-deva text-xl font-bold text-burgundy/85 sm:text-2xl">({guest.hindiName})</p>
              )}
            </>
          ) : (
            <h3 lang="hi" className="mt-1 break-words font-deva text-4xl font-bold text-burgundy sm:text-5xl">{guest.hindiName}</h3>
          )}
          <GoldDivider className="mx-auto my-4 w-40" />

          <p className="mx-auto max-w-sm font-body text-base leading-relaxed text-burgundy/85">You are Cordially Invited to the Wedding Celebration of</p>
          <h2 className="mt-3 font-script text-5xl font-bold italic leading-none sm:text-7xl">
            <span className="gold-text-static">{wedding.groom}</span>
            <span className="mx-2 align-middle text-3xl text-[#C4122F] sm:mx-3 sm:text-5xl" aria-label="and">❤️</span>
            <span className="gold-text-static">{wedding.bride}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-script text-xl italic text-burgundy/80 sm:text-2xl">Together with their families, we invite you to celebrate our special moments.</p>

          {/* couple sits inside the card on small screens */}
          <div className="mt-4 flex items-end justify-center gap-3 lg:hidden">
            <GroomCharacter variant="smiling" className="h-40" />
            <BrideCharacter variant="namaste" className="h-[150px]" />
          </div>

          <div className="mt-6"><InvitationEventList /></div>

          <button data-no-export="true" type="button" onClick={onRsvp} className="btn-maroon mt-7 w-full max-w-md !py-4 font-royal text-xs uppercase tracking-[0.14em] sm:text-sm">
            Confirm My Attendance (RSVP) <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </motion.article>
    </div>
  )
})
