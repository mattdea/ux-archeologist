// src/pages/Timeline.jsx
import styles from './Timeline.module.css'
import { getCurrentLevel, isLevelComplete, resetAll } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'

const ENTRIES = [
  { level: 0, year: '1971', title: 'The Unix Terminal',    artifact: 'Command-Response Interaction',    path: '/level/0' },
  { level: 1, year: '1984', title: 'The Desktop Arrives',  artifact: 'Direct Manipulation',            path: '/level/1' },
  { level: 2, year: '1995', title: 'The Hypertext Web',    artifact: 'Hyperlink Navigation',            path: '/level/2' },
  { level: 3, year: '2007', title: 'Touch Arrives',        artifact: 'Direct Touch Interaction',        path: '/level/3' },
  { level: 4, year: '2015', title: 'The Infinite Feed',    artifact: 'Attention Economy Interfaces',    path: '/level/4' },
]

export default function Timeline() {
  const navigate    = useFadeNavigate()
  const currentLvl  = getCurrentLevel()

  return (
    <div className={styles.timeline}>
      {ENTRIES.map((entry, i) => {
        const complete = isLevelComplete(entry.level)
        const active   = !complete && entry.level === currentLvl
        const locked   = !complete && !active
        const delay    = `${i * 150}ms`

        return (
          <div
            key={entry.year}
            className={[
              styles.entry,
              complete ? styles.entryComplete : '',
              active   ? styles.entryActive   : '',
              locked   ? styles.entryLocked   : '',
            ].join(' ')}
            onClick={(active || complete) ? () => navigate(entry.path) : undefined}
            style={{ '--entry-delay': delay, animationDelay: delay }}
          >
            <span
              className={[
                styles.dot,
                complete ? styles.dotComplete : '',
                active   ? styles.dotActive   : '',
                locked   ? styles.dotLocked   : '',
              ].join(' ')}
            />

            <div className={styles.content}>
              <span className={styles.year}>{entry.year}</span>
              <div className={styles.titleRow}>
                <span className={styles.title}>{entry.title}</span>
                {active && <span className={styles.arrow}>→</span>}
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
    </div>
  )
}
