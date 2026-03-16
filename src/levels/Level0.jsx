// src/levels/Level0.jsx
import { useState, useEffect } from 'react'
import styles from './Level0.module.css'
import { completeLevel, isLevelComplete } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const OBJECTIVES = []

export default function Level0() {
  const [screen, setScreen] = useState(() => isLevelComplete(0) ? 'playing' : 'intro')
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  useEffect(() => {
    setContinue(null)
  }, [screen, setContinue])

  return (
    <>
      <div className={styles.stub}>
        1971 — Coming Soon
      </div>
    </>
  )
}
