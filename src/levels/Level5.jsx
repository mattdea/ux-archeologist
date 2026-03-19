// src/levels/Level5.jsx
//
// Level 5 — 2023 AI Interface / "The Conversational Interface"
// Museum state machine: 'intro' → 'booting' → 'playing' → 'discovery'
//
// Container: full-width chat panel — no device, no bezel, no chrome.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
  "Previous interfaces each had their own vocabulary. You learned to type commands, click icons, " +
  "tap buttons, swipe between screens. Large language models replaced all of that with a single text field. " +
  "You could ask for code, a summary, a translation, or a recipe in the same conversation. " +
  "No new interaction model to learn, no specialized tool to find."

const ALREADY_DONE = isLevelComplete(5)

export default function Level5() {
  const navigate = useNavigate()
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Guard: Level 4 must be complete. Bypassed while Level 4 is a stub.
  // useEffect(() => { if (!isLevelComplete(4)) navigate('/level/4') }, [])

  const [screen, setScreen] = useState(() => ALREADY_DONE ? 'booting' : 'intro')
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
      bootTimers.current.push(setTimeout(() => setScreen('playing'), 1000))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Notify SharedLayout after all boot animations settle:
  // input bar (700ms) + last chip (920ms delay + 400ms) = ~1320ms. Add small buffer.
  // Both notifyArtifactReady and trackerVisible fire together so HUD + tracker animate in sync
  // (both use a 200ms CSS delay, matching the pattern in other levels).
  useEffect(() => {
    if (screen === 'playing') {
      const t = setTimeout(() => { notifyArtifactReady(); setTrackerVisible(true) }, 1400)
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
      setTimeout(() => setScreen('playing'), 1000)
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
          title="The Conversational Interface"
          description="In late 2022, OpenAI released ChatGPT and 100 million people started talking to a machine within two months. Every previous interface required learning something new: commands, clicks, gestures, swipes. This one worked because you already knew how to type a sentence."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2023"
          artifactName="Language as Interface"
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/timeline"
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
