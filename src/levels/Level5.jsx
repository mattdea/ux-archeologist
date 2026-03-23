// src/levels/Level5.jsx
//
// Level 5 — 2023 AI Interface / "The Conversation"
// Museum state machine: 'intro' → 'booting' → 'playing' → 'discovery'
//
// Container: full-width chat panel — no device, no bezel, no chrome.

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Level5.module.css'
import IntroModal from '../shared/museum-ui/IntroModal'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete } from '../state/state'
import ChatPanel from '../components/chat/ChatPanel'

const OBJECTIVES = [
  'Start a conversation',
  'Regenerate a response',
  'Rate a response',
]

const DISCOVERY_DESCRIPTION =
  "Every previous interface required you to learn its language: commands, clicks, menus, gestures. " +
  "This one already speaks yours. But behind the fluency is a system you can't see, trained on text you didn't choose, " +
  "shaped by decisions you can't inspect. The most natural interface ever built is also the least transparent."

const ALREADY_DONE = isLevelComplete(5)

export default function Level5() {
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  const [screen, setScreen] = useState(() => ALREADY_DONE ? 'playing' : 'intro')
  const [trackerVisible, setTrackerVisible] = useState(ALREADY_DONE)

  // Objectives: independent (no sequential gating), keyed by name
  const [objectives, setObjectives] = useState({
    startConversation: ALREADY_DONE,
    regenerateResponse: ALREADY_DONE,
    rateResponse: ALREADY_DONE,
  })

  const completeObjective = useCallback((key) => {
    setObjectives(prev => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  const bootTimers = useRef([])
  useEffect(() => () => bootTimers.current.forEach(clearTimeout), [])

  // Replay: if we skipped the intro (level already complete), auto-advance to playing
  useEffect(() => {
    if (screen === 'booting') {
      bootTimers.current.push(setTimeout(() => setScreen('playing'), 200))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Notify SharedLayout after all boot animations settle:
  // input bar (700ms) + last chip (920ms delay + 400ms) = ~1320ms. Add small buffer.
  // Both notifyArtifactReady and trackerVisible fire together so HUD + tracker animate in sync
  // (both use a 200ms CSS delay, matching the pattern in other levels).
  useEffect(() => {
    if (screen === 'playing') {
      const t = setTimeout(() => { notifyArtifactReady(); setTrackerVisible(true) }, 800)
      return () => clearTimeout(t)
    }
  }, [screen, notifyArtifactReady])

  // Continue button wiring (canonical pattern from CLAUDE.md)
  const allComplete = objectives.startConversation && objectives.regenerateResponse && objectives.rateResponse
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(5); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

  // Boot sequence: 1000ms pause → 'playing' (input bar slides up via CSS keyframe)
  const handleBeginExcavation = () => {
    setScreen('booting')
    bootTimers.current.push(
      setTimeout(() => setScreen('playing'), 200)
    )
  }

  const completedIndices = [
    objectives.startConversation,
    objectives.regenerateResponse,
    objectives.rateResponse,
  ].reduce((acc, done, i) => (done ? [...acc, i] : acc), [])

  return (
    <>
      {/* ── Museum overlays ── */}

      {screen === 'intro' && (
        <IntroModal
          era="2023"
          title="The Conversation"
          description="This is a large language model. There are no buttons to learn, no gestures to memorize. You type a sentence, and it types one back."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2023"
          artifactName="Natural Language"
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/collection"
        />
      )}

      {/* ── Three-zone layout ── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — chat panel fills this zone entirely.
            Always mounted so it's visible behind IntroModal and DiscoveryCard.
            During 'booting' the input is hidden; it slides in on 'playing'.
            pointer-events: none when not playing so overlays remain interactive. */}
        <div
          className={styles.artifactZone}
          style={{ pointerEvents: screen === 'playing' ? 'auto' : 'none' }}
        >
          <ChatPanel
            playing={screen !== 'booting'}
            animated={screen === 'playing'}
            autoFocus={screen === 'playing'}
            onCompleteObjective={completeObjective}
          />
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <div className={`${styles.bottomZone} ${trackerVisible ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
