import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Props { children: ReactNode; delay?: number; y?: number; x?: number; className?: string }

/** Scroll-triggered fade/slide-in (once). */
export function Reveal({ children, delay = 0, y = 28, x = 0, className }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
