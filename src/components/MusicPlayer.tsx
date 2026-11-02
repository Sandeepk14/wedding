import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useMusic } from '../hooks/useMusic'

/** Music toggle (play/pause) + volume popover. State lives in the shared engine, so it survives navigation. */
export function MusicPlayer() {
  const { playing, volume, status, toggle, setVolume } = useMusic()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const unavailable = status === 'unavailable'

  useEffect(() => {
    if (!open) return
    const onDown = (e: Event) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div ref={box} className="relative flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Music volume"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-champagne transition hover:bg-white/10 hover:text-gold"
      >
        <VolIcon className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
        title={unavailable ? 'Music is unavailable right now' : playing ? 'Pause music' : 'Play music'}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-ivory shadow-lg transition hover:brightness-110"
        style={{ background: unavailable ? '#5b3a44' : 'linear-gradient(180deg,#C4122F,#8E0A22)', boxShadow: '0 0 0 1px rgba(212,175,55,.6)' }}
      >
        {playing ? <Pause className="h-[18px] w-[18px]" /> : <Music className="h-[18px] w-[18px]" />}
        {playing && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-gold" aria-hidden />}
      </button>

      {open && (
        <div role="dialog" aria-label="Volume" className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-gold/50 bg-maroon/95 p-4 text-left shadow-card backdrop-blur">
          <label htmlFor="music-volume" className="mb-2 block font-body text-xs font-medium text-champagne">Volume · {Math.round(volume * 100)}%</label>
          <input
            id="music-volume" type="range" min={0} max={1} step={0.05} value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
          {unavailable && <p className="mt-3 font-body text-[11px] leading-snug text-ivory/70">Background music isn’t available right now. The invitation works perfectly without it.</p>}
        </div>
      )}
    </div>
  )
}
