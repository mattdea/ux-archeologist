// src/levels/Level1.jsx
import { useState } from 'react'
import styles from './Level1.module.css'
import MonitorBezel from '../components/MonitorBezel'
import useBezelScale from '../hooks/useBezelScale'
import DesktopScene from '../components/DesktopScene'
import BootSequence from '../components/BootSequence'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'

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
  const [screen, setScreen] = useState('intro')
  const [completedIndices, setCompletedIndices] = useState([])
  const scale = useBezelScale(BEZEL_W, BEZEL_H)

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
          description="Instead of typing abstract commands, users could act directly on visible objects: open folders, move files, and choose commands from menus. This made personal computing dramatically more legible to ordinary people."
          nextUrl="/level/2"
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
            onContinue={() => setScreen('discovery')}
          />
        </div>
      )}
    </>
  )
}
