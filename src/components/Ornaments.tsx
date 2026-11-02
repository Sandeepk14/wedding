import { useId } from 'react'

/* ---------- Flowers ---------- */
function Marigold({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5)
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {petals.map((a) => <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.22} ry={r * 0.42} fill="#F5A21B" stroke="#D97706" strokeWidth=".6" transform={`rotate(${a})`} />)}
      {petals.map((a) => <ellipse key={`i${a}`} cx="0" cy={-r * 0.38} rx={r * 0.16} ry={r * 0.3} fill="#FFC23D" transform={`rotate(${a + 11})`} />)}
      <circle r={r * 0.2} fill="#C2410C" />
    </g>
  )
}
function Rose({ cx, cy, r, c1 = '#F26B8A', c2 = '#D6336C' }: { cx: number; cy: number; r: number; c1?: string; c2?: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill={c2} />
      <circle r={r * 0.82} fill={c1} />
      <path d={`M${-r * 0.6} 0 A${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.6} 0 A${r * 0.35} ${r * 0.35} 0 0 1 0 ${r * 0.1}`} fill="none" stroke={c2} strokeWidth={r * 0.1} />
      <circle r={r * 0.5} fill={c2} opacity=".55" />
      <path d={`M${-r * 0.3} ${-r * 0.1} A${r * 0.32} ${r * 0.32} 0 1 1 ${r * 0.2} ${r * 0.25}`} fill="none" stroke="#FFD6E0" strokeWidth={r * 0.09} strokeLinecap="round" />
    </g>
  )
}
function Blossom({ cx, cy, r, c = '#FF9FB5' }: { cx: number; cy: number; r: number; c?: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cy={-r * 0.55} rx={r * 0.38} ry={r * 0.55} fill={c} transform={`rotate(${a})`} />)}
      <circle r={r * 0.22} fill="#FFE08A" />
    </g>
  )
}
function Leaf({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) {
  return <path d="M0 0 C10 -18 34 -22 52 -6 C34 12 10 14 0 0Z" fill="#2F7A3C" stroke="#1F5A2B" strokeWidth=".8" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} />
}

export function FloralCorner({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 300 270" className={className} aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <Leaf x={10} y={60} rot={20} s={1.5} /><Leaf x={60} y={20} rot={-10} s={1.4} /><Leaf x={20} y={150} rot={55} s={1.4} />
      <Leaf x={120} y={70} rot={15} s={1.2} /><Leaf x={70} y={130} rot={40} s={1.2} /><Leaf x={140} y={20} rot={-5} s={1.1} />
      <Marigold cx={42} cy={42} r={34} /><Marigold cx={118} cy={30} r={26} /><Marigold cx={30} cy={125} r={28} /><Marigold cx={170} cy={60} r={20} />
      <Rose cx={85} cy={88} r={36} /><Rose cx={158} cy={116} r={22} c1="#E8344E" c2="#B3122F" /><Rose cx={62} cy={178} r={22} c1="#E8344E" c2="#B3122F" /><Rose cx={30} cy={215} r={16} />
      <Blossom cx={215} cy={30} r={14} /><Blossom cx={200} cy={105} r={12} c="#FFB8C8" /><Blossom cx={110} cy={160} r={14} /><Blossom cx={22} cy={252} r={10} c="#FFB8C8" />
      <circle cx="240" cy="55" r="3" fill="#F3D77A" /><circle cx="130" cy="205" r="3" fill="#F3D77A" /><circle cx="250" cy="20" r="2.4" fill="#F3D77A" />
    </svg>
  )
}

/* ---------- Divider ---------- */
export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 20" className={className} aria-hidden>
      <path d="M0 10 H100 M140 10 H240" stroke="#D4AF37" strokeWidth="1" />
      <path d="M120 2 L128 10 L120 18 L112 10Z" fill="#D4AF37" />
      <circle cx="104" cy="10" r="2" fill="#D4AF37" /><circle cx="136" cy="10" r="2" fill="#D4AF37" />
    </svg>
  )
}

/* ---------- Lantern & diya ---------- */
export function Lantern({ className = '', style, delay = 0 }: { className?: string; style?: React.CSSProperties; delay?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 60 150" className={`lantern ${className}`} style={{ animationDelay: `${delay}s`, ...style }} aria-hidden>
      <defs>
        <radialGradient id={`lg${id}`} cx=".5" cy=".5" r=".6"><stop offset="0" stopColor="#FFF1B8" /><stop offset=".6" stopColor="#F5B63A" /><stop offset="1" stopColor="#C97A12" /></radialGradient>
      </defs>
      <line x1="30" y1="0" x2="30" y2="44" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M18 52 Q30 36 42 52Z" fill="#D4AF37" /><rect x="16" y="52" width="28" height="5" rx="2" fill="#B8891B" />
      <path d="M17 57 Q6 82 17 106 H43 Q54 82 43 57Z" fill={`url(#lg${id})`} stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M30 57 V106 M23 57 Q17 82 23 106 M37 57 Q43 82 37 106" stroke="#B8891B" strokeWidth=".9" fill="none" opacity=".7" />
      <rect x="16" y="106" width="28" height="5" rx="2" fill="#B8891B" />
      <path d="M30 111 V128" stroke="#D4AF37" strokeWidth="1.5" /><circle cx="30" cy="132" r="3.2" fill="#D4AF37" />
      <path d="M26 135 L24 148 M30 135 V150 M34 135 L36 148" stroke="#D4AF37" strokeWidth="1.2" />
      <circle cx="30" cy="82" r="30" fill="#FFD36B" className="glow" />
    </svg>
  )
}

export function Diya({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <path d="M4 18 Q30 46 56 18 Q30 26 4 18Z" fill="#C8721A" stroke="#F3D77A" strokeWidth="1.4" />
      <path className="flame" d="M30 17 C22 8 28 3 30 -2 C32 3 38 8 30 17Z" fill="#FFC23D" style={{ transformOrigin: '30px 17px' }} />
      <circle cx="30" cy="12" r="12" fill="#FFB02E" className="glow" />
    </svg>
  )
}

/* ---------- Palace skyline ---------- */
const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`
const dome = (cx: number, y: number, r: number) =>
  `M${cx - r} ${y} C${cx - r} ${y - r * 1.2} ${cx - r * 0.35} ${y - r * 1.5} ${cx} ${y - r * 1.95} C${cx + r * 0.35} ${y - r * 1.5} ${cx + r} ${y - r * 1.2} ${cx + r} ${y} Z`

interface Block { x: number; w: number; h: number; r: number; win: number; tower?: boolean }
const BLOCKS: Block[] = [
  { x: 10, w: 90, h: 110, r: 34, win: 2 }, { x: 120, w: 70, h: 190, r: 26, win: 1, tower: true },
  { x: 210, w: 150, h: 140, r: 44, win: 3 }, { x: 380, w: 80, h: 215, r: 30, win: 1, tower: true },
  { x: 480, w: 240, h: 175, r: 84, win: 5 },
  { x: 740, w: 80, h: 215, r: 30, win: 1, tower: true }, { x: 840, w: 150, h: 140, r: 44, win: 3 },
  { x: 1010, w: 70, h: 190, r: 26, win: 1, tower: true }, { x: 1100, w: 90, h: 110, r: 34, win: 2 },
]

export function PalaceSilhouette({ className = '', glow = true }: { className?: string; glow?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`pb${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A0E2C" /><stop offset="1" stopColor="#2A000C" /></linearGradient>
        <radialGradient id={`pg${id}`} cx=".5" cy="1" r=".7"><stop offset="0" stopColor="#F5B63A" stopOpacity=".55" /><stop offset="1" stopColor="#F5B63A" stopOpacity="0" /></radialGradient>
      </defs>
      {glow && <rect x="0" y="0" width="1200" height="320" fill={`url(#pg${id})`} />}
      {BLOCKS.map((b, i) => {
        const top = 300 - b.h
        const cx = b.x + b.w / 2
        const wins = Array.from({ length: b.win }, (_, k) => {
          const ww = Math.min(22, (b.w - 16) / b.win - 8)
          const gap = (b.w - ww * b.win) / (b.win + 1)
          return b.x + gap + k * (ww + gap)
        })
        const ww = Math.min(22, (b.w - 16) / b.win - 8)
        return (
          <g key={i} stroke="#D4AF37" strokeWidth="1.6" fill={`url(#pb${id})`}>
            <rect x={b.x} y={top} width={b.w} height={b.h + 20} />
            <path d={dome(cx, top, b.r * (b.tower ? 0.55 : 0.5))} />
            <path d={`M${cx} ${top - b.r * 0.97} V${top - b.r * 0.97 - 16}`} />
            <circle cx={cx} cy={top - b.r * 0.97 - 19} r="3" fill="#D4AF37" />
            <rect x={b.x - 4} y={top - 3} width={b.w + 8} height="7" />
            {wins.map((wx, k) => (
              <path key={k} d={arch(wx, top + 20 + (b.tower ? 10 : 0), ww, b.tower ? 46 : 38)} fill="#FFC85A" fillOpacity=".85" stroke="#D4AF37" className="twinkle" style={{ animationDelay: `${(i + k) * 0.35}s` }} />
            ))}
            {b.r > 60 && <path d={arch(cx - 24, 300 - 70, 48, 70)} fill="#FFB02E" fillOpacity=".9" />}
          </g>
        )
      })}
      <rect x="0" y="296" width="1200" height="24" fill="#2A000C" stroke="#D4AF37" strokeWidth="1.4" />
    </svg>
  )
}

/* ---------- Mandala / rangoli ---------- */
export function Mandala({ className = '', opacity = 0.12 }: { className?: string; opacity?: number }) {
  const rings = [
    { n: 12, r: 150, rx: 14, ry: 34 },
    { n: 16, r: 110, rx: 9, ry: 22 },
    { n: 8, r: 70, rx: 12, ry: 26 },
  ]
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden style={{ opacity }}>
      <g fill="none" stroke="#D4AF37" strokeWidth="1.2">
        <circle r="190" strokeDasharray="2 6" /><circle r="172" /><circle r="42" /><circle r="30" />
        {rings.map((ring) =>
          Array.from({ length: ring.n }, (_, i) => (
            <ellipse key={`${ring.r}${i}`} cy={-ring.r} rx={ring.rx} ry={ring.ry} transform={`rotate(${(360 / ring.n) * i})`} />
          )),
        )}
      </g>
    </svg>
  )
}

/* ---------- Arch frame (preloader) ---------- */
export function PalaceArch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 520" className={className} aria-hidden>
      <defs><linearGradient id="archg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6DE8D" /><stop offset="1" stopColor="#B8891B" /></linearGradient></defs>
      <path d="M20 520 V200 Q20 30 200 14 Q380 30 380 200 V520" fill="none" stroke="url(#archg)" strokeWidth="9" />
      <path d="M40 520 V205 Q40 52 200 36 Q360 52 360 205 V520" fill="none" stroke="#D4AF37" strokeWidth="2.5" opacity=".8" />
      <path d="M58 520 V210 Q58 70 200 56 Q342 70 342 210 V520" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3 5" opacity=".7" />
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 12
        return <circle key={i} cx={200 + Math.cos(a) * 172} cy={200 + Math.sin(a) * 178} r="5" fill="#F3D77A" />
      })}
      <path d="M200 -4 V14 M192 4 H208" stroke="#D4AF37" strokeWidth="3" />
    </svg>
  )
}
