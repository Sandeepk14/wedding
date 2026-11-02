import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, CalendarDays, Heart, Home, Images, Mail, MapPin, Menu, Send, Timer, Users, X } from 'lucide-react'
import { MusicPlayer } from './MusicPlayer'
import { wedding } from '../config/wedding'

const TOP = [
  { id: 'home', label: 'Home' }, { id: 'story', label: 'Story' }, { id: 'events', label: 'Events' },
  { id: 'gallery', label: 'Gallery' }, { id: 'rsvp', label: 'RSVP' },
]
const DRAWER = [
  { id: 'home', label: 'Home', Icon: Home }, { id: 'story', label: 'Our Story', Icon: Heart },
  { id: 'families', label: 'Families', Icon: Users }, { id: 'events', label: 'Events', Icon: CalendarDays },
  { id: 'countdown', label: 'Countdown', Icon: Timer }, { id: 'venues', label: 'Venue', Icon: MapPin },
  { id: 'gallery', label: 'Gallery', Icon: Images }, { id: 'rsvp', label: 'RSVP', Icon: Send },
]
const IDS = DRAWER.map((d) => d.id)

interface NavProps { invitationLabel: string; onInvitation: () => void }

export function Navbar({ invitationLabel, onInvitation }: NavProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), open ? 250 : 0)
  }

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-maroon/90 shadow-lg backdrop-blur-md' : 'bg-gradient-to-b from-night/70 to-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <button type="button" onClick={() => go('home')} className="relative -mb-5 mt-1 shrink-0" aria-label={`${wedding.title} – back to top`}>
            <svg viewBox="0 0 60 72" className="h-14 w-12 drop-shadow-lg sm:h-[62px] sm:w-[52px]" aria-hidden>
              <defs><linearGradient id="emb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6DE8D" /><stop offset="1" stopColor="#B8891B" /></linearGradient></defs>
              <path d="M30 2 L56 12 V38 Q56 58 30 70 Q4 58 4 38 V12Z" fill="#570019" stroke="url(#emb)" strokeWidth="3" />
              <path d="M30 8 L50 16 V38 Q50 53 30 63 Q10 53 10 38 V16Z" fill="none" stroke="#D4AF37" strokeWidth="1" opacity=".7" />
              <text x="30" y="40" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontWeight="700" fontSize="22" fill="#F3D77A">P<tspan fill="#E8344E" fontSize="12">♥</tspan>A</text>
            </svg>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {TOP.map((l) => (
              <button
                key={l.id} type="button" onClick={() => go(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`relative rounded-full px-4 py-2 font-body text-sm transition ${active === l.id ? 'text-gold' : 'text-ivory/85 hover:text-gold'}`}
              >
                {l.label}
                {active === l.id && <motion.span layoutId="navdot" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded bg-gold" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onInvitation} className="btn-ghost hidden !px-3 !py-2 md:inline-flex lg:!px-4"><Mail className="h-4 w-4" aria-hidden /> {invitationLabel}</button>
            <MusicPlayer />
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-xl border border-gold/50 text-gold md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} tabIndex={-1} />
            <motion.aside
              role="dialog" aria-modal="true" aria-label="Menu"
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col border-l border-gold/50 p-6"
              style={{ background: 'linear-gradient(180deg,#570019,#2A000C)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.35 }}
            >
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-gold/60 text-gold">
                <X className="h-5 w-5" />
              </button>
              <p className="gold-text mt-2 font-script text-3xl font-bold italic">{wedding.title}</p>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Menu">
                {DRAWER.map(({ id, label, Icon }) => (
                  <button key={id} type="button" onClick={() => go(id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-body text-[15px] transition ${active === id ? 'bg-gold/15 text-gold' : 'text-ivory/90 hover:bg-white/5'}`}>
                    <Icon className="h-[18px] w-[18px]" /> {label}
                  </button>
                ))}
              </nav>
              <button type="button" onClick={() => { setOpen(false); onInvitation() }} className="btn-gold mt-4"><Mail className="h-4 w-4" aria-hidden /> {invitationLabel}</button>
              <p className="mt-auto flex items-center gap-2 font-body text-xs text-champagne/70"><BookOpen className="h-3.5 w-3.5" /> {wedding.subtitle}</p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
