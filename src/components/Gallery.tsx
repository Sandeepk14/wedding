import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Heart, Sparkles, Users, X, type LucideIcon } from 'lucide-react'
import { wedding, type GalleryCategory, type GalleryPhoto } from '../config/wedding'
import { Mandala } from './Ornaments'

const CATS: ('All' | GalleryCategory)[] = ['All', 'Couple', 'Family', 'Wedding', 'Memories']
const ICON: Record<GalleryCategory, LucideIcon> = { Couple: Heart, Family: Users, Wedding: Sparkles, Memories: Camera }
const CAT_META: Record<'All' | GalleryCategory, { label: string; Icon?: LucideIcon }> = {
  All: { label: 'All' },
  Couple: { label: 'Couple', Icon: Heart },
  Family: { label: 'Family', Icon: Users },
  Wedding: { label: 'Ceremony', Icon: Sparkles },
  Memories: { label: 'Memories', Icon: Camera },
}
const TINT: Record<GalleryCategory, string> = {
  Couple: 'linear-gradient(135deg,#F28AA4,#B03060 60%,#570019)',
  Family: 'linear-gradient(135deg,#F5B63A,#C4561B 60%,#570019)',
  Wedding: 'linear-gradient(135deg,#E0233F,#8E0A22 60%,#35000F)',
  Memories: 'linear-gradient(135deg,#FFD36B,#D4881B 55%,#7A0B2E)',
}
const ASPECT = { portrait: 'aspect-[3/4]', landscape: 'aspect-[4/3]', square: 'aspect-square' }

/** Real photo when `src` is set, otherwise a tasteful placeholder. */
function Photo({ p, large = false }: { p: GalleryPhoto; large?: boolean }) {
  const [hasError, setHasError] = useState(false)
  const Icon = ICON[p.category]
  if (p.src && !hasError) {
    return (
      <img
        src={p.src}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    )
  }
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden" style={{ background: TINT[p.category] }} role="img" aria-label={`${p.alt} (photo coming soon)`}>
      <Mandala className="absolute -right-10 -top-10 h-3/4 w-3/4" opacity={0.3} />
      <div className="relative text-center text-ivory">
        <Icon className={`mx-auto ${large ? 'h-16 w-16' : 'h-9 w-9'} drop-shadow`} strokeWidth={1.3} aria-hidden />
        <p className={`mt-2 font-script italic ${large ? 'text-3xl' : 'text-lg'}`}>{p.category}</p>
        <p className="font-body text-[10px] uppercase tracking-widest text-ivory/75">Photo coming soon</p>
      </div>
    </div>
  )
}

/** SCREEN 09 – masonry gallery, category filter, lightbox (keyboard + swipe) */
export function Gallery() {
  const reduce = useReducedMotion()
  const [cat, setCat] = useState<'All' | GalleryCategory>('All')
  const [open, setOpen] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)
  const items = useMemo(() => wedding.gallery.filter((p) => cat === 'All' || p.category === cat), [cat])

  const step = useCallback((d: number) => {
    setDir(d)
    setOpen((i) => (i === null ? i : (i + d + items.length) % items.length))
  }, [items.length])

  useEffect(() => {
    if (open === null) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [open, step])

  const cur = open !== null ? items[open] : null

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {CATS.map((c) => {
          const meta = CAT_META[c]
          const TabIcon = meta.Icon
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-body text-sm transition ${
                cat === c
                  ? 'border-burgundy bg-burgundy text-gold shadow'
                  : 'border-gold/70 text-burgundy hover:bg-gold/20'
              }`}
            >
              {TabIcon && <TabIcon className="h-3.5 w-3.5" />}
              <span>{meta.label}</span>
            </button>
          )
        })}
      </div>

      <motion.ul layout className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <motion.li layout key={p.id} className="mb-3 break-inside-avoid sm:mb-4"
              initial={reduce ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.4 }}>
              <button type="button" onClick={() => { setDir(1); setOpen(i) }} aria-label={`Open photo: ${p.alt}`}
                className={`group relative block w-full overflow-hidden rounded-xl border border-gold/60 shadow-card ${ASPECT[p.aspect]}`}>
                <span className="block h-full w-full transition duration-500 group-hover:scale-110"><Photo p={p} /></span>
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-maroon/80 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-body text-xs text-ivory">{p.alt}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {cur && (
          <motion.div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button ref={closeRef} type="button" onClick={() => setOpen(null)} aria-label="Close viewer" className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/60 text-gold hover:bg-gold/15"><X className="h-5 w-5" /></button>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-night/60 text-gold hover:bg-gold/15 sm:left-6"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-night/60 text-gold hover:bg-gold/15 sm:right-6"><ChevronRight className="h-6 w-6" /></button>
            <div className="relative h-[72vh] w-full max-w-3xl overflow-hidden">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div key={cur.id} custom={dir} className="absolute inset-0 overflow-hidden rounded-2xl border border-gold/70"
                  variants={{ enter: (d: number) => ({ x: d * 120, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d * -120, opacity: 0 }) }}
                  initial="enter" animate="center" exit="exit" transition={{ duration: reduce ? 0.01 : 0.35 }}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
                  onDragEnd={(_, info) => { if (info.offset.x < -70) step(1); else if (info.offset.x > 70) step(-1) }}>
                  <Photo p={cur} large />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="absolute bottom-5 left-0 right-0 text-center font-body text-sm text-champagne" aria-live="polite">{cur.alt} · {(open ?? 0) + 1} / {items.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
