// src/levels/Level3.jsx
//
// Level 3 — 2007 iPhone / "The Touchscreen"
// Museum layer: IntroModal → boot animation → playing → DiscoveryCard
//
// Phone screen state machine:
//   'lock' | 'unlocking' | 'home' | 'opening' | 'app' | 'closing'
//
// Museum screen state machine:
//   'intro' → 'booting' → 'playing' → 'artifact'

import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './Level3.module.css'
import PhoneFrame from '../components/phone/PhoneFrame'
import LockScreen from '../components/phone/LockScreen'
import HomeScreen from '../components/phone/HomeScreen'
import NotesApp from '../components/notes/NotesApp'
import useArtifactFit from '../hooks/useArtifactFit'
import Catalogue from '../shared/catalogue/Catalogue'
import '../components/phone/phone-theme.css'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import unlockSoundSrc from '../../assets/phone/unlock.mp3'
import lockSoundSrc from '../../assets/phone/lock.mp3'
import IntroModal from '../shared/museum/IntroModal'

function playSound(src) {
  const audio = new Audio(src)
  audio.volume = 0.5
  audio.play().catch(() => {})
}
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import HintPill from '../shared/museum/HintPill'
import useHint from '../shared/museum-ui/useHint'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Slide to unlock',
  'Open a note',
  'Swipe to the second home screen',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  'Drag the arrow all the way to the right',
  'Tap Notes on the home screen, then tap a note',
  'Drag the home screen to the left',
]

// Native bezel dimensions derived from iphone.svg measurements.
// Screen slot: 320×480 px at (32, 131) within this 385×735 frame.
const BEZEL_W = 385
const BEZEL_H = 735

// Matches --bottom-zone-height in Level3.module.css

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[3]

export default function Level3() {
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // ── Museum screen state ──────────────────────────────────────────────────
  // Replay (level already complete): skip the intro card, replay the boot
  // (the phone powers on to its lock screen; see the mount effect below).
  const [museumScreen, setMuseumScreen] = useState(() => isLevelComplete(3) ? 'booting' : 'intro')

  // ── Objectives (independent — no sequential gating) ──────────────────────
  const [objectives, setObjectives] = useState(() => {
    const done = isLevelComplete(3)
    return { slideToUnlock: done, exploreNotes: done, swipePage: done }
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
  const [phonePower, setPhonePower] = useState('off')

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

  const fit = useArtifactFit(BEZEL_W, BEZEL_H)
  const scale = fit.scale

  // ── Boot animation: 'intro' → 'booting' → 'playing' ─────────────────────
  // Called when "Begin Excavation" is clicked.
  // LockScreen's bootPhase prop drives the CSS animation.
  const handleBeginExcavation = useCallback(() => {
    setMuseumScreen('booting')
    // brief pause before boot animation starts, then 450ms for the animation itself
    bootTimers.current.push(setTimeout(() => {
      setPhonePower('booting')
      bootTimers.current.push(setTimeout(() => {
        setMuseumScreen('playing')
        setPhonePower('on')
      }, 450))
    }, 300))
  }, [])

  // Replay: no intro card, so run the boot on mount
  useEffect(() => {
    if (isLevelComplete(3)) handleBeginExcavation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Notify SharedLayout when the artifact is ready for interaction.
  useEffect(() => {
    if (museumScreen === 'playing') notifyArtifactReady()
  }, [museumScreen, notifyArtifactReady])

  // Wire / unwire the HUD Continue button based on play state + completion.
  const allComplete = objectives.slideToUnlock && objectives.exploreNotes && objectives.swipePage
  useEffect(() => {
    if (museumScreen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(3); setMuseumScreen('artifact') })
    } else {
      setContinue(null)
    }
  }, [museumScreen, allComplete, setContinue])

  // Record artifact when discovery card appears.
  useEffect(() => {
    if (museumScreen === 'artifact') {
      addArtifact({
        name: ARTIFACT_NAME,
        era: '2007',
        description: DISCOVERY_DESCRIPTION,
      })
    }
  }, [museumScreen])

  // ── Unlock handler — triggers the 5-phase choreography ─────────────────
  const handleUnlock = useCallback(() => {
    playSound(unlockSoundSrc)
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

  const handleWake = useCallback(() => {
    setPhonePower('booting')
    bootTimers.current.push(setTimeout(() => setPhonePower('on'), 450))
  }, [])

  const handleHomePress = useCallback(() => {
    if (phonePower === 'off') { handleWake(); return }
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
  }, [phoneScreen, transitioning, phonePower, handleWake])

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

  const handleLock = useCallback(() => {
    if (museumScreen !== 'playing') return
    if (phonePower === 'off') { handleWake(); return }
    if (phonePower !== 'on') return
    playSound(lockSoundSrc)
    unlockTimers.current.forEach(clearTimeout)
    unlockTimers.current = []
    appTimers.current.forEach(clearTimeout)
    appTimers.current = []
    setPhonePower('off')
    setPhoneScreen('lock')
    setUnlockPhase(0)
    setCurrentPage(0)
    setTransitioning(false)
  }, [museumScreen, phonePower, handleWake])

  // ── Determine which screens to mount ───────────────────────────────────
  const showLock  = phonePower !== 'off' && (phoneScreen === 'lock' || (phoneScreen === 'unlocking' && unlockPhase < 3))
  const showHome  = phoneScreen === 'unlocking' || phoneScreen === 'home'
                 || phoneScreen === 'opening'   || phoneScreen === 'closing'
  const showApp   = phoneScreen === 'opening' || phoneScreen === 'app' || phoneScreen === 'closing'

  const appAnimCls = phoneScreen === 'opening' ? styles.appEnter
                   : phoneScreen === 'closing' ? styles.appExit
                   : ''

  // Phone pointer events: enabled during 'playing' (black screen wake tap + interaction)
  const phonePointerEvents = museumScreen === 'playing' ? 'auto' : 'none'
  // TouchCursor shows whenever the phone is in the playing state (on or off)
  const cursorEnabled = museumScreen === 'playing'

  // LockScreen boot phase — drives CSS keyframe boot animation on fresh mount
  const lockBootPhase = phonePower === 'booting' ? 'entering' : null

  // ObjectiveTracker — completedIndices derived from objectives object
  const completedIndices = [
    objectives.slideToUnlock,
    objectives.exploreNotes,
    objectives.swipePage,
  ].reduce((acc, done, i) => done ? [...acc, i] : acc, [])
  const hint = useHint(HINTS, { active: museumScreen === 'playing', completedIndices })

  return (
    <>
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

      {museumScreen === 'intro' && (
        <IntroModal
          era="2007"
          title="The Touchscreen"
          description="It's 2007, and this is the original iPhone. Other phones have plastic keyboards, small screens and sometimes a stylus. This one has no stylus, no keys, nothing to learn first. Just a sheet of glass and your finger."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {museumScreen === 'artifact' && (
        <DiscoveryCard
          era="2007"
          artifactName={ARTIFACT_NAME}
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/level/4"
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
            data-artifact
            style={{
              width: BEZEL_W * scale,
              height: BEZEL_H * scale,
              left: fit.left,
              top: fit.top,
              pointerEvents: phonePointerEvents,
            }}
          >
            <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
              <PhoneFrame onHomePress={handleHomePress} onLockPress={handleLock} cursorEnabled={cursorEnabled}>

                {/* Black screen when phone is off — tap to wake */}
                {phonePower === 'off' && (
                  <div
                    style={{ position: 'absolute', inset: 0, background: 'black', zIndex: 10 }}
                    onClick={handleWake}
                  />
                )}

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
            <Catalogue level={3} screen={museumScreen === 'artifact' ? 'discovery' : museumScreen} fit={fit} width={BEZEL_W} height={BEZEL_H} />
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <HintPill docked text={hint} />
        <div data-hud className={`${styles.bottomZone} ${museumScreen === 'playing' ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
