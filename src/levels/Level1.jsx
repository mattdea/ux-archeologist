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
  // Skip intro+boot and go directly to 'playing' on replay (level already complete).
  // Skip intro only (boot still plays) if intro was dismissed this session but not yet finished.
  const [screen, setScreen] = useState(() => {
    if (isLevelComplete(1)) return 'playing'
    const introSeen = sessionStorage.getItem('l1_intro_seen') === '1'
    return introSeen ? 'booting' : 'intro'
  })
  // Restore objectives from this session, or all-complete if level is done.
  const [completedIndices, setCompletedIndices] = useState(() => {
    if (isLevelComplete(1)) return [0, 1, 2]
    try {
      const saved = sessionStorage.getItem('l1_completed')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
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
      setCompletedIndices(prev => {
        if (prev.includes(idx)) return prev
        const next = [...prev, idx]
        sessionStorage.setItem('l1_completed', JSON.stringify(next))
        return next
      })
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
          title="The Desktop"
          description="This is a 1984 Macintosh running System 1. Instead of typing commands, you can point at objects, open folders, and drag files around. See what you can find."
          objectives={OBJECTIVES}
          onBegin={() => { sessionStorage.setItem('l1_intro_seen', '1'); setScreen('booting') }}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1984"
          artifactName="Direct Manipulation"
          description="Before this, using a computer meant memorizing commands and typing them precisely. The Macintosh replaced all of that with objects you could see and manipulate: folders, files, a trash can. Point at something, drag it somewhere, open it with a click. The computer finally spoke in a language people already understood."
          nextUrl="/level/2"
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
              <MonitorBezel>
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
