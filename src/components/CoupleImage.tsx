import { characters } from '../config/characters'
import { CharacterImage } from './CharacterImage'
import type { Pose } from './AnimatedCharacter'

type Variant = keyof typeof characters.couple
interface Props { variant?: Variant; altVariant?: Variant; pose?: Pose; entrance?: 'left' | 'right' | 'none'; delay?: number; className?: string; eager?: boolean }

/** Pradeep & Archana together. Size it with width/height classes; tapping swaps to the celebration pose. */
export function CoupleImage({ variant = 'main', altVariant, ...rest }: Props) {
  const alt = altVariant ?? (variant === 'celebration' ? 'romantic' : 'celebration')
  return <CharacterImage asset={characters.couple[variant]} altAsset={characters.couple[alt]} label="Pradeep and Archana" {...rest} />
}
