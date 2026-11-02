import { ExternalLink, MapPin } from 'lucide-react'
import { wedding } from '../../config/wedding'
import { formatDate } from '../../utils/format'
import { mapsSearchUrl } from '../../utils/maps'
import { EVENT_ICONS } from '../EventCard'

/** The four ceremonies, straight from config. No times are shown unless configured. */
export function InvitationEventList() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {wedding.events.map((e) => {
        const Icon = EVENT_ICONS[e.id]
        return (
          <li key={e.id} className="rounded-2xl border border-gold/70 bg-white/55 p-4 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-burgundy text-gold"><Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden /></span>
              <div className="min-w-0">
                <h4 className="font-royal text-sm font-bold uppercase tracking-wider text-burgundy">{e.name}</h4>
                <p className="font-body text-sm font-semibold text-burgundy/90"><time dateTime={e.date}>{formatDate(e.date)}</time></p>
                {e.time && <p className="font-body text-xs text-burgundy/70">{e.time}</p>}
                <p className="mt-1 flex items-start gap-1.5 font-body text-xs leading-snug text-burgundy/75">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                  {e.venue ? <span>{e.venue.lines.join(' ')}</span> : <span className="italic">Venue details coming soon.</span>}
                </p>
                {e.venue && (
                  <a data-no-export="true" href={mapsSearchUrl(e.venue)} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-burgundy/50 px-3 py-1 font-body text-[11px] font-semibold text-burgundy transition hover:bg-burgundy hover:text-gold">
                    <ExternalLink className="h-3 w-3" aria-hidden /> View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
