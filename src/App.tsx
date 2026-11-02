import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { wedding } from './config/wedding'
import { MusicContext, useMusicEngine } from './hooks/useMusic'
import { Curtain, type CurtainPhase } from './components/Curtain'
import { Navbar } from './components/Navbar'
import { useGuestInvitation } from './hooks/useGuestInvitation'
import { InvitationExperience } from './components/personalized/InvitationExperience'
import { WelcomeSection } from './sections/WelcomeSection'
import { HeroSection } from './sections/HeroSection'
import { HomeSection } from './sections/HomeSection'
import { StorySection } from './sections/StorySection'
import { FamilySection } from './sections/FamilySection'
import { EventsSection } from './sections/EventsSection'
import { CountdownSection } from './sections/CountdownSection'
import { VenueSection } from './sections/VenueSection'
import { GallerySection } from './sections/GallerySection'
import { RSVPSection } from './sections/RSVPSection'
import { FooterSection } from './sections/FooterSection'

type Stage = 'welcome' | 'hero' | 'site'

export default function App() {
  const music = useMusicEngine(wedding.music.src)
  const [stage, setStage] = useState<Stage>('welcome')
  const [curtain, setCurtain] = useState<CurtainPhase>('open')
  const inv = useGuestInvitation(stage === 'site' && curtain === 'open')

  const openInvitation = useCallback(() => {
    void music.start() // inside the click handler → allowed by browser autoplay policy
    setCurtain('closing')
  }, [music])

  useEffect(() => {
    // Start playback on the very first tap or click anywhere on the page
    const unlockAudio = () => {
      void music.start()
    }
    window.addEventListener('click', unlockAudio, { once: true })
    window.addEventListener('touchstart', unlockAudio, { once: true })
    return () => {
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }
  }, [music])

  useEffect(() => { if (stage === 'site') window.scrollTo(0, 0) }, [stage])

  return (
    <MusicContext.Provider value={music}>
      <a href="#home" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-maroon">Skip to content</a>
      <AnimatePresence mode="wait">
        {stage === 'welcome' && <WelcomeSection key="welcome" onDone={() => setStage('hero')} />}
      </AnimatePresence>
      {stage === 'hero' && <HeroSection onOpen={openInvitation} />}
      {stage === 'site' && (
        <>
          <Navbar invitationLabel={inv.hasGuest ? 'My Invitation' : 'Get Invitation'} onInvitation={inv.openInvitation} />
          <main>
            <HomeSection /><StorySection /><FamilySection /><EventsSection /><CountdownSection />
            <VenueSection /><GallerySection /><RSVPSection />
          </main>
          <FooterSection />
          <InvitationExperience inv={inv} />
        </>
      )}
      <Curtain
        phase={curtain}
        onClosed={() => { setStage('site'); setCurtain('opening') }}
        onOpened={() => setCurtain('open')}
      />
    </MusicContext.Provider>
  )
}
