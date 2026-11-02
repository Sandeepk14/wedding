import { motion } from 'framer-motion'
import { useId } from 'react'

/** Golden envelope with a heart seal. `open` animates the flap and lifts the letter. */
export function Envelope({ open = false, animate = false, className = '' }: { open?: boolean; animate?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '')
  const t = { duration: 0.7, ease: 'easeInOut' as const }
  return (
    <svg viewBox="0 0 220 170" className={className} aria-hidden>
      <defs>
        <linearGradient id={`ev${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FBE49A" /><stop offset="1" stopColor="#D9A82E" /></linearGradient>
        <linearGradient id={`ef${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6D46C" /><stop offset="1" stopColor="#E7B53A" /></linearGradient>
      </defs>
      <rect x="6" y="46" width="208" height="118" rx="8" fill="#C99522" />
      <motion.g initial={false} animate={animate ? { y: open ? -46 : 0 } : { y: 0 }} transition={{ ...t, delay: open ? 0.45 : 0 }}>
        <rect x="24" y="58" width="172" height="96" rx="6" fill="#FFF4E3" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M44 84 H176 M44 100 H150 M44 116 H164" stroke="#D4AF37" strokeWidth="2" opacity=".55" strokeLinecap="round" />
      </motion.g>
      <path d="M6 54 L110 120 L6 164Z" fill={`url(#ev${id})`} />
      <path d="M214 54 L110 120 L214 164Z" fill={`url(#ev${id})`} />
      <path d="M6 164 L110 100 L214 164 Q110 172 6 164Z" fill={`url(#ef${id})`} />
      <motion.path
        d="M6 46 L110 118 L214 46Z" fill={`url(#ef${id})`} stroke="#B8891B" strokeWidth="1.2"
        style={{ originY: 0 }} initial={false} animate={animate ? { scaleY: open ? -0.9 : 1 } : { scaleY: 1 }} transition={t}
      />
      {!open && (
        <g>
          <circle cx="110" cy="112" r="15" fill="#C4122F" stroke="#F6DE8D" strokeWidth="2.5" />
          <path d="M110 121 C100 113 101 105 107 105 C109 105 110 107 110 107 C110 107 111 105 113 105 C119 105 120 113 110 121Z" fill="#FFE9B8" />
        </g>
      )}
    </svg>
  )
}
