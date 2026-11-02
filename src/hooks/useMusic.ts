import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export type MusicStatus = 'idle' | 'ready' | 'unavailable'

export interface MusicController {
  playing: boolean
  volume: number
  status: MusicStatus
  /** Must be called from a user gesture (click/tap) the first time. */
  start: () => Promise<void>
  toggle: () => Promise<void>
  setVolume: (v: number) => void
}

export const MusicContext = createContext<MusicController | null>(null)

export function useMusic(): MusicController {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside <MusicContext.Provider>')
  return ctx
}

const VOLUME_KEY = 'wedding-music-volume'

function readVolume(): number {
  try {
    const v = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '')
    if (!Number.isNaN(v)) return Math.min(1, Math.max(0, v))
  } catch { /* storage blocked */ }
  return 0.5
}

/** Owns the single <audio> element so music state survives navigation/section changes. */
export function useMusicEngine(src: string): MusicController {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<MusicStatus>('idle')
  const [volume, setVolumeState] = useState(readVolume)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio()
      a.loop = true
      a.preload = 'none'
      a.volume = readVolume()
      a.addEventListener('error', () => {
        setStatus('unavailable') // file missing / unsupported → fail silently
        setPlaying(false)
      })
      a.addEventListener('playing', () => { setStatus('ready'); setPlaying(true) })
      a.addEventListener('pause', () => setPlaying(false))
      a.src = src
      audioRef.current = a
    }
    return audioRef.current
  }, [src])

  const start = useCallback(async () => {
    try {
      await getAudio().play()
    } catch {
      /* autoplay blocked or file missing – handled by events */
    }
  }, [getAudio])

  const toggle = useCallback(async () => {
    const a = getAudio()
    if (a.paused) await start()
    else a.pause()
  }, [getAudio, start])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
    try { localStorage.setItem(VOLUME_KEY, String(v)) } catch { /* ignore */ }
  }, [])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  return { playing, volume, status, start, toggle, setVolume }
}
