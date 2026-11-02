import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { wedding } from '../config/wedding'
import { GroomCharacter } from '../components/GroomCharacter'
import { BrideCharacter } from '../components/BrideCharacter'
import { FlowerParticles } from '../components/FlowerParticles'
import { FloralCorner, Lantern, Mandala, PalaceSilhouette } from '../components/Ornaments'

/** SCREEN 02 – Hero / Landing invitation */
export function HeroSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden"
      style={{ background: 'radial-gradient(110% 80% at 50% 30%, #8A1236 0%, #570019 42%, #2A000C 100%)' }}
      aria-label="Wedding invitation"
    >
      <Mandala className="spin-slow absolute left-1/2 top-[38%] h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2" opacity={0.09} />
      <PalaceSilhouette className="absolute inset-x-0 bottom-0 h-[46vh] w-full opacity-95" />
      <FloralCorner className="absolute -left-3 -top-3 w-36 sm:w-60 lg:w-72" />
      <FloralCorner className="absolute -right-3 -top-3 w-36 sm:w-60 lg:w-72" flip />
      <Lantern className="absolute left-[14%] top-0 h-20 sm:h-32" delay={0.2} />
      <Lantern className="absolute right-[14%] top-0 h-24 sm:h-36" delay={1} />
      <Lantern className="absolute left-[30%] top-0 hidden h-16 sm:block" delay={1.6} />
      <Lantern className="absolute right-[30%] top-0 hidden h-16 sm:block" delay={0.7} />
      <FlowerParticles petals={24} sparkles={34} />

      {/* characters */}
      <GroomCharacter
        pose="stand"
        eager
        entrance="left"
        delay={0.3}
        className="pointer-events-auto absolute bottom-0 left-[1%] z-10 aspect-[200/430] h-[40svh] sm:left-[5%] sm:h-[64svh] lg:left-[10%] lg:h-[80svh]"
      />
      <BrideCharacter
        pose="wave"
        eager
        entrance="right"
        delay={0.5}
        className="pointer-events-auto absolute bottom-0 right-[1%] z-10 aspect-[200/430] h-[37svh] sm:right-[5%] sm:h-[60svh] lg:right-[10%] lg:h-[76svh]"
      />

      {/* invitation text */}
      <div className="relative z-20 mt-20 flex w-full max-w-xl flex-col items-center px-5 text-center sm:mt-24 lg:mt-20">
        <motion.p
          className="font-royal text-[10px] uppercase tracking-[0.32em] text-champagne sm:text-sm"
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
        >
          You are cordially invited to
        </motion.p>
        <motion.p
          className="mt-1 font-royal text-[10px] uppercase tracking-[0.32em] text-champagne/90 sm:text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.9 }}
        >
          The Wedding Celebration of
        </motion.p>
        <motion.h1
          className="mt-3 flex flex-col items-center font-script text-[3.6rem] font-bold italic leading-[0.95] sm:text-8xl lg:text-9xl"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 1.1 }}
        >
          <span className="gold-text">{wedding.groom}</span>
          <span className="my-0.5 text-3xl text-champagne sm:text-5xl" aria-hidden>&amp;</span>
          <span className="gold-text">{wedding.bride}</span>
          <span className="sr-only"> – {wedding.subtitle}</span>
        </motion.h1>
        <motion.p
          className="mt-4 font-script text-lg italic text-ivory/90 sm:text-2xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }}
        >
          {wedding.tagline}
        </motion.p>
        <motion.button
          type="button"
          onClick={onOpen}
          className="btn-gold mt-6 !px-8 !py-3.5 font-royal !text-xs uppercase tracking-[0.2em] sm:mt-8"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.8 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        >
          Open Invitation <Play className="h-4 w-4 fill-current" aria-hidden />
        </motion.button>
      </div>
    </section>
  )
}
