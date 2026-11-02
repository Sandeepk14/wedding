# Pradeep & Archana – Royal Wedding Invitation

React + Vite + TypeScript + Tailwind + Framer Motion + GSAP. 12 screens, fully responsive.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview
```

## Edit details
Everything (names, dates, venues, story, families, gallery photos, music path, Instagram) is in `src/config/wedding.ts`.
- Missing venue → set `venue: null` (shows "Venue details coming soon"). Optional `time: '11:00 AM'` per event.
- Photos: put files in `public/assets/images/` and set `src: '/assets/images/couple-1.jpg'` per gallery item; same for `families.*.photo`.
- Music: add `public/assets/music/wedding-instrumental.mp3` (licensed/own file). Missing file is handled silently.
- RSVP: set `VITE_RSVP_ENDPOINT` in `.env` (accepts JSON POST). Empty = labelled demo mode (nothing saved).
- Share previews: set `VITE_SITE_URL` in `.env` to your live URL before building. `public/og-image.png` is the preview image.

## Deploy
Static site: upload `dist/` to Netlify / Vercel / Cloudflare Pages / GitHub Pages (build command `npm run build`, output `dist`).

## Personalized guest invitation
- 20 s after the site opens (`wedding.invitation.popupDelayMs`) a popup asks for the guest's name in English + Hindi (manual entry, no auto-translation).
- Envelope animation → personalized card → RSVP → thank-you. Share (native / WhatsApp), PNG download, Google Maps buttons, "Change name".
- Names live only in `sessionStorage` (key `pradeep_archana_guest_invitation`), never permanently stored. Reopen via the navbar "My Invitation".
- RSVP uses the existing `src/api/rsvp.ts` (`VITE_RSVP_ENDPOINT`); without it, demo mode is stated on screen.
- Code: `src/components/personalized/`, `src/hooks/useGuestInvitation.ts`, `src/utils/{invitation,validation}.ts`.
- All fonts (incl. Noto Sans Devanagari) are self-hosted via @fontsource so Hindi renders offline and in the PNG.

## Character assets
Individual transparent WebP files cut from the master character sheet live in `public/assets/characters/` (pradeep, archana, couple, family, decorations).
- All paths + aspect ratios are listed in `src/config/characters.ts`; `npm run verify:assets` checks every `/assets/...` path used in `src/` exists.
- To replace any pose with higher-resolution art, overwrite the file with the same name (keep a transparent background) and update its `ratio` in `characters.ts`.
- Extra poses cut beyond your list: `groom`-none, `bride-sitting`, `couple-back`, `couple-pointing`.
