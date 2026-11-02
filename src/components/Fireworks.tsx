import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string }
const PALETTE = ['#FFD36B', '#FF7A93', '#FFF1B8', '#FFA24A', '#F3D77A']

/** Lightweight canvas fireworks. Runs only while visible; static when reduced motion is preferred. */
export function Fireworks({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduce) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0, visible = false, last = performance.now(), nextBurst = 0
    let sparks: Spark[] = []

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    const burst = () => {
      const x = w * (0.1 + Math.random() * 0.8), y = h * (0.1 + Math.random() * 0.4)
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const n = w < 600 ? 26 : 42
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n, sp = 50 + Math.random() * 90
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 1 + Math.random() * 0.8, c })
      }
    }

    function tick(now: number) {
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      ctx!.clearRect(0, 0, w, h)
      nextBurst -= dt
      if (nextBurst <= 0) { burst(); nextBurst = 0.9 + Math.random() * 1.2 }
      sparks = sparks.filter((s) => s.life < s.max)
      for (const s of sparks) {
        s.life += dt; s.vy += 60 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.99
        ctx!.globalAlpha = Math.max(0, 1 - s.life / s.max)
        ctx!.fillStyle = s.c
        ctx!.beginPath(); ctx!.arc(s.x, s.y, 1.8, 0, 6.283); ctx!.fill()
      }
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); raf = requestAnimationFrame(tick) } })
    io.observe(canvas)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [reduce])

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
