import { characters } from '../config/characters'
import { CharacterImage } from './CharacterImage'
import type { Pose } from './AnimatedCharacter'

type Variant = keyof typeof characters.bride
interface Props { pose?: Pose; variant?: Variant; entrance?: 'left' | 'right' | 'none'; delay?: number; className?: string; eager?: boolean }

/** Archana. `pose="wave"` → namaste greeting; tapping swaps to a second pose. */
export function BrideCharacter({ pose = 'stand', variant, ...rest }: Props) {
  const v: Variant = variant ?? (pose === 'wave' ? 'namaste' : 'main')
  const alt: Variant = v === 'smiling' ? 'aarti' : 'smiling'
  return <CharacterImage asset={characters.bride[v]} altAsset={characters.bride[alt]} label="Archana" pose={pose} {...rest} />
}
