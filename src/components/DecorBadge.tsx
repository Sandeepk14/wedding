import { motion, useReducedMotion } from 'framer-motion'
import { characters } from '../config/characters'

type Key = keyof typeof characters.decorations

/** Round animated element from the asset sheet (namaste, aarti, flower shower, heart). */
export function DecorBadge({ name, label, className = 'h-14 w-14', pulse = false }: { name: Key; label: string; className?: string; pulse?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.img
      src={characters.decorations[name].src} alt={label} decoding="async" loading="lazy" draggable={false}
      className={`rounded-full border-2 border-gold object-cover shadow-gold ${className}`}
      animate={reduce ? undefined : pulse ? { scale: [1, 1.12, 1] } : { y: [0, -6, 0] }}
      transition={{ duration: pulse ? 1.2 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
