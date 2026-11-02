import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  /** number of falling petals on a ~1000px wide screen */
  petals?: number
  sparkles?: number
  className?: string
}

interface P { x: number; y: number; s: number; vy: number; vx: number; rot: number; vr: number; sway: number; ph: number; hue: number; kind: 0 | 1 }

const COLORS = ['#F26B8A', '#E8344E', '#F5A21B', '#FFB8C8', '#D6336C', '#FFC23D']

/** Canvas based (cheap on mobile): continuously falling petals + soft golden sparkles. Pauses off-screen. */
export function FlowerParticles({ petals = 22, sparkles = 28, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduce) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const make = (kind: 0 | 1, initial: boolean): P => ({
      x: Math.random() * (w || 800),
      y: initial ? Math.random() * (h || 600) : -20,
      s: kind === 0 ? 5 + Math.random() * 7 : 1 + Math.random() * 2.2,
      vy: kind === 0 ? 18 + Math.random() * 30 : 6 + Math.random() * 14,
      vx: (Math.random() - 0.5) * 12,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 2.4,
      sway: 14 + Math.random() * 26,
      ph: Math.random() * 6.28,
      hue: Math.floor(Math.random() * COLORS.length),
      kind,
    })

    let items: P[] = []
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const k = Math.min(1, Math.max(0.45, w / 1000))
      items = [
        ...Array.from({ length: Math.round(petals * k) }, () => make(0, true)),
        ...Array.from({ length: Math.round(sparkles * k) }, () => make(1, true)),
      ]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); raf = requestAnimationFrame(tick) } })
    io.observe(canvas)

    function tick(now: number) {
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx!.clearRect(0, 0, w, h)
      for (const p of items) {
        p.y += p.vy * dt
        p.ph += dt
        p.x += (p.vx + Math.sin(p.ph * 1.4) * p.sway) * dt
        p.rot += p.vr * dt
        if (p.y > h + 20 || p.x < -30 || p.x > w + 30) Object.assign(p, make(p.kind, false), { x: Math.random() * w })
        ctx!.save()
        ctx!.translate(p.x, p.y)
        if (p.kind === 0) {
          ctx!.rotate(p.rot)
          ctx!.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.ph * 2)))
          ctx!.fillStyle = COLORS[p.hue]
          ctx!.globalAlpha = 0.9
          ctx!.beginPath()
          ctx!.moveTo(0, -p.s)
          ctx!.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.8, p.s * 0.7, 0, p.s)
          ctx!.bezierCurveTo(-p.s * 0.8, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s)
          ctx!.fill()
        } else {
          const a = 0.35 + 0.65 * Math.abs(Math.sin(p.ph * 1.6))
          const g = ctx!.createRadialGradient(0, 0, 0, 0, 0, p.s * 3)
          g.addColorStop(0, `rgba(255,226,140,${a})`)
          g.addColorStop(1, 'rgba(255,226,140,0)')
          ctx!.fillStyle = g
          ctx!.beginPath(); ctx!.arc(0, 0, p.s * 3, 0, 6.283); ctx!.fill()
        }
        ctx!.restore()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [petals, sparkles, reduce])

  if (reduce) return null
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
