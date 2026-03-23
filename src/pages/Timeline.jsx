// src/pages/Timeline.jsx
import { useState } from 'react'
import styles from './Timeline.module.css'
import { isLevelComplete, resetAll } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'
import AboutModal from '../shared/museum-ui/AboutModal'

const ENTRIES = [
  { level: 0, year: '1971', title: 'The Command Line',  artifact: 'Command & Response',   path: '/level/0' },
  { level: 1, year: '1984', title: 'The Desktop',       artifact: 'Direct Manipulation',  path: '/level/1' },
  { level: 2, year: '1995', title: 'The Hyperlink',     artifact: 'Hyperlink Navigation', path: '/level/2' },
  { level: 3, year: '2007', title: 'The Touchscreen',   artifact: 'Multi-Touch',          path: '/level/3' },
  { level: 4, year: '2015', title: 'The Feed',          artifact: 'Infinite Scroll',      path: '/level/4' },
  { level: 5, year: '2023', title: 'The Conversation',  artifact: 'Natural Language',     path: '/level/5' },
]

export default function Timeline() {
  const navigate = useFadeNavigate()
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className={styles.timeline}>
      <span className={styles.pageTitle}>Interface Artifacts</span>

      {ENTRIES.map((entry, i) => {
        const complete = isLevelComplete(entry.level)
        const delay    = `${i * 150}ms`

        return (
          <div
            key={entry.year}
            className={`${styles.entry} ${complete ? styles.entryComplete : styles.entryIncomplete}`}
            onClick={() => navigate(entry.path)}
            style={{ '--entry-delay': delay, animationDelay: delay }}
          >
            <span className={`${styles.dot} ${complete ? styles.dotComplete : styles.dotIncomplete}`} />

            <div className={styles.content}>
              <span className={styles.year}>{entry.year}</span>
              <div className={styles.titleRow}>
                <span className={styles.title}>{entry.title}</span>
                <span className={styles.arrow}>→</span>
              </div>
              {complete && (
                <span className={styles.artifact}>{entry.artifact}</span>
              )}
            </div>
          </div>
        )
      })}

      {/* ── Dev helper ─────────────────────────────────────────────── */}
      <button
        className={styles.resetBtn}
        onClick={() => { resetAll(); navigate('/') }}
        style={{ animationDelay: '850ms' }}
      >
        Reset progress
      </button>

      <button className={styles.aboutLink} onClick={() => setShowAbout(true)}>About</button>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}
