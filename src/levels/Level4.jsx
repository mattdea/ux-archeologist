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
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import FeedApp from '../components/feed/FeedApp'
import GhostDevice, { UNIT_W, UNIT_H } from '../components/feed/GhostDevice'
import useArtifactFit from '../hooks/useArtifactFit'


const OBJECTIVES = [
  "Like Imani's post",
  'Learn more about a sponsored post',
  'Follow someone new',
]

const DISCOVERY_DESCRIPTION =
  'Earlier feeds showed you everything your friends posted, newest first. By 2016, an algorithm ranked the feed instead, ' +
  'ordering each post by how likely it was to keep you scrolling. Your closest friend\'s biggest news could sit beneath ' +
  'three strangers and an ad. The order was chosen for you, tuned to hold your attention, by a system whose goals were not your own.'

// Evaluated once at module load — safe because localStorage doesn't change mid-session
const ALREADY_DONE = isLevelComplete(4)

export default function Level4() {
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()
  // Same fit as Level 3's phone: the ghost body fills the artifact zone height
  // between the top spacer and bottom zone, never larger than 1×.
  const fit = useArtifactFit(UNIT_W, UNIT_H)
  const scale = fit.scale

  // Replay: skip 'intro', start at 'booting' (boot → playing in useEffect below)
  const [screen, setScreen] = useState(() => ALREADY_DONE ? 'booting' : 'intro')
  const [trackerVisible, setTrackerVisible] = useState(false)

  // Independent objectives — all pre-completed on replay
  const [objectives, setObjectives] = useState(() => {
    const done = ALREADY_DONE
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
      addArtifact({ name: 'Algorithmic Feed', era: '2016', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

  const handleBeginExcavation = () => setScreen('booting')

  const completedIndices = [
    objectives.likeImani,
    objectives.tapSponsored,
    objectives.followNew,
  ].reduce((acc, done, i) => done ? [...acc, i] : acc, [])

  return (
    <>
      {/* ── Museum overlays ── */}

      {screen === 'intro' && (
        <IntroModal
          era="2016"
          title="The Feed"
          description="The interface stopped waiting for you. It started optimizing for your attention."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2016"
          artifactName="Algorithmic Feed"
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/timeline"
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
