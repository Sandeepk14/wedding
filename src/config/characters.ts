/**
* Character art cut from the supplied master sheet (transparent WebP).
* Every path below exists in public/assets/characters/ – run `npm run verify:assets` after changing anything.
* `ratio` = width / height, used to reserve space (no layout shift).
*/
export interface CharacterAsset { src: string; ratio: number }

export const characters = {
  groom: {
    main: { src: '/assets/characters/pradeep/groom-main.webp', ratio: 0.3267 },
    waving: { src: '/assets/characters/pradeep/groom-waving.webp', ratio: 0.4958 },
    smiling: { src: '/assets/characters/pradeep/groom-smiling.webp', ratio: 0.3280 },
    sitting: { src: '/assets/characters/pradeep/groom-sitting.webp', ratio: 0.7455 },
  },
  bride: {
    main: { src: '/assets/characters/archana/bride-main.webp', ratio: 0.4460 },
    namaste: { src: '/assets/characters/archana/bride-namaste.webp', ratio: 0.4660 },
    smiling: { src: '/assets/characters/archana/bride-smiling.webp', ratio: 0.4881 },
    aarti: { src: '/assets/characters/archana/bride-aarti.webp', ratio: 0.5103 },
    sitting: { src: '/assets/characters/archana/bride-sitting.webp', ratio: 0.7175 },
  },
  couple: {
    main: { src: '/assets/characters/couple/couple-main.webp', ratio: 1.2047 },
    romantic: { src: '/assets/characters/couple/couple-romantic.webp', ratio: 1.1364 },
    dancing: { src: '/assets/characters/couple/couple-dancing.webp', ratio: 1.0169 },
    celebration: { src: '/assets/characters/couple/couple-celebration.webp', ratio: 1.1487 },
    back: { src: '/assets/characters/couple/couple-back.webp', ratio: 0.9468 },
    pointing: { src: '/assets/characters/couple/couple-pointing.webp', ratio: 0.9672 },
  },
  family: {
    groom: { src: '/assets/characters/family/grooms-family.webp', ratio: 2.0471 },
    bride: { src: '/assets/characters/family/brides-family.webp', ratio: 2.0308 },
  },
  decorations: {
    namaste: { src: '/assets/characters/decorations/namaste.webp', ratio: 1.0000 },
    aarti: { src: '/assets/characters/decorations/aarti.webp', ratio: 1.0000 },
    flowerShower: { src: '/assets/characters/decorations/flower-shower.webp', ratio: 1.0000 },
    heart: { src: '/assets/characters/decorations/heart.webp', ratio: 1.0000 },
  },
} satisfies Record<string, Record<string, CharacterAsset>>
