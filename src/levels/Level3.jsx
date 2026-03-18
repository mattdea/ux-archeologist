// src/levels/Level3.jsx — Prompt 3
//
// Adds HomeScreen with swipeable icon pages and dock.
// phoneScreen state: 'lock' | 'home'
// Museum layer integration (IntroModal, ObjectiveTracker, DiscoveryCard)
// and NotesApp are added in later prompts.

import { useState, useCallback } from 'react'
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

  const [phoneScreen, setPhoneScreen] = useState('lock') // 'lock' | 'home'
  const [currentPage, setCurrentPage] = useState(0)      // home screen page index

  const handleUnlock = () => setPhoneScreen('home')

  const handleHomePress = useCallback(() => {
    if (phoneScreen === 'home') {
      // Return to page 0 if on another page
      setCurrentPage(0)
    }
  }, [phoneScreen])

  const handleAppOpen = useCallback((appId) => {
    console.log('open', appId)
  }, [])

  const handleSwipePage = useCallback((pageNum) => {
    setCurrentPage(pageNum)
  }, [])

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

              {phoneScreen === 'lock' && (
                <LockScreen onUnlock={handleUnlock} />
              )}

              {phoneScreen === 'home' && (
                <HomeScreen
                  onAppOpen={handleAppOpen}
                  onSwipePage={handleSwipePage}
                  currentPage={currentPage}
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
