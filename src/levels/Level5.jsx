// src/levels/Level5.jsx
//
// Level 5 — 2023 AI Interface / "The Conversation"
// Museum state machine: 'intro' → 'booting' → 'playing' → 'discovery'
//
// Container: full-width chat panel — no device, no bezel, no chrome.

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import styles from './Level5.module.css'
import IntroModal from '../shared/museum/IntroModal'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import HintPill from '../shared/museum/HintPill'
import useHint from '../shared/museum-ui/useHint'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import ChatPanel from '../components/chat/ChatPanel'
import Catalogue from '../shared/catalogue/Catalogue'
import { useMuseumStyle } from '../shared/museumStyle'
import { useIndexTheme } from '../shared/index-museum/theme'

// The chat's column (ChatPanel's 680px max width, less the bottom bar's
// 24px side padding, so its edges are the input bar's), the box the
// catalogue record treats as this room's object, since there is no device.
// At phone width the column fills the viewport and the inset keeps the
// catalogue number off the edge.
const CHAT_COLUMN = 680
const CHAT_INSET = 24

const OBJECTIVES = [
  'Send a message',
  'Ask a follow-up question',
  'Regenerate a reply',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  'Click a suggestion, or type a question and press Enter',
  'Ask about something in the last reply',
  'Click the circular arrow under a reply',
]

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[5]

const ALREADY_DONE = isLevelComplete(5)

export default function Level5() {
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()
  // The chat is light only in the Index museum's light mode; Classic and
  // the Index in dark mode show it as designed
  const museum = useMuseumStyle()
  const indexTheme = useIndexTheme()
  const chatTheme = museum === 'index' && indexTheme === 'light' ? 'light' : 'dark'

  // Replay (level already complete): skip the intro card, replay the boot
  const [screen, setScreen] = useState(() => ALREADY_DONE ? 'booting' : 'intro')
  const [trackerVisible, setTrackerVisible] = useState(false)

  // Objectives: independent (no sequential gating), keyed by name
  const [objectives, setObjectives] = useState({
    startConversation: ALREADY_DONE,
    askFollowUp: ALREADY_DONE,
    regenerateResponse: ALREADY_DONE,
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
  const allComplete = objectives.startConversation && objectives.askFollowUp && objectives.regenerateResponse
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(5); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

  // Record artifact when discovery card appears
  useEffect(() => {
    if (screen === 'discovery') {
      addArtifact({ name: ARTIFACT_NAME, era: '2023', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

  // Boot sequence: 200ms pause → 'playing' (input bar slides up via CSS keyframe)
  const handleBeginExcavation = () => {
    setScreen('booting')
    bootTimers.current.push(
      setTimeout(() => setScreen('playing'), 200)
    )
  }

  const completedIndices = [
    objectives.startConversation,
    objectives.askFollowUp,
    objectives.regenerateResponse,
  ].reduce((acc, done, i) => (done ? [...acc, i] : acc), [])
  const hint = useHint(HINTS, { active: screen === 'playing', completedIndices })

  // Where the chat's column is, for the catalogue record
  const zoneRef = useRef(null)
  const [column, setColumn] = useState(null)
  useLayoutEffect(() => {
    const el = zoneRef.current
    if (!el) return undefined
    const measure = () => {
      const r = el.getBoundingClientRect()
      const width = Math.min(CHAT_COLUMN, r.width) - 2 * CHAT_INSET
      setColumn(c => {
        const next = { fit: { scale: 1, left: r.left + (r.width - width) / 2, top: r.top }, width, height: r.height }
        return c && c.width === next.width && c.height === next.height && c.fit.left === next.fit.left && c.fit.top === next.fit.top ? c : next
      })
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  return (
    <>
      {/* ── Museum overlays ── */}

      {screen === 'intro' && (
        <IntroModal
          era="2023"
          title="The Conversation"
          description="It's 2023, and this is a large language model, the kind of AI behind ChatGPT. Every interface so far has asked you to learn something first: commands, menus, links, gestures. This one has no buttons to learn and nothing to memorize. You write to it the way you'd write to a person, and it writes back."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2023"
          artifactName={ARTIFACT_NAME}
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
          ref={zoneRef}
          className={styles.artifactZone}
          style={{ pointerEvents: screen === 'playing' ? 'auto' : 'none' }}
          data-catalogue-scope="5"
          data-artifact
        >
          <ChatPanel
            playing={screen !== 'booting'}
            animated={screen === 'playing'}
            autoFocus={screen === 'playing'}
            onCompleteObjective={completeObjective}
            theme={chatTheme}
          />
        </div>

        {column && (
          <div className={styles.recordBox} style={{ left: column.fit.left, top: column.fit.top, width: column.width, height: column.height }}>
            <Catalogue level={5} screen={screen} fit={column.fit} width={column.width} height={column.height} root="[data-catalogue-scope='5']" />
          </div>
        )}

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <HintPill docked text={hint} />
        <div data-hud className={`${styles.bottomZone} ${trackerVisible ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
