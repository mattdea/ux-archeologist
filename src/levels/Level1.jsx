// src/levels/Level1.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Level1.module.css'
import MacCursor from '../components/MacCursor'
import '../components/era-cursors.css'
import MonitorBezel from '../components/MonitorBezel'
import useArtifactFit from '../hooks/useArtifactFit'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import DesktopScene, { REVEAL_ALL } from '../components/DesktopScene'
import BootSequence from '../components/BootSequence'
import * as sfx from '../audio/sfx'
import IntroModal from '../shared/museum/IntroModal'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import HintPill from '../shared/museum/HintPill'
import useHint from '../shared/museum-ui/useHint'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'
import Catalogue from '../shared/catalogue/Catalogue'

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[1]

const OBJECTIVES = [
  'Open the Notes document',
  'Delete the Projects folder',
  'Choose a command from a menu',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  'Double-click the Notes icon on the desktop',
  'Drag the Projects folder onto the Trash',
  'Click a menu name at the top of the screen, then click a command in black',
]

// Maps DesktopScene's string keys → OBJECTIVES array indices
const OBJ_KEY_INDEX = { openFolder: 0, trashFile: 1, useMenu: 2 }

// Bezel pixel dimensions: screen(620×415) + screenBezel pad(14×2) + monitor pad(66/135/177)
// Matches Figma node 10:26 (MonitorBezel 780×755)
const BEZEL_W = 780
const BEZEL_H = 755

// Matches --bottom-zone-height in Level1.module.css

export default function Level1() {
  // Replay (level already complete): skip the intro card, replay the boot.
  const [screen, setScreen] = useState(() => isLevelComplete(1) ? 'booting' : 'intro')
  // Restore objectives from this session, or all-complete if level is done.
  const [completedIndices, setCompletedIndices] = useState(() => {
    if (isLevelComplete(1)) return [0, 1, 2]
    try {
      const saved = sessionStorage.getItem('l1_completed')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  // Boot reveal step for the real desktop (0 = bare gray, REVEAL_ALL = done).
  const [reveal, setReveal] = useState(0)
  // Floppy in-use LED: on while booting from disk and briefly whenever the
  // Finder reads the disk to open something.
  const [driveBusy, setDriveBusy] = useState(false)
  const driveTimer = useRef(null)
  const pulseDrive = useCallback(() => {
    clearTimeout(driveTimer.current)
    setDriveBusy(true)
    driveTimer.current = setTimeout(() => setDriveBusy(false), 700)
  }, [])
  useEffect(() => () => clearTimeout(driveTimer.current), [])

  // Startup beep as the boot begins (replays too)
  useEffect(() => {
    if (screen === 'booting') sfx.startupBeep()
  }, [screen])
  const finishBoot = useCallback(() => setScreen('playing'), [])

  // The first hint says "on the desktop" only while Notes is there
  const [notesPlace, setNotesPlace] = useState('desktop')
  const hints = notesPlace === 'desktop' ? HINTS : [HINTS[0].replace(' on the desktop', ''), ...HINTS.slice(1)]
  const hint = useHint(hints, { active: screen === 'playing', completedIndices })

  // Fits the artifact around the HUD corners, as large as the viewport allows
  const fit = useArtifactFit(BEZEL_W, BEZEL_H)
  const scale = fit.scale
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

  // Record artifact when discovery card appears
  useEffect(() => {
    if (screen === 'discovery') {
      addArtifact({ name: ARTIFACT_NAME, era: '1984', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

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
          description="It's 1984, and this is the Apple Macintosh. Until now, using a computer has meant memorizing commands. Here everything is where you can see it: files, folders, even a trash can, there to point at and pick up. Hardly anyone has held a mouse, so Apple packed a cassette tape in the box to teach you."
          objectives={OBJECTIVES}
          onBegin={() => setScreen('booting')}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1984"
          artifactName={ARTIFACT_NAME}
          description={DISCOVERY_DESCRIPTION}
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
            data-artifact
            style={{ width: BEZEL_W * scale, height: BEZEL_H * scale, left: fit.left, top: fit.top }}
          >
            <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
              <MonitorBezel driveBusy={driveBusy}>
                <div className={`${styles.inner} ${driveBusy ? styles.innerBusy : ''}`}>
                  <MacCursor busy={driveBusy} />
                  {showDesktop && (
                    <DesktopScene
                      completeObjective={completeObjective}
                      active={screen === 'playing'}
                      reveal={reveal}
                      onDiskAccess={pulseDrive}
                      onNotesPlace={setNotesPlace}
                    />
                  )}
                  {screen === 'booting' && (
                    <BootSequence
                      onComplete={finishBoot}
                      onReveal={setReveal}
                      onDriveBusy={setDriveBusy}
                    />
                  )}
                </div>
              </MonitorBezel>
            </div>
            <Catalogue level={1} screen={screen} fit={fit} width={BEZEL_W} height={BEZEL_H} />
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <HintPill docked text={hint} />
        <div data-hud className={`${styles.bottomZone} ${screen === 'playing' ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
