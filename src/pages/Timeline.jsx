// src/pages/Timeline.jsx
import { useState } from 'react'
import styles from './Timeline.module.css'
import { isLevelComplete } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'
import AboutModal from '../shared/museum-ui/AboutModal'
import { ARTIFACTS } from '../data/artifacts'
import { cardTimelineOn } from '../shared/devLooks'
import { useDevChange } from '../shared/dev/devEvents'
import CardPath from './CardPath'
import SoundToggle from '../shared/museum-ui/SoundToggle'

const ENTRIES = ARTIFACTS.map(a => ({ level: a.level, year: a.year, title: a.title, artifact: a.name, path: a.path }))

export default function Timeline() {
  const navigate = useFadeNavigate()
  const [showAbout, setShowAbout] = useState(false)
  // Re-read progress and looks when the dev panel changes them (its
  // progress switch, line or cards); dev server only
  const [tick, refresh] = useState(0)
  useDevChange(() => refresh(n => n + 1))

  // Dev switch under consideration: the timeline as a path of the
  // collection's cards (CardPath)
  const cards = cardTimelineOn()

  return (
    <div className={cards ? styles.cardsMode : styles.timeline}>
      {cards && <CardPath key={tick} />}
      {!cards && <span className={styles.pageTitle}>Interface Artifacts</span>}

      {!cards && ENTRIES.map((entry, i) => {
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

      <div className={styles.links}>
        <SoundToggle className={styles.aboutLink} />
        {!cards && (
          <button className={styles.aboutLink} onClick={() => navigate('/collection')}>
            Collection · {ENTRIES.filter(e => isLevelComplete(e.level)).length} of {ENTRIES.length}
          </button>
        )}
        <button className={styles.aboutLink} onClick={() => setShowAbout(true)}>About</button>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}
