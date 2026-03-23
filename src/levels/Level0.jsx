// src/levels/Level0.jsx
import { useState, useEffect } from 'react'
import styles from './Level0.module.css'
import TerminalBezel from '../components/terminal/TerminalBezel'
import TerminalScreen from '../components/terminal/TerminalScreen'
import useTerminal from '../components/terminal/useTerminal'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = [
  'Read the notes file',
  'Check your messages',
  'Look up a command in the manual',
]

// Bezel pixel dimensions: screen(700×420) + screenBezel pad(12×2) + screenArea pad(28×2 / 16+8)
const BEZEL_W = 780
const BEZEL_H = 540

// Matches --bottom-zone-height in Level0.module.css
const BOTTOM_ZONE_H = 180

const DISCOVERY_DESCRIPTION =
  'Every interaction you just had followed the same pattern: you typed a command, the machine responded, ' +
  'and you decided what to do next. No guidance, no suggestions, no undo. Every interface that came after ' +
  'this one tried to make that exchange easier, but the conversation underneath never changed.'

export default function Level0() {
  // 'intro' → 'booting' → 'playing' → 'discovery'
  // Skip intro+boot and go directly to 'playing' on replay (level already complete).
  const [screen, setScreen] = useState(() => isLevelComplete(0) ? 'playing' : 'intro')
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(0) ? [0, 1, 2] : [])

  const scale = useBezelScale(BEZEL_W, BEZEL_H, { marginTop: BOTTOM_ZONE_H, marginBottom: BOTTOM_ZONE_H })
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  const completeObjective = (index) => {
    setCompletedIndices(prev => prev.includes(index) ? prev : [...prev, index])
  }

  const terminal = useTerminal({
    onObjectiveComplete: completeObjective,
    completedIndices,
    replay: isLevelComplete(0),
  })

  // Start the boot sequence when screen enters 'booting'.
  // onComplete transitions to 'playing', which is when HUD elements appear.
  // terminal.startBoot uses stable refs internally — intentionally excluded from deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (screen === 'booting') terminal.startBoot(() => setScreen('playing'))
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
        name: 'Command & Response',
        era: '1971',
        description: DISCOVERY_DESCRIPTION,
      })
    }
  }, [screen])

  return (
    <>
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

      {screen === 'intro' && (
        <IntroModal
          era="1971"
          title="The Command Line"
          description="This is a VT100 terminal connected to a Unix mainframe. There are no icons, no menus, no mouse. Just a blinking cursor waiting for you to type something."
          objectives={OBJECTIVES}
          onBegin={() => setScreen('booting')}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1971"
          artifactName="Command & Response"
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
            style={{ width: BEZEL_W * scale, height: BEZEL_H * scale }}
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
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker */}
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
