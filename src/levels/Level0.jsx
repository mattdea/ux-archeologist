// src/levels/Level0.jsx
import { useState, useEffect } from 'react'
import styles from './Level0.module.css'
import TerminalBezel from '../components/terminal/TerminalBezel'
import TerminalScreen from '../components/terminal/TerminalScreen'
import useTerminal from '../components/terminal/useTerminal'
import * as sfx from '../audio/sfx'
import useArtifactFit from '../hooks/useArtifactFit'
import Catalogue from '../shared/catalogue/Catalogue'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import IntroModal from '../shared/museum/IntroModal'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import HintPill from '../shared/museum/HintPill'
import useHint from '../shared/museum-ui/useHint'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Read the notes file',
  'Read your mail',
  'Look up a command in the manual',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  'Type ls and press Return to list your files, then type cat notes.txt to read one',
  'Type mail and press Return',
  "Type man and a command's name, such as man ls",
]

// Bezel pixel dimensions — must match .bezel in TerminalBezel.module.css
const BEZEL_W = 780
const BEZEL_H = 460   // must match TerminalBezel.module.css

// Matches --bottom-zone-height in Level0.module.css

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[0]

export default function Level0() {
  // 'intro' → 'booting' → 'playing' → 'discovery'
  // Replay (level already complete): skip the intro card, replay the boot.
  const [screen, setScreen] = useState(() => isLevelComplete(0) ? 'booting' : 'intro')
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(0) ? [0, 1, 2] : [])
  const hint = useHint(HINTS, { active: screen === 'playing', completedIndices })

  const fit = useArtifactFit(BEZEL_W, BEZEL_H)
  const scale = fit.scale
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  const completeObjective = (index) => {
    setCompletedIndices(prev => prev.includes(index) ? prev : [...prev, index])
  }

  const terminal = useTerminal({
    onObjectiveComplete: completeObjective,
    completedIndices,
  })

  // Start the boot sequence when screen enters 'booting'.
  // onComplete transitions to 'playing', which is when HUD elements appear.
  // terminal.startBoot uses stable refs internally — intentionally excluded from deps.
  // The power-up self-test rings the bell once during its keyboard check
  // (VT100 Technical Manual §4.2.8): 600ms in, before
  // the first boot line at 1000ms (placement reconstructed).
  useEffect(() => {
    if (screen !== 'booting') return
    const bellTimer = setTimeout(() => sfx.bell(), 600)
    terminal.startBoot(() => setScreen('playing'))
    return () => clearTimeout(bellTimer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  // Notify SharedLayout when the artifact is ready for interaction.
  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  // Wire / unwire the HUD Continue button based on play state + completion.
  const allComplete = completedIndices.length === OBJECTIVES.length
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(0); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

  // Record artifact when discovery card appears.
  useEffect(() => {
    if (screen === 'discovery') {
      addArtifact({
        name: ARTIFACT_NAME,
        era: '1979',
        description: DISCOVERY_DESCRIPTION,
      })
    }
  }, [screen])

  return (
    <>
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

      {screen === 'intro' && (
        <IntroModal
          era="1979"
          title="The Command Line"
          description="It's 1979, and this is a VT100 terminal, your line to a computer down the hall that the whole lab shares. There are no icons, no menus, no mouse. Just a blinking cursor, and it won't suggest a thing: the machine waits for you to know what to ask."
          objectives={OBJECTIVES}
          onBegin={() => setScreen('booting')}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1979"
          artifactName={ARTIFACT_NAME}
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/level/1"
        />
      )}

      {/* ── Three-zone layout ─────────────────────────────────────── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — scaled terminal bezel */}
        <div className={styles.artifactZone}>
          <div
            className={styles.wrap}
            style={{ width: BEZEL_W * scale, height: BEZEL_H * scale, left: fit.left, top: fit.top }}
          >
            <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
              <TerminalBezel>
                <TerminalScreen
                  phase={terminal.phase}
                  history={terminal.history}
                  currentInput={terminal.currentInput}
                  responding={terminal.responding}
                  streamingLine={terminal.streamingLine}
                  onKeyDown={terminal.onKeyDown}
                />
              </TerminalBezel>
            </div>
            <Catalogue level={0} screen={screen} fit={fit} width={BEZEL_W} height={BEZEL_H} />
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker */}
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
