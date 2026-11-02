import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import type { CharacterAsset } from '../config/characters'
import { AnimatedCharacter, type Pose } from './AnimatedCharacter'

/** The artwork itself, with a gentle GSAP idle (breathing + tiny sway) that pauses for reduced-motion users. */
function IdleImage({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  const ref = useRef<HTMLImageElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const d = 2 + Math.random() * 0.8
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut', duration: d } })
    gsap.set(el, { transformOrigin: '50% 100%' })
    tl.to(el, { scaleY: 1.016, scaleX: 1.006, rotation: 0.7 })
    return () => { tl.kill(); gsap.set(el, { clearProps: 'transform' }) }
  }, [reduce, src])
  return (
    <img ref={ref} src={src} alt={alt} draggable={false} decoding="async" loading={eager ? 'eager' : 'lazy'}
      className="pointer-events-none h-full w-full select-none object-contain object-bottom drop-shadow-[0_14px_18px_rgba(0,0,0,.35)]" />
  )
}

interface Props {
  asset: CharacterAsset
  /** shown while the character "celebrates" (tap / click) */
  altAsset?: CharacterAsset
  label: string
  pose?: Pose
  entrance?: 'left' | 'right' | 'none'
  delay?: number
  className?: string
  eager?: boolean
}

/** Transparent character image with walking entrance, hover lift, tap-to-celebrate (pose swap + jump + hearts). */
export function CharacterImage({ asset, altAsset, label, pose = 'stand', entrance = 'none', delay = 0, className, eager }: Props) {
  return (
    <AnimatedCharacter label={label} pose={pose} entrance={entrance} delay={delay} aspect={asset.ratio} className={className}>
      {(p) => <IdleImage src={p === 'celebrate' && altAsset ? altAsset.src : asset.src} alt={label} eager={eager} />}
    </AnimatedCharacter>
  )
}
