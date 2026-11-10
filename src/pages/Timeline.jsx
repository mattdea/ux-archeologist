// src/pages/Timeline.jsx
import { useState } from 'react'
import styles from './Timeline.module.css'
import { isLevelComplete, completeLevel, resetAll } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'
import AboutModal from '../shared/museum-ui/AboutModal'
import { ARTIFACTS } from '../data/artifacts'
import { serifTitlesOn, setSerifTitles, cardTimelineOn, setCardTimeline, forgetCardsSeen } from '../shared/devLooks'
import CardPath from './CardPath'
import { setMuseumStyle } from '../shared/museumStyle'

const ENTRIES = ARTIFACTS.map(a => ({ level: a.level, year: a.year, title: a.title, artifact: a.name, path: a.path }))

export default function Timeline() {
  const navigate = useFadeNavigate()
  const [showAbout, setShowAbout] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [tick, refresh] = useState(0)   // re-read progress after Complete all
  // Testing aid, dev server only: mark all six levels done, e.g. to see the
  // collection's cards filled in. Never shown in the production build.
  const completeAll = () => { ARTIFACTS.forEach(a => completeLevel(a.level)); refresh(n => n + 1) }

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

      {/* ── Reset progress: asks once before wiping every level ───── */}
      <div className={styles.leftLinks}>
      {confirmReset ? (
        <div className={styles.resetConfirm} role="group" aria-label="Reset all six levels?">
          <span className={styles.resetQuestion}>Reset all six levels?</span>
          <button
            type="button"
            className={styles.resetChoice}
            onClick={() => { resetAll(); forgetCardsSeen(); navigate('/') }}
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
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={completeAll} style={{ animationDelay: '850ms' }}>
          Complete all (dev)
        </button>
      )}
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={() => { setSerifTitles(!serifTitlesOn()); refresh(n => n + 1) }} style={{ animationDelay: '850ms' }}>
          Serif titles (dev): {serifTitlesOn() ? 'on' : 'off'}
        </button>
      )}
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={() => { setCardTimeline(!cards); refresh(n => n + 1) }} style={{ animationDelay: '850ms' }}>
          Timeline (dev): {cards ? 'cards' : 'line'}
        </button>
      )}
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={() => setMuseumStyle('index')} style={{ animationDelay: '850ms' }}>
          Museum (dev): Classic
        </button>
      )}
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={() => navigate('/card-lab')} style={{ animationDelay: '850ms' }}>
          Card lab (dev)
        </button>
      )}
      {import.meta.env.DEV && !confirmReset && (
        <button className={styles.resetBtn} onClick={() => navigate('/style-lab')} style={{ animationDelay: '850ms' }}>
          Style lab (dev)
        </button>
      )}
      </div>

      <div className={styles.links}>
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
