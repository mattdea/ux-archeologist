// src/pages/TestMuseumUI.jsx
import { useState } from 'react'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import HintPill from '../shared/museum-ui/HintPill'
import styles from './TestMuseumUI.module.css'

const OBJECTIVES = [
  'Open the Notes file',
  'Drag Projects folder to Trash',
  'Use the File menu',
]

export default function TestMuseumUI() {
  const [showIntro, setShowIntro]         = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [completed, setCompleted]         = useState([])
  const [hintVisible, setHintVisible]     = useState(true)

  function toggleObjective(i) {
    setCompleted(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Museum UI — Component Review</h2>

      {/* ── Controls ───────────────────────────────────────────── */}
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => setShowIntro(true)}>
          Show IntroModal
        </button>
        <button className={styles.btn} onClick={() => setShowDiscovery(true)}>
          Show DiscoveryCard
        </button>
        <button className={styles.btn} onClick={() => setHintVisible(v => !v)}>
          Toggle HintPill ({hintVisible ? 'visible' : 'hidden'})
        </button>
        <button className={styles.btn} onClick={() => setCompleted([])}>
          Reset objectives
        </button>
        {OBJECTIVES.map((_, i) => (
          <button
            key={i}
            className={`${styles.btn} ${completed.includes(i) ? styles.btnActive : ''}`}
            onClick={() => toggleObjective(i)}
          >
            Obj {i + 1} {completed.includes(i) ? '✓' : '○'}
          </button>
        ))}
      </div>

      {/* ── Inline components ──────────────────────────────────── */}
      <div className={styles.grid}>

        <div className={styles.cell}>
          <p className={styles.cellLabel}>ObjectiveTracker</p>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completed}
            onContinue={() => alert('onContinue fired')}
          />
        </div>

        <div className={styles.cell}>
          <p className={styles.cellLabel}>HintPill</p>
          <HintPill text="Double-click to open" visible={hintVisible} />
        </div>

      </div>

      {/* ── Overlay components (triggered by buttons) ─────────── */}
      {showIntro && (
        <IntroModal
          era="1984"
          title="The Desktop"
          description="You're looking at the original Macintosh desktop from 1984. Explore the interface and complete the objectives to discover what made it revolutionary."
          objectives={OBJECTIVES}
          onBegin={() => setShowIntro(false)}
        />
      )}

      {showDiscovery && (
        <DiscoveryCard
          era="1984"
          artifactName="Direct Manipulation"
          description="Instead of typing abstract commands, users could act directly on visible objects: open folders, move files, and choose commands from menus. The Macintosh proved that interfaces could mirror physical intuition. You just did it yourself."
          nextUrl="/level/2"
        />
      )}
    </div>
  )
}
