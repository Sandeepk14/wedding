import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Check, Copy, FileSpreadsheet, Lock, Share2 } from 'lucide-react'
import { wedding } from '../config/wedding'
import { EVENT_ICONS } from '../components/EventCard'
import { FlowerParticles } from '../components/FlowerParticles'
import { InstagramIcon, WhatsAppIcon } from '../components/icons'
import { DecorBadge } from '../components/DecorBadge'
import { Diya, Lantern, PalaceSilhouette } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'
import { copyInviteLink, nativeShare, whatsappShareUrl } from '../utils/share'
import { dayOf, formatDate, monthShort } from '../utils/format'
import { ExcelDownloadModal } from '../components/ExcelDownloadModal'

/** SCREEN 11 – Footer / final celebration */
export function FooterSection() {
  const [toast, setToast] = useState('')
  const [copied, setCopied] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const timer = useRef<number>()
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const say = (m: string) => { setToast(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(''), 2600) }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    const ok = await copyInviteLink()
    setCopied(ok); say(ok ? 'Invitation link copied!' : 'Could not copy – please copy the address bar link.')
    if (ok) window.setTimeout(() => setCopied(false), 2000)
  }
  const ig = wedding.social.instagram
  const circle = 'grid h-12 w-12 place-items-center rounded-full border border-gold/70 text-ivory transition hover:-translate-y-1 hover:bg-gold/20'

  return (
    <footer id="footer" className="relative overflow-hidden px-5 pb-20 pt-24 text-center" style={{ background: 'linear-gradient(180deg,#570019 0%,#3A0412 55%,#19050D 100%)' }}>
      <PalaceSilhouette className="absolute inset-x-0 bottom-0 h-[20vh] w-full opacity-35" />
      <Lantern className="absolute left-[8%] top-0 h-24 sm:h-32" delay={0.2} />
      <Lantern className="absolute right-[8%] top-0 h-28 sm:h-36" delay={0.9} />
      <FlowerParticles petals={12} sparkles={24} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal><h2 className="gold-text font-script text-4xl font-bold italic leading-tight sm:text-6xl">We Look Forward to<br />Celebrating With You!</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-4 font-royal text-lg tracking-[0.2em] text-champagne sm:text-xl">{wedding.title}</p></Reveal>
        <Reveal delay={0.15}><p className="mt-1 font-body text-sm text-ivory/85">{formatDate(wedding.weddingDate)}</p></Reveal>

        <ul className="mx-auto mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wedding.events.map((e, i) => {
            const Icon = EVENT_ICONS[e.id]
            return (
              <li key={e.id} className="list-none">
                <Reveal delay={i * 0.08} className="h-full rounded-2xl border border-gold/50 bg-black/30 px-3 py-4 backdrop-blur-sm">
                  <Icon className="mx-auto h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden />
                  <p className="mt-2 font-display text-2xl font-bold text-ivory">{dayOf(e.date)} <span className="text-base text-champagne">{monthShort(e.date)}</span></p>
                  <p className="font-body text-sm font-medium text-ivory">{e.shortName}</p>
                  <p className="mt-0.5 min-h-[2.4em] font-body text-[11px] leading-snug text-champagne/80">{e.venue ? e.venue.lines[e.venue.lines.length - 1] : 'Venue details coming soon'}</p>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6">
          {[0, 1].map((i) => <Diya key={i} className="w-9 sm:w-12" />)}
          <DecorBadge name="aarti" label="Aarti" className="h-16 w-16" />
          {[2, 3].map((i) => <Diya key={i} className="w-9 sm:w-12" />)}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-8 font-royal text-xs uppercase tracking-[0.3em] text-champagne">Share the Invitation</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a href={whatsappShareUrl()} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className={`${circle} !border-[#25D366]/80 text-[#25D366] hover:!bg-[#25D366]/15`}><WhatsAppIcon className="h-6 w-6" /></a>
            <button type="button" onClick={copy} aria-label="Copy invitation link" className={circle}>{copied ? <Check className="h-5 w-5 text-gold" /> : <Copy className="h-5 w-5" />}</button>
            {canShare && <button type="button" onClick={() => void nativeShare()} aria-label="Share invitation" className={circle}><Share2 className="h-5 w-5" /></button>}
            {ig ? (
              <a href={ig} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={circle}><InstagramIcon /></a>
            ) : (
              <button type="button" onClick={() => say('Instagram link will be added soon.')} aria-label="Instagram (coming soon)" className={circle}><InstagramIcon /></button>
            )}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setAdminModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/70 bg-black/40 px-5 py-2.5 font-body text-xs font-semibold text-champagne backdrop-blur transition hover:border-gold hover:bg-gold/20 hover:text-ivory"
            aria-label="Download guest list as Excel file"
          >
            <FileSpreadsheet className="h-4 w-4 text-gold" />
            <span>Download Guest List (Excel)</span>
            <Lock className="h-3 w-3 text-gold/70" />
          </button>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-ghost">
            <ArrowUp className="h-4 w-4" aria-hidden /> Back to top
          </button>
        </div>
        <p className="mt-8 font-body text-xs text-ivory/50">{wedding.title} · {wedding.subtitle}</p>
      </div>

      <ExcelDownloadModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onNotify={say}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="rounded-full border border-gold bg-maroon px-5 py-2.5 font-body text-sm text-ivory shadow-gold">{toast}</motion.p>}
        </AnimatePresence>
      </div>
    </footer>
  )
}
