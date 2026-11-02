import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, Car, Flower2, Gem, MapPin, Sparkles, Clock, type LucideIcon } from 'lucide-react'
import type { EventId, WeddingEvent } from '../config/wedding'
import { dayOf, formatDate, monthShort } from '../utils/format'
import { Mandala } from './Ornaments'

export const EVENT_ICONS: Record<EventId, LucideIcon> = { tilak: Sparkles, haldi: Flower2, wedding: Gem, vidai: Car }

const ART: Record<EventId, string> = {
  tilak: 'linear-gradient(135deg,#F5A21B 0%,#D9480F 55%,#8E0A22 100%)',
  haldi: 'linear-gradient(135deg,#FFE066 0%,#F5B301 55%,#C77700 100%)',
  wedding: 'linear-gradient(135deg,#E0233F 0%,#9B0C25 55%,#35000F 100%)',
  vidai: 'linear-gradient(135deg,#F28AA4 0%,#B03060 55%,#4A0F2E 100%)',
}

/** Event picture: uses event.image when supplied, else a gradient illustration with the event icon. */
export function EventArt({ event, className = '' }: { event: WeddingEvent; className?: string }) {
  const Icon = EVENT_ICONS[event.id]
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: event.image ? `center/cover url(${event.image})` : ART[event.id] }} aria-hidden>
      {!event.image && (
        <>
          <Mandala className="absolute -right-6 -top-6 h-40 w-40 spin-slow" opacity={0.35} />
          <Icon className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-ivory/90 drop-shadow-lg float-y" strokeWidth={1.4} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_55%)]" />
        </>
      )}
    </div>
  )
}

/** SCREEN 06 – timeline event card */
export function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const reduce = useReducedMotion()
  const fromLeft = index % 2 === 0
  return (
    <motion.li
      className="relative pl-14 sm:pl-20"
      initial={reduce ? false : { opacity: 0, x: fromLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* timeline dot + date badge */}
      <div className="absolute left-0 top-4 grid h-12 w-12 place-items-center rounded-full border-2 border-gold bg-burgundy text-center leading-none text-ivory shadow-gold sm:h-16 sm:w-16" aria-hidden>
        <span><span className="block font-display text-base font-bold sm:text-xl">{dayOf(event.date)}</span><span className="block font-body text-[9px] uppercase tracking-wider text-champagne sm:text-[10px]">{monthShort(event.date)}</span></span>
      </div>

      <article className="group flex overflow-hidden rounded-2xl border border-gold/60 bg-ivory shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-gold">
        <EventArt event={event} className="w-24 shrink-0 sm:w-48" />
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <h3 className="font-display text-xl font-bold text-burgundy sm:text-2xl">{event.name}</h3>
          <p className="mt-1 flex items-center gap-2 font-body text-sm font-medium text-burgundy/90">
            <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden />
            <time dateTime={event.date}>{formatDate(event.date)}</time>
          </p>
          {event.time && <p className="mt-1 flex items-center gap-2 font-body text-sm text-burgundy/80"><Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />{event.time}</p>}
          <p className="mt-2 flex items-start gap-2 font-body text-sm text-burgundy/75">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            {event.venue ? <span>{event.venue.lines.join(' ')}</span> : <span className="italic">Venue details coming soon</span>}
          </p>
          <p className="mt-2 hidden font-script text-lg italic text-burgundy/70 sm:block">{event.blurb}</p>
        </div>
      </article>
    </motion.li>
  )
}
