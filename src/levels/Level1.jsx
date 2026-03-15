// src/levels/Level1.jsx
import { useState, useEffect } from 'react'
import styles from './Level1.module.css'
import MonitorBezel from '../components/MonitorBezel'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel, isLevelComplete } from '../state/state'
import DesktopScene from '../components/DesktopScene'
import BootSequence from '../components/BootSequence'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Find the document on this computer',
  'Delete the Projects folder',
  'Discover what commands are available',
]

// Maps DesktopScene's string keys → OBJECTIVES array indices
const OBJ_KEY_INDEX = { openFolder: 0, trashFile: 1, useMenu: 2 }

// Bezel pixel dimensions: screen(620×415) + screenBezel pad(14×2) + monitor pad(52×2)
const BEZEL_W = 752
const BEZEL_H = 547

export default function Level1() {
  const [screen, setScreen] = useState(() => isLevelComplete(1) ? 'playing' : 'intro')
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(1) ? [0, 1, 2] : [])
  const scale = useBezelScale(BEZEL_W, BEZEL_H, { marginTop: 80 })
  const notifyArtifactReady = useArtifactReady()

  // Notify SharedLayout when the artifact is ready for interaction.
  // Fires once when screen becomes 'playing' — covers both normal flow
  // (after boot sequence) and replay (starts at 'playing' immediately).
  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  const completeObjective = (key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
    }
  }

  // During 'intro' the MonitorBezel renders with an empty (dark/off) screen.
  // DesktopScene only mounts once the boot sequence starts.
  const showDesktop = screen === 'booting' || screen === 'playing' || screen === 'discovery'

  return (
    <>
      {/* ── Museum overlays (position: fixed, cover the full viewport) ── */}

      {screen === 'intro' && (
        <IntroModal
          era="1984"
          title="The Desktop Arrives"
          description="You're looking at the original Macintosh desktop from 1984. Explore the interface and complete the objectives to discover what made it revolutionary."
          objectives={OBJECTIVES}
          onBegin={() => setScreen('booting')}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1984"
          artifactName="Direct Manipulation"
          description="Before 1984, using a computer meant typing commands into a blank screen. The Macintosh let you point at things, drag them around, and open them with a click. You didn't need to learn the computer's language. It learned yours."
          nextUrl="/timeline"
        />
      )}

      {/* ── Monitor ───────────────────────────────────────────────── */}
      {/* Outer wrapper: occupies the scaled footprint in the layout  */}
      {/* Inner scaler: native-size bezel, shrunk via CSS transform   */}
      <div
        className={styles.wrap}
        style={{ width: BEZEL_W * scale, height: BEZEL_H * scale }}
      >
        <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
          <MonitorBezel booting={screen === 'booting'}>
            <div className={styles.inner}>
              {showDesktop && (
                <DesktopScene
                  completeObjective={completeObjective}
                  active={screen === 'playing'}
                />
              )}
              {screen === 'booting' && (
                <BootSequence onComplete={() => setScreen('playing')} />
              )}
            </div>
          </MonitorBezel>
        </div>
      </div>

      {/* ── ObjectiveTracker: fixed in museum space, bottom-left ───── */}
      {screen === 'playing' && (
        <div className={styles.trackerWrap}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
            onContinue={() => { completeLevel(1); setScreen('discovery') }}
          />
        </div>
      )}
    </>
  )
}
