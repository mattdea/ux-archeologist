// src/levels/Level3.jsx
//
// Orchestrates the 5-phase unlock transition:
//   Phase 1 (0-300ms):   Lock screen exits — wallpaper fades, clock slides up, slider slides down
//   Phase 2 (300-400ms): Black pause — screen holds on black, status bar only
//   Phase 3 (400-550ms): Dock fades in (150ms ease-out)
//   Phase 4 (450-800ms): Icons fly in from four corners (250ms ease-out, staggered)
//   Phase 5 (800ms):     Animation complete, interaction enabled
//
// Museum layer integration (IntroModal, ObjectiveTracker, DiscoveryCard)
// and NotesApp are added in later prompts.

import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './Level3.module.css'
import PhoneFrame from '../components/phone/PhoneFrame'
import LockScreen from '../components/phone/LockScreen'
import HomeScreen from '../components/phone/HomeScreen'
import useBezelScale from '../hooks/useBezelScale'
import '../components/phone/phone-theme.css'

// Native bezel dimensions derived from iphone.svg measurements.
// Screen slot: 320×480 px at (32, 131) within this 385×735 frame.
const BEZEL_W = 385
const BEZEL_H = 735
// Render the phone at 80% of the viewport-fitted size
const PHONE_SCALE = 0.8

// Matches --bottom-zone-height in Level3.module.css
const BOTTOM_ZONE_H = 180

export default function Level3() {
  const scale = useBezelScale(BEZEL_W, BEZEL_H, {
    marginTop: BOTTOM_ZONE_H,
    marginBottom: BOTTOM_ZONE_H,
  })

  // ── Phone screen state ──────────────────────────────────────────────────
  const [phoneScreen, setPhoneScreen] = useState('lock')  // 'lock' | 'unlocking' | 'home'
  const [unlockPhase, setUnlockPhase] = useState(0)       // 0-5
  const [currentPage, setCurrentPage] = useState(0)       // home screen page index

  // Timer refs for cleanup
  const unlockTimers = useRef([])

  useEffect(() => {
    return () => unlockTimers.current.forEach(clearTimeout)
  }, [])

  // ── Unlock handler — triggers the 5-phase choreography ─────────────────
  const handleUnlock = useCallback(() => {
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
  }, [])

  // ── Derived animation props for HomeScreen ─────────────────────────────
  const isEntering = phoneScreen === 'unlocking'

  const handleHomePress = useCallback(() => {
    if (phoneScreen === 'home') {
      setCurrentPage(0)
    }
  }, [phoneScreen])

  const handleAppOpen = useCallback((appId) => {
    console.log('open', appId)
  }, [])

  const handleSwipePage = useCallback((pageNum) => {
    setCurrentPage(pageNum)
  }, [])

  // ── Determine which screens to mount ───────────────────────────────────
  // During 'unlocking': both mounted and absolutely stacked (LockScreen on top via z-index).
  // LockScreen unmounts at Phase 3 (400ms) — by then its exit is visually complete.
  const showLock = phoneScreen === 'lock' || (phoneScreen === 'unlocking' && unlockPhase < 3)
  const showHome = phoneScreen === 'unlocking' || phoneScreen === 'home'

  return (
    <div className={styles.levelPage}>

      {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
      <div className={styles.topSpacer} />

      {/* Zone 2 — scaled phone bezel */}
      <div className={styles.artifactZone}>
        <div
          className={styles.wrap}
          style={{ width: BEZEL_W * scale * PHONE_SCALE, height: BEZEL_H * scale * PHONE_SCALE }}
        >
          <div className={styles.scaler} style={{ transform: `scale(${scale * PHONE_SCALE})` }}>
            <PhoneFrame onHomePress={handleHomePress}>

              {/* HomeScreen renders first (behind) — z-index 0 */}
              {showHome && (
                <HomeScreen
                  onAppOpen={handleAppOpen}
                  onSwipePage={handleSwipePage}
                  currentPage={currentPage}
                  entering={isEntering}
                  showDock={unlockPhase >= 3}
                  showIcons={unlockPhase >= 4}
                />
              )}

              {/* LockScreen renders second (on top) — z-index 5.
               * Receives exiting=true during 'unlocking' to trigger exit CSS. */}
              {showLock && (
                <LockScreen
                  onUnlock={handleUnlock}
                  exiting={phoneScreen === 'unlocking'}
                />
              )}

            </PhoneFrame>
          </div>
        </div>
      </div>

      {/* Zone 3 — ObjectiveTracker placeholder (populated in later prompt) */}
      <div className={styles.bottomZone} />

    </div>
  )
}
