// src/levels/Level4.jsx
//
// Level 4 — 2016 Instagram Feed / "The Feed"
// Museum state machine: 'intro' → 'booting' → 'playing' → 'discovery'
//
// Container: the lit feed screen inside a ghost iPhone 6 outline + glow
// (GhostDevice) — a phone that is disappearing, between Level 3's full
// device and Level 5's none. Scaled to fit like Level 3's bezel.

import { useState, useEffect, useCallback } from 'react'
import styles from './Level4.module.css'
import IntroModal from '../shared/museum-ui/IntroModal'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import HintPill from '../shared/museum-ui/HintPill'
import useHint from '../shared/museum-ui/useHint'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import FeedApp from '../components/feed/FeedApp'
import GhostDevice, { UNIT_W, UNIT_H } from '../components/feed/GhostDevice'
import useArtifactFit from '../hooks/useArtifactFit'


const OBJECTIVES = [
  "Like Imani's post",
  'Learn more about a sponsored post',
  'Follow someone new',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  "Scroll to Imani Brooks's post and double-tap her photo",
  'Tap Learn More on a post marked Sponsored',
  'Tap a name to open a profile, then tap Follow',
]

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[4]


export default function Level4() {
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()
  // Same fit as Level 3's phone: the ghost body fills the artifact zone height
  // between the top spacer and bottom zone, never larger than 1×.
  const fit = useArtifactFit(UNIT_W, UNIT_H)
  const scale = fit.scale

  // Read on each visit, not once when the code loads: levels load once per
  // page, and progress changes in between (finishing it, Reset, Complete all)
  const [alreadyDone] = useState(() => isLevelComplete(4))
  // Replay: skip 'intro', start at 'booting' (boot → playing in useEffect below)
  const [screen, setScreen] = useState(() => alreadyDone ? 'booting' : 'intro')
  const [trackerVisible, setTrackerVisible] = useState(false)

  // Independent objectives — all pre-completed on replay
  const [objectives, setObjectives] = useState(() => {
    const done = alreadyDone
    return { likeImani: done, tapSponsored: done, followNew: done }
  })

  const completeObjective = useCallback((key) => {
    setObjectives(prev => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  // Boot sequence: 300ms pause after the modal closes, then 'playing' lights
  // the screen (450ms), then the ghost outline and glow fade in around it.
  useEffect(() => {
    if (screen !== 'booting') return
    const t = setTimeout(() => setScreen('playing'), 300)
    return () => clearTimeout(t)
  }, [screen])

  // HUD and tracker arrive once the screen is fully lit (~450ms) plus a beat
  useEffect(() => {
    if (screen !== 'playing') return
    const t = setTimeout(() => {
      notifyArtifactReady()
      setTrackerVisible(true)
    }, 700)
    return () => clearTimeout(t)
  }, [screen, notifyArtifactReady])

  // Continue button wiring (canonical pattern from CLAUDE.md)
  const allComplete = objectives.likeImani && objectives.tapSponsored && objectives.followNew
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(4); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

  // Record artifact when discovery card appears
  useEffect(() => {
    if (screen === 'discovery') {
      addArtifact({ name: ARTIFACT_NAME, era: '2016', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

  const handleBeginExcavation = () => setScreen('booting')

  const completedIndices = [
    objectives.likeImani,
    objectives.tapSponsored,
    objectives.followNew,
  ].reduce((acc, done, i) => done ? [...acc, i] : acc, [])
  const hint = useHint(HINTS, { active: screen === 'playing', completedIndices })

  return (
    <>
      {/* ── Museum overlays ── */}

      {screen === 'intro' && (
        <IntroModal
          era="2016"
          title="The Feed"
          description="It's spring 2016, and this is Instagram on an iPhone 6. There's nothing to open and nothing to look for: the photos are already there when you arrive, and there are always more below. This year Instagram begins deciding which ones you see first, guessing at what will keep you looking."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2016"
          artifactName={ARTIFACT_NAME}
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/level/5"
        />
      )}

      {/* ── Three-zone layout ── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — feed column floats in dark museum space.
            pointer-events: none while modal is active so overlays stay interactive. */}
        <div
          className={styles.artifactZone}
          style={{ pointerEvents: screen === 'playing' ? 'auto' : 'none' }}
        >
          <div
            className={styles.frameWrap}
            style={{ width: UNIT_W * scale, height: UNIT_H * scale, left: fit.left, top: fit.top }}
          >
            <div className={styles.frameScaler} style={{ transform: `scale(${scale})` }}>
              <GhostDevice lit={screen === 'playing'} touch={screen === 'playing'}>
                <FeedApp
                  framed
                  animated={screen === 'playing'}
                  onCompleteObjective={completeObjective}
                />
              </GhostDevice>
            </div>
          </div>
        </div>

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
