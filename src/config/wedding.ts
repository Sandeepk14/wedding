/**
 * SINGLE SOURCE OF TRUTH for every wedding detail.
 * Edit values here – no component hardcodes names, dates or addresses.
 * Anything left empty/null is shown as "coming soon" instead of being invented.
 */

import { characters } from './characters'

export type EventId = 'tilak' | 'haldi' | 'wedding' | 'vidai'

export interface Venue {
  /** Lines shown to guests */
  lines: string[]
  /** Text used to build Google Maps links (no coordinates are invented) */
  mapsQuery: string
}

export interface WeddingEvent {
  id: EventId
  name: string
  shortName: string
  /** ISO date YYYY-MM-DD (displayed as DD Month YYYY) */
  date: string
  /** Optional – only shown when you fill it in, e.g. "11:00 AM" */
  time?: string
  venue: Venue | null
  blurb: string
  /** Optional background photo for the event card (path or URL) */
  image?: string
}

export type GalleryCategory = 'Couple' | 'Family' | 'Wedding' | 'Memories'

export interface GalleryPhoto {
  id: string
  category: GalleryCategory
  /** Put a real photo path/URL here (a file inside public/assets/images/). Empty = elegant placeholder. */
  src?: string
  alt: string
  aspect: 'portrait' | 'landscape' | 'square'
}

export interface FamilyInfo {
  title: string
  subtitle: string
  intro: string
  photo?: string
  /** Add real names here when available, e.g. ['Mr. …', 'Mrs. …'] */
  members: string[]
}

export const wedding = {
  groom: 'Pradeep',
  bride: 'Archana',
  title: 'Pradeep & Archana',
  subtitle: 'A Celebration of Love',
  tagline: 'Two hearts, one beautiful journey.',
  invitationMessage:
    'Together with their families, we joyfully invite you to celebrate the beginning of their beautiful journey.',

  /** Wedding day. Countdown targets midnight (start of the day) in India Standard Time. */
  weddingDate: '2026-11-20',
  timezone: 'Asia/Kolkata',
  countdownTarget: '2026-11-20T00:00:00+05:30',

  events: [
    {
      id: 'tilak',
      name: 'Tilak Ceremony',
      shortName: 'Tilak',
      date: '2026-11-16',
      venue: {
        lines: ['Dihawan, Post Basudeopur,', 'Ghazipur, Uttar Pradesh – 233222'],
        mapsQuery: 'Dihawan, Post Basudeopur, Ghazipur, Uttar Pradesh 233222',
      },
      blurb: 'The auspicious beginning of the celebrations.',
    },
    {
      id: 'haldi',
      name: 'Haldi Ceremony',
      shortName: 'Haldi',
      date: '2026-11-18',
      venue: null,
      blurb: 'A joyful, golden-yellow ritual of blessings.',
    },
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      shortName: 'Wedding',
      date: '2026-11-20',
      venue: {
        lines: ['Beruki, Post Chakara,', 'Mau, Uttar Pradesh'],
        mapsQuery: 'Beruki, Post Chakara, Mau, Uttar Pradesh',
      },
      blurb: 'The sacred union of two souls and two families.',
    },
    {
      id: 'vidai',
      name: 'Vidai Ceremony',
      shortName: 'Vidai',
      date: '2026-11-21',
      venue: null,
      blurb: 'A tender farewell and the start of a new chapter.',
    },
  ] satisfies WeddingEvent[] as WeddingEvent[],

  story: {
    heading: 'Our Story',
    quote: 'Two souls, one beautiful journey.',
    // Placeholder – replace with the couple's real story when available.
    paragraphs: [
      'Pradeep & Archana’s story will be shared here soon.',
      'Until then, we invite you to celebrate the beginning of their lifelong bond with us.',
    ],
  },

  families: {
    groom: {
      title: 'Groom’s Family',
      subtitle: 'Pradeep’s Family',
      intro: 'With joy and blessings, the family of Pradeep welcomes you to share in the celebration.',
      photo: characters.family.groom.src,
      members: [],
    } as FamilyInfo,
    bride: {
      title: 'Bride’s Family',
      subtitle: 'Archana’s Family',
      intro: 'With love and blessings, the family of Archana welcomes you to share in the celebration.',
      photo: characters.family.bride.src,
      members: [],
    } as FamilyInfo,
  },

  gallery: [
    { id: 'm1', category: 'Couple', src: '/assets/gallery/m1-couple-portrait.jpg', alt: 'Pradeep & Archana – Traditional Portrait', aspect: 'portrait' },
    { id: 'm2', category: 'Couple', src: '/assets/gallery/m2-ring-exchange.jpg', alt: 'Ring Exchange & Mehndi Details', aspect: 'landscape' },
    { id: 'm3', category: 'Family', src: '/assets/gallery/m3-haldi-ceremony.jpg', alt: 'Joyful Haldi Celebration', aspect: 'landscape' },
    { id: 'm4', category: 'Wedding', src: '/assets/gallery/m4-wedding-mandap.jpg', alt: 'Royal Wedding Mandap', aspect: 'landscape' },
    { id: 'm5', category: 'Wedding', src: '/assets/gallery/m5-puja-thali.jpg', alt: 'Aarti & Sacred Rituals', aspect: 'square' },
    { id: 'm6', category: 'Family', src: '/assets/gallery/m6-family-blessings.jpg', alt: 'Family Blessings & Togetherness', aspect: 'landscape' },
    { id: 'm7', category: 'Memories', src: '/assets/gallery/m7-hanging-bells.jpg', alt: 'Auspicious Bells & Marigold Garlands', aspect: 'square' },
    { id: 'm8', category: 'Couple', src: '/assets/gallery/m8-couple-romantic.jpg', alt: 'Cherished Romantic Moment', aspect: 'landscape' },
    { id: 'm9', category: 'Wedding', src: '/assets/gallery/m9-floral-walkway.jpg', alt: 'Red Carpet Floral Entryway', aspect: 'square' },
    { id: 'm10', category: 'Memories', src: '/assets/gallery/m10-welcome-board.jpg', alt: 'Pradeep & Archana Welcome Sign', aspect: 'square' },
    { id: 'm11', category: 'Memories', src: '/assets/gallery/m11-venue-palace.jpg', alt: 'Illuminated Palace Venue at Night', aspect: 'landscape' },
  ] as GalleryPhoto[],

  music: {
    title: 'Aaj Se Teri – Padman',
    src: '/assets/music/aaj-se-teri.mp3',
  },

  rsvp: {
    /** Set VITE_RSVP_ENDPOINT in .env to enable real submissions. Empty = clearly-labelled demo mode. */
    endpoint: (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined) ?? '',
    maxGuests: 10,
  },

  invitation: {
    /** Personalized-invitation popup appears this long after the site becomes ready. */
    popupDelayMs: 10000,
    sessionKey: 'pradeep_archana_guest_invitation',
  },

  social: {
    /** Add the couple's Instagram URL; empty keeps the icon as a placeholder. */
    instagram: '',
  },

  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) ?? '',
}

export const mainEvent = wedding.events.find((e) => e.id === 'wedding')!
