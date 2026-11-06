// src/levels/Level4.jsx
//
// Level 4 — 2015 Instagram Feed / "The Feed"
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
import useBezelScale from '../hooks/useBezelScale'

const BOTTOM_ZONE_H = 180

const OBJECTIVES = [
  "Find your friend's post",
  'Learn more about a sponsored post',
  'Like a post',
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
  const scale = useBezelScale(UNIT_W, UNIT_H, { marginTop: BOTTOM_ZONE_H, marginBottom: BOTTOM_ZONE_H })

  // Replay: skip 'intro', start at 'booting' (boot → playing in useEffect below)
  const [screen, setScreen] = useState(() => ALREADY_DONE ? 'booting' : 'intro')
  const [trackerVisible, setTrackerVisible] = useState(false)

  // Independent objectives — all pre-completed on replay
  const [objectives, setObjectives] = useState(() => {
    const done = ALREADY_DONE
    return { findFriend: done, tapSponsored: done, likePost: done }
  })

  const completeObjective = useCallback((key) => {
    setObjectives(prev => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  // Boot sequence: 800ms pause in 'booting' → 'playing'
  useEffect(() => {
    if (screen !== 'booting') return
    const t = setTimeout(() => setScreen('playing'), 800)
    return () => clearTimeout(t)
  }, [screen])

  // Notify SharedLayout and show tracker after feed-enter animation settles (~600ms)
  useEffect(() => {
    if (screen !== 'playing') return
    const t = setTimeout(() => {
      notifyArtifactReady()
      setTrackerVisible(true)
    }, 600)
    return () => clearTimeout(t)
  }, [screen, notifyArtifactReady])

  // Continue button wiring (canonical pattern from CLAUDE.md)
  const allComplete = objectives.findFriend && objectives.tapSponsored && objectives.likePost
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
      addArtifact({ name: 'Algorithmic Feed', era: '2015', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

  const handleBeginExcavation = () => setScreen('booting')

  const completedIndices = [
    objectives.findFriend,
    objectives.tapSponsored,
    objectives.likePost,
  ].reduce((acc, done, i) => done ? [...acc, i] : acc, [])

  return (
    <>
      {/* ── Museum overlays ── */}

      {screen === 'intro' && (
        <IntroModal
          era="2015"
          title="The Feed"
          description="The interface stopped waiting for you. It started optimizing for your attention."
          objectives={OBJECTIVES}
          onBegin={handleBeginExcavation}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="2015"
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
            style={{ width: UNIT_W * scale, height: UNIT_H * scale }}
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
