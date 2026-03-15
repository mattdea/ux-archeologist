// src/levels/Level1.jsx
import { useState } from 'react'
import styles from './Level1.module.css'
import MonitorBezel from '../components/MonitorBezel'
import DesktopScene from '../components/DesktopScene'
import BootSequence from '../components/BootSequence'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'

const OBJECTIVES = [
  'Open the Notes file',
  'Drag the Projects folder to Trash',
  'Use the File menu',
]

// Maps DesktopScene's string keys → OBJECTIVES array indices
const OBJ_KEY_INDEX = { openFolder: 0, trashFile: 1, useMenu: 2 }

export default function Level1() {
  const [screen, setScreen] = useState('intro')
  const [completedIndices, setCompletedIndices] = useState([])

  const completeObjective = (key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
    }
  }

  // Desktop stays mounted during intro (dimmed by IntroModal scrim), booting,
  // playing, and discovery (visible behind the DiscoveryCard overlay).
  const showDesktop = screen === 'intro' || screen === 'booting' || screen === 'playing' || screen === 'discovery'

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
          description="Instead of typing abstract commands, users could act directly on visible objects: open folders, move files, and choose commands from menus. The Macintosh proved that interfaces could mirror physical intuition. You just did it yourself."
          nextUrl="/level/2"
        />
      )}

      {/* ── Monitor + ObjectiveTracker ─────────────────────────────── */}
      <div className={styles.wrap}>
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

        {/* ObjectiveTracker: museum-layer card anchored to bottom-left of Mac screen */}
        {screen === 'playing' && (
          <div className={styles.trackerWrap}>
            <ObjectiveTracker
              objectives={OBJECTIVES}
              completedIndices={completedIndices}
              onContinue={() => setScreen('discovery')}
            />
          </div>
        )}
      </div>
    </>
  )
}
