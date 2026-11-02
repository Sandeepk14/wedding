import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
export type Pose = 'stand' | 'wave' | 'celebrate' | 'back'

interface Props {
  label: string
  pose: Pose
  entrance: 'left' | 'right' | 'none'
  delay: number
  /** width / height of the artwork – reserves space so nothing jumps while the image loads */
  aspect?: number
  className?: string
  children: (pose: Pose) => ReactNode
}

/**
 * Shared motion wrapper for Pradeep & Archana:
 * walking entrance → idle (breathing, blinking, head movement live in the SVG CSS)
 * → hover lift → click/tap/Enter triggers a celebration (arms up + jump + hearts).
 */
export function AnimatedCharacter({ label, pose, entrance, delay, aspect, className, children }: Props) {
  const reduce = useReducedMotion()
  const jump = useAnimationControls()
  const [cheer, setCheer] = useState(false)
  const [burst, setBurst] = useState(0)
  const timer = useRef<number>()

  const react = () => {
    if (pose === 'back') return
    setCheer(true)
    setBurst((b) => b + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCheer(false), 2200)
    if (!reduce) void jump.start({ y: [0, -28, 0, -14, 0], transition: { duration: 0.9, ease: 'easeOut' } })
  }

  const dir = entrance === 'left' ? -1 : 1
  const walk = entrance !== 'none' && !reduce

  return (
    <motion.div
      className={className}
      style={aspect ? { aspectRatio: String(aspect) } : undefined}
      initial={walk ? { x: dir * 260, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.9, delay, ease: 'easeOut' }}
    >
      <div className="relative h-full w-full">
      <motion.div
        className="h-full w-full"
        animate={walk ? { y: [0, -10, 0, -10, 0, -10, 0, -10, 0] } : undefined}
        transition={{ duration: 1.9, delay, ease: 'easeInOut' }}
      >
        <motion.div className="h-full w-full" animate={jump} whileHover={reduce || pose === 'back' ? undefined : { scale: 1.025 }}>
          <button
            type="button"
            onClick={react}
            aria-label={pose === 'back' ? `${label} (decorative)` : `${label} – tap to celebrate`}
            tabIndex={pose === 'back' ? -1 : 0}
            className={`block h-full w-full ${pose === 'back' ? 'cursor-default' : 'cursor-pointer'} bg-transparent p-0`}
          >
            {children(cheer && pose !== 'back' ? 'celebrate' : pose)}
          </button>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {burst > 0 && !reduce && (
          <motion.span
            key={burst}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 text-2xl"
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -70, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          >
            ❤️ ✨ ❤️
          </motion.span>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  )
}
