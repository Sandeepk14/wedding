import { useState } from 'react'
import { CalendarDays, MapPin, Navigation, ExternalLink } from 'lucide-react'
import type { WeddingEvent } from '../config/wedding'
import { formatDate } from '../utils/format'
import { mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl } from '../utils/maps'
import { EventArt } from './EventCard'

/** SCREEN 08 – venue card with Google Maps / Directions links and a lazily loaded map */
export function VenueCard({ event }: { event: WeddingEvent }) {
  const [showMap, setShowMap] = useState(false)
  const v = event.venue

  if (!v) {
    return (
      <article className="rounded-3xl border-2 border-dashed border-gold/60 bg-ivory/70 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-burgundy/10 text-burgundy"><MapPin className="h-6 w-6" aria-hidden /></span>
        <h3 className="mt-3 font-display text-xl font-bold text-burgundy">{event.name}</h3>
        <p className="mt-1 flex items-center justify-center gap-2 font-body text-sm text-burgundy/80"><CalendarDays className="h-4 w-4 text-gold" aria-hidden />{formatDate(event.date)}</p>
        <p className="mt-3 font-script text-xl italic text-burgundy/70">Venue details coming soon</p>
      </article>
    )
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-gold/70 bg-ivory shadow-card">
      <div className="relative">
        {showMap ? (
          <iframe title={`Map – ${event.name} venue`} src={mapsEmbedUrl(v)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-56 w-full border-0 sm:h-64" allowFullScreen />
        ) : (
          <div className="relative h-56 sm:h-64">
            <div className="absolute inset-0"><EventArt event={event} className="h-full w-full" /></div>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '36px 36px' }} aria-hidden />
            <div className="absolute inset-0 grid place-items-center">
              <button type="button" onClick={() => setShowMap(true)} className="btn-gold">
                <MapPin className="h-4 w-4" aria-hidden /> Show map
              </button>
            </div>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-md bg-burgundy px-3 py-1 font-royal text-xs font-semibold uppercase tracking-wider text-gold shadow">{event.shortName} Venue</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="flex items-center gap-2 font-body text-sm font-semibold text-burgundy"><CalendarDays className="h-4 w-4 text-gold" aria-hidden />{formatDate(event.date)}</p>
        <p className="mt-2 flex items-start gap-2 font-display text-lg leading-snug text-burgundy">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C4122F]" aria-hidden />
          <span>{v.lines.map((l, i) => <span key={l}>{l}{i < v.lines.length - 1 && <br />}</span>)}</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={mapsSearchUrl(v)} target="_blank" rel="noopener noreferrer" className="btn-gold !px-5 !py-2.5 !text-xs">
            <ExternalLink className="h-4 w-4" aria-hidden /> View on Google Maps
          </a>
          <a href={mapsDirectionsUrl(v)} target="_blank" rel="noopener noreferrer" className="btn-maroon !px-5 !py-2.5 !text-xs">
            <Navigation className="h-4 w-4" aria-hidden /> Get Directions
          </a>
        </div>
      </div>
    </article>
  )
}
