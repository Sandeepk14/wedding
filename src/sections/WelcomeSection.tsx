import { motion } from 'framer-motion'
import { WeddingLoader } from '../components/WeddingLoader'
import { FlowerParticles } from '../components/FlowerParticles'
import { Lantern, Mandala, PalaceArch, PalaceSilhouette, FloralCorner } from '../components/Ornaments'

/** SCREEN 01 – Welcome / Preloader */
export function WelcomeSection({ onDone }: { onDone: () => void }) {
  return (
    <motion.section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 50% 20%, #7A0B2E 0%, #570019 38%, #2A000C 100%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      aria-label="Welcome"
    >
      <Mandala className="spin-slow absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2" opacity={0.1} />
      <PalaceSilhouette className="absolute inset-x-0 bottom-0 h-[24vh] w-full" />
      <FloralCorner className="absolute -left-4 -top-4 w-40 sm:w-64" />
      <FloralCorner className="absolute -right-4 -top-4 w-40 sm:w-64" flip />
      <Lantern className="absolute left-[18%] top-0 h-24 sm:h-36" delay={0.4} />
      <Lantern className="absolute right-[18%] top-0 h-28 sm:h-40" delay={1.1} />
      <Lantern className="absolute left-[34%] top-0 hidden h-20 sm:block" delay={1.7} />
      <Lantern className="absolute right-[34%] top-0 hidden h-20 sm:block" delay={0.8} />
      <FlowerParticles petals={26} sparkles={30} />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 pb-[10svh] text-center">
        <div className="relative mb-4 aspect-[400/520] h-[min(340px,38svh)]">
          <PalaceArch className="absolute inset-0 h-full w-full" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          >
            {/* Ganesha-inspired auspicious motif: lotus + Om */}
            <svg viewBox="-60 -60 120 120" className="h-24 w-24 sm:h-28 sm:w-28" aria-hidden>
              <g fill="none" stroke="#D4AF37" strokeWidth="1.6">
                {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cy="-38" rx="8" ry="17" transform={`rotate(${i * 30})`} />)}
                <circle r="26" /><circle r="22" strokeDasharray="2 3" />
              </g>
              <text x="0" y="12" textAnchor="middle" fontSize="34" fontFamily="'Noto Sans Devanagari', serif" fill="#F3D77A">ॐ</text>
            </svg>
            <p className="gold-text mt-3 font-deva text-xl font-bold sm:text-2xl">॥ श्री गणेशाय नमः ॥</p>
            <p className="mt-1 font-royal text-[10px] uppercase tracking-[0.18em] text-champagne sm:text-[11px]">Shree Ganeshaya Namah</p>
          </motion.div>
        </div>

        <WeddingLoader onDone={onDone} />

        <button type="button" onClick={onDone} className="mt-6 font-body text-xs uppercase tracking-[0.25em] text-champagne/80 underline-offset-4 transition hover:text-gold hover:underline">
          Skip
        </button>
      </div>
    </motion.section>
  )
}
