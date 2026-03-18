// src/levels/Level3.jsx — Stub (Prompt 2)
//
// Adds phoneScreen state: 'lock' | 'home'
// Museum layer integration (IntroModal, ObjectiveTracker, DiscoveryCard)
// and HomeScreen/NotesApp are added in later prompts.

import { useState } from 'react'
import styles from './Level3.module.css'
import PhoneFrame from '../components/phone/PhoneFrame'
import LockScreen from '../components/phone/LockScreen'
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

  const handleUnlock = () => setPhoneScreen('home')

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
            <PhoneFrame onHomePress={() => console.log('Home pressed')}>

              {phoneScreen === 'lock' && (
                <LockScreen onUnlock={handleUnlock} />
              )}

              {phoneScreen === 'home' && (
                /* Placeholder — replaced by HomeScreen in Prompt 3 */
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--phone-wallpaper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--phone-font)',
                  fontSize: 16,
                  letterSpacing: '0.5px',
                }}>
                  Home Screen
                </div>
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
