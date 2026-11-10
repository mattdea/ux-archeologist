// src/pages/Timeline.jsx
import { useState } from 'react'
import styles from './Timeline.module.css'
import { isLevelComplete, resetAll } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'
import AboutModal from '../shared/museum-ui/AboutModal'
import { ARTIFACTS } from '../data/artifacts'

const ENTRIES = ARTIFACTS.map(a => ({ level: a.level, year: a.year, title: a.title, artifact: a.name, path: a.path }))

export default function Timeline() {
  const navigate = useFadeNavigate()
  const [showAbout, setShowAbout] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className={styles.timeline}>
      <span className={styles.pageTitle}>Interface Artifacts</span>

      {ENTRIES.map((entry, i) => {
        const complete = isLevelComplete(entry.level)
        const delay    = `${i * 150}ms`

        return (
          <button
            type="button"
            key={entry.year}
            className={`${styles.entry} ${complete ? styles.entryComplete : styles.entryIncomplete}`}
            onClick={() => navigate(entry.path)}
            style={{ '--entry-delay': delay, animationDelay: delay }}
          >
            <span className={`${styles.dot} ${complete ? styles.dotComplete : styles.dotIncomplete}`} />

            <span className={styles.content}>
              <span className={styles.year}>{entry.year}</span>
              <span className={styles.titleRow}>
                <span className={styles.title}>{entry.title}</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </span>
              {complete && (
                <span className={styles.artifact}>{entry.artifact}</span>
              )}
            </span>
          </button>
        )
      })}

      {/* ── Reset progress: asks once before wiping every level ───── */}
      {confirmReset ? (
        <div className={styles.resetConfirm} role="group" aria-label="Reset all six levels?">
          <span className={styles.resetQuestion}>Reset all six levels?</span>
          <button
            type="button"
            className={styles.resetChoice}
            onClick={() => { resetAll(); navigate('/') }}
          >
            Reset
          </button>
          <button
            type="button"
            className={styles.resetChoice}
            autoFocus
            onClick={() => setConfirmReset(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className={styles.resetBtn}
          onClick={() => setConfirmReset(true)}
          style={{ animationDelay: '850ms' }}
        >
          Reset progress
        </button>
      )}

      <button className={styles.aboutLink} onClick={() => setShowAbout(true)}>About</button>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}
