// src/levels/Level3.jsx
//
// Level 3 — 2007 iPhone / "Touch Arrives"
// Museum layer: IntroModal → boot animation → playing → DiscoveryCard
//
// Phone screen state machine:
//   'lock' | 'unlocking' | 'home' | 'opening' | 'app' | 'closing'
//
// Museum screen state machine:
//   'intro' → 'booting' → 'playing' → 'artifact'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Level3.module.css'
import PhoneFrame from '../components/phone/PhoneFrame'
import LockScreen from '../components/phone/LockScreen'
import HomeScreen from '../components/phone/HomeScreen'
import NotesApp from '../components/notes/NotesApp'
import useBezelScale from '../hooks/useBezelScale'
import '../components/phone/phone-theme.css'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Slide to unlock',
  'Explore the Notes app',
  'Swipe between screens',
]

// Native bezel dimensions derived from iphone.svg measurements.
// Screen slot: 320×480 px at (32, 131) within this 385×735 frame.
const BEZEL_W = 385
const BEZEL_H = 735
// Render the phone at 80% of the viewport-fitted size
const PHONE_SCALE = 0.8

// Matches --bottom-zone-height in Level3.module.css
const BOTTOM_ZONE_H = 180

const DISCOVERY_DESCRIPTION =
  'For the first time, the interface disappeared. No mouse, no cursor, no abstraction layer. ' +
  'You touched the thing itself. Your finger became the input device, and the screen became the object.'

export default function Level3() {
  const navigate = useNavigate()
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Guard: Level 2 must be complete before playing Level 3.
  useEffect(() => {
    if (!isLevelComplete(2)) {
      navigate('/level/2')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Museum screen state ──────────────────────────────────────────────────
  const [museumScreen, setMuseumScreen] = useState('intro')

  // ── Objectives (independent — no sequential gating) ──────────────────────
  const [objectives, setObjectives] = useState({
    slideToUnlock: false,
    exploreNotes: false,
    swipePage: false,
  })

  const completeObjective = useCallback((key) => {
    setObjectives(prev => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  // ── Phone screen state ──────────────────────────────────────────────────
  // 'lock' | 'unlocking' | 'home' | 'opening' | 'app' | 'closing'
  const [phoneScreen, setPhoneScreen] = useState('lock')
  const [unlockPhase, setUnlockPhase] = useState(0)       // 0-5
  const [currentPage, setCurrentPage] = useState(0)       // home screen page index
  const [transitioning, setTransitioning] = useState(false)
  // Close animation: controls when dock/icons fly back in
  const [closeShowDock, setCloseShowDock] = useState(false)
  const [closeShowIcons, setCloseShowIcons] = useState(false)

  // Timer refs for cleanup
  const unlockTimers = useRef([])
  const appTimers    = useRef([])
  const bootTimers   = useRef([])

  useEffect(() => {
    return () => {
      unlockTimers.current.forEach(clearTimeout)
      appTimers.current.forEach(clearTimeout)
      bootTimers.current.forEach(clearTimeout)
    }
  }, [])

  const scale = useBezelScale(BEZEL_W, BEZEL_H, {
    marginTop: BOTTOM_ZONE_H,
    marginBottom: BOTTOM_ZONE_H,
  })

  // ── Boot animation: 'intro' → 'booting' → 'playing' ─────────────────────
  // Called when "Begin Excavation" is clicked.
  // LockScreen's bootPhase prop drives the CSS animation.
  const handleBeginExcavation = useCallback(() => {
    setMuseumScreen('booting')  // LockScreen enters bootEntering — panels animate in
    bootTimers.current.push(setTimeout(() => {
      setMuseumScreen('playing')
    }, 450))
  }, [])

  // Notify SharedLayout when the artifact is ready for interaction.
  useEffect(() => {
    if (museumScreen === 'playing') notifyArtifactReady()
  }, [museumScreen, notifyArtifactReady])

  // Level 3 transitions automatically (no HUD Continue button).
  useEffect(() => {
    setContinue(null)
  }, [setContinue])

  // ── All objectives complete → show discovery card after 600ms ────────────
  useEffect(() => {
    const allDone = objectives.slideToUnlock && objectives.exploreNotes && objectives.swipePage
    if (allDone && museumScreen === 'playing') {
      const timer = setTimeout(() => setMuseumScreen('artifact'), 600)
      return () => clearTimeout(timer)
    }
  }, [objectives, museumScreen])

  // Record artifact + mark level complete when discovery card appears.
  useEffect(() => {
    if (museumScreen === 'artifact') {
      addArtifact({
        name: 'Direct Touch Interaction',
        era: '2007',
        description: 'The moment computing became physical — touch removed the abstraction between person and machine.',
      })
      completeLevel(3)
    }
  }, [museumScreen])

  // ── Unlock handler — triggers the 5-phase choreography ─────────────────
  const handleUnlock = useCallback(() => {
    completeObjective('slideToUnlock')
    setPhoneScreen('unlocking')
    setUnlockPhase(1) // Phase 1: lock screen exit animations begin (CSS-driven)

    // Phase 2: black pause (lock screen elements have finished animating out)
    unlockTimers.current.push(setTimeout(() => setUnlockPhase(2), 300))

    // Phase 3: dock fades in
    unlockTimers.current.push(setTimeout(() => setUnlockPhase(3), 400))

    // Phase 4: icons fly in from corners
    unlockTimers.current.push(setTimeout(() => setUnlockPhase(4), 450))

    // Phase 5: animation complete — transition to 'home', enable interaction
    unlockTimers.current.push(setTimeout(() => {
      setUnlockPhase(5)
      setPhoneScreen('home')
    }, 800))
  }, [completeObjective])

  // ── Derived animation props for HomeScreen ─────────────────────────────
  const isEntering = phoneScreen === 'unlocking' || phoneScreen === 'closing'
  const isExiting  = phoneScreen === 'opening'

  const homeShowDock  = phoneScreen === 'unlocking' ? unlockPhase >= 3
                      : phoneScreen === 'closing'   ? closeShowDock
                      : true
  const homeShowIcons = phoneScreen === 'unlocking' ? unlockPhase >= 4
                      : phoneScreen === 'closing'   ? closeShowIcons
                      : true

  const handleHomePress = useCallback(() => {
    if (transitioning) return
    if (phoneScreen === 'home') {
      setCurrentPage(0)
    } else if (phoneScreen === 'app') {
      // Close animation: app shrinks, home flies back in
      setTransitioning(true)
      setCloseShowDock(false)
      setCloseShowIcons(false)
      setPhoneScreen('closing')

      // After 100ms: dock and icons fly back in
      appTimers.current.push(setTimeout(() => {
        setCloseShowDock(true)
        setCloseShowIcons(true)
      }, 100))

      // After 400ms: fully on home screen
      appTimers.current.push(setTimeout(() => {
        setPhoneScreen('home')
        setTransitioning(false)
      }, 400))
    }
  }, [phoneScreen, transitioning])

  const handleAppOpen = useCallback((appId) => {
    if (transitioning || appId !== 'notes') return
    setTransitioning(true)
    setPhoneScreen('opening')  // HomeScreen exiting, app entering

    // After 350ms: animation complete — remove home screen, show app
    appTimers.current.push(setTimeout(() => {
      setPhoneScreen('app')
      setTransitioning(false)
    }, 350))
  }, [transitioning])

  const handleSwipePage = useCallback((pageNum) => {
    setCurrentPage(pageNum)
    completeObjective('swipePage')
  }, [completeObjective])

  const handleNoteOpen = useCallback(() => {
    completeObjective('exploreNotes')
  }, [completeObjective])

  // ── Determine which screens to mount ───────────────────────────────────
  const showLock  = phoneScreen === 'lock' || (phoneScreen === 'unlocking' && unlockPhase < 3)
  const showHome  = phoneScreen === 'unlocking' || phoneScreen === 'home'
                 || phoneScreen === 'opening'   || phoneScreen === 'closing'
  const showApp   = phoneScreen === 'opening' || phoneScreen === 'app' || phoneScreen === 'closing'

  const appAnimCls = phoneScreen === 'opening' ? styles.appEnter
                   : phoneScreen === 'closing' ? styles.appExit
                   : ''

  // Phone is only interactive during 'playing' museum state
  const phoneInteractive = museumScreen === 'playing'

  // LockScreen boot phase — drives CSS boot animation
  const lockBootPhase = museumScreen === 'intro'    ? 'dark'
                      : museumScreen === 'booting'  ? 'entering'
                      : null

  // ObjectiveTracker — completedIndices derived from objectives object
  const completedIndices = [
    objectives.slideToUnlock,
    objectives.exploreNotes,
    objectives.swipePage,
  ].reduce((acc, done, i) => done ? [...acc, i] : acc, [])

  return (
    <>
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

      {museumScreen === 'intro' && (
        <IntroModal
          era="2007"
          title="Touch Arrives"
          description="For thirty years, a layer of abstraction stood between people and their computers — a mouse, a cursor, a keyboard. Then the glass became the interface."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {museumScreen === 'artifact' && (
        <DiscoveryCard
          era="2007"
          artifactName="Direct Touch Interaction"
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/timeline"
        />
      )}

      {/* ── Three-zone layout ─────────────────────────────────────── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — scaled phone bezel */}
        <div className={styles.artifactZone}>
          <div
            className={styles.wrap}
            style={{
              width: BEZEL_W * scale * PHONE_SCALE,
              height: BEZEL_H * scale * PHONE_SCALE,
              pointerEvents: phoneInteractive ? 'auto' : 'none',
            }}
          >
            <div className={styles.scaler} style={{ transform: `scale(${scale * PHONE_SCALE})` }}>
              <PhoneFrame onHomePress={handleHomePress} cursorEnabled={phoneInteractive}>

                {/* HomeScreen renders first (behind) — z-index 0 */}
                {showHome && (
                  <HomeScreen
                    onAppOpen={handleAppOpen}
                    onSwipePage={handleSwipePage}
                    currentPage={currentPage}
                    entering={isEntering}
                    exiting={isExiting}
                    showDock={homeShowDock}
                    showIcons={homeShowIcons}
                  />
                )}

                {/* LockScreen renders second (on top) — z-index 5.
                 * bootPhase drives the power-on CSS animation.
                 * exiting=true during 'unlocking' triggers exit CSS. */}
                {showLock && (
                  <LockScreen
                    onUnlock={handleUnlock}
                    exiting={phoneScreen === 'unlocking'}
                    bootPhase={lockBootPhase}
                  />
                )}

                {/* App — wrapped in an animation div for scale-in/scale-out */}
                {showApp && (
                  <div className={`${styles.appWrapper} ${appAnimCls}`}>
                    <NotesApp onNoteOpen={handleNoteOpen} />
                  </div>
                )}

              </PhoneFrame>
            </div>
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <div className={`${styles.bottomZone} ${museumScreen === 'playing' ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
