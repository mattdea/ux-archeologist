// src/levels/Level1.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Level1.module.css'
import MonitorBezel from '../components/MonitorBezel'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel, isLevelComplete } from '../state/state'
import DesktopScene from '../components/DesktopScene'
import BootSequence from '../components/BootSequence'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Find the document on this computer',
  'Delete the Projects folder',
  'Discover what commands are available',
]

// Maps DesktopScene's string keys → OBJECTIVES array indices
const OBJ_KEY_INDEX = { openFolder: 0, trashFile: 1, useMenu: 2 }

// Bezel pixel dimensions: screen(620×415) + screenBezel pad(14×2) + monitor pad(66/135/177)
// Matches Figma node 10:26 (MonitorBezel 780×755)
const BEZEL_W = 780
const BEZEL_H = 755

// Matches --bottom-zone-height in Level1.module.css
const BOTTOM_ZONE_H = 180

export default function Level1() {
  const navigate = useNavigate()

  // Guard: Level 0 must be complete before playing Level 1.
  useEffect(() => {
    if (!isLevelComplete(0)) {
      navigate('/level/0')
    }
  }, [])

  const [screen, setScreen] = useState(() => isLevelComplete(1) ? 'playing' : 'intro')
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(1) ? [0, 1, 2] : [])
  // Symmetric margins match the equal topSpacer / bottomZone heights
  const scale = useBezelScale(BEZEL_W, BEZEL_H, { marginTop: BOTTOM_ZONE_H, marginBottom: BOTTOM_ZONE_H })
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Notify SharedLayout when the artifact is ready for interaction.
  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  // Wire / unwire the HUD Continue button based on play state + completion.
  const allComplete = completedIndices.length === OBJECTIVES.length
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(1); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

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
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

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

      {/* ── Three-zone layout ─────────────────────────────────────── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — artifact, fills remaining height */}
        <div className={styles.artifactZone}>
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
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <div className={`${styles.bottomZone} ${screen === 'playing' ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
