import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import { Gallery } from '../components/Gallery'
import { FloralCorner, GoldDivider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'

/** SCREEN 09 – Photo gallery */
export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <section id="gallery" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32" style={{ background: 'linear-gradient(180deg,#F8EBDD,#FFF4E3 50%,#F4E1C6)' }}>
      <FloralCorner className="absolute -left-4 -top-4 w-32 sm:w-52" />
      <FloralCorner className="absolute -right-4 -top-4 w-32 sm:w-52" flip />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
          <Reveal><h2 className="section-title burgundy-text">Our Beautiful Moments</h2></Reveal>
          <Reveal delay={0.1}><GoldDivider className="mx-auto my-3 w-40" /></Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto max-w-2xl font-body text-sm text-burgundy/80 sm:text-base">
              A glimpse of the joyful moments, families, traditions, and celebrations that make our journey so special.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/70 bg-white/70 px-4 py-1.5 font-body text-xs font-medium text-burgundy shadow-sm backdrop-blur-sm transition hover:bg-gold/25 hover:border-burgundy"
              >
                <Maximize2 className="h-3.5 w-3.5 text-gold" />
                <span>View Full Master Collage</span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-8"><Gallery /></div>

        {/* Full-screen Lightbox for the master collage */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Full master moments collage"
              className="fixed inset-0 z-[90] flex items-center justify-center bg-night/95 p-4 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close viewer"
                className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-night/60 text-gold hover:bg-gold/15"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-gold/70 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src="/assets/gallery/our-beautiful-moments.jpg"
                  alt="Our Beautiful Moments – Pradeep & Archana"
                  className="max-h-[85vh] w-full object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
