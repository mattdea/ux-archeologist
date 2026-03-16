// src/levels/Level0.jsx
import { useState, useEffect } from 'react'
import styles from './Level0.module.css'
import TerminalBezel from '../components/terminal/TerminalBezel'
import TerminalScreen from '../components/terminal/TerminalScreen'
import useTerminal from '../components/terminal/useTerminal'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel, isLevelComplete } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

// Bezel pixel dimensions: screen(700×420) + screenBezel pad(12×2) + screenArea pad(28×2 / 16+8)
const BEZEL_W = 780
const BEZEL_H = 540

// Matches --bottom-zone-height in Level0.module.css
const BOTTOM_ZONE_H = 180

export default function Level0() {
  // Start at 'playing' until IntroModal is implemented (Prompt 3+).
  // When intro is added: isLevelComplete(0) ? 'playing' : 'intro'
  const [screen, setScreen] = useState('playing')
  const scale    = useBezelScale(BEZEL_W, BEZEL_H, { marginTop: BOTTOM_ZONE_H, marginBottom: BOTTOM_ZONE_H })
  const terminal = useTerminal()
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Notify SharedLayout when the artifact is ready for interaction.
  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  // No objectives complete yet — Continue button stays hidden.
  useEffect(() => {
    setContinue(null)
  }, [screen, setContinue])

  return (
    <>
      {/* ── Museum overlays (added in future prompts) ──────────────── */}

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
                  onKeyDown={terminal.onKeyDown}
                />
              </TerminalBezel>
            </div>
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker placeholder (populated in Prompt 4) */}
        <div className={styles.bottomZone} />

      </div>
    </>
  )
}
