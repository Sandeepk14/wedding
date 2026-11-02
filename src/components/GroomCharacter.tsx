import { characters } from '../config/characters'
import { CharacterImage } from './CharacterImage'
import type { Pose } from './AnimatedCharacter'

type Variant = keyof typeof characters.groom
interface Props { pose?: Pose; variant?: Variant; entrance?: 'left' | 'right' | 'none'; delay?: number; className?: string; eager?: boolean }

/** Pradeep. `pose="wave"` → welcoming-gesture image; tapping swaps to a second pose. */
export function GroomCharacter({ pose = 'stand', variant, ...rest }: Props) {
  const v: Variant = variant ?? (pose === 'wave' ? 'waving' : 'main')
  const alt: Variant = v === 'smiling' ? 'waving' : 'smiling'
  return <CharacterImage asset={characters.groom[v]} altAsset={characters.groom[alt]} label="Pradeep" pose={pose} {...rest} />
}
