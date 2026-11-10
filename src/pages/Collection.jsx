// src/pages/Collection.jsx
//
// The six artifacts a visitor collects by finishing each room, in timeline
// order. Found or not comes from isLevelComplete(n); the text comes from
// src/data/artifacts.js, so copy changes show up here. A found card is a
// DiscoveryCard-style white card with a thumbnail of the room; a not-found
// card is an outline with the year and the room's title. Every card opens
// its room. Reached from the timeline's "Collection · N of 6" link.
import styles from './Collection.module.css'
import card from '../shared/museum-ui/DiscoveryCard.module.css'
import hud from '../shared/SharedLayout.module.css'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'

// One thumbnail per room (assets/collection/level0.webp …); a missing file
// just leaves the card without one
const THUMBS = Object.fromEntries(
  Object.entries(import.meta.glob('../../assets/collection/level*.webp', { eager: true, import: 'default' }))
    .map(([path, url]) => [Number(path.match(/level(\d)\.webp$/)[1]), url])
)

export default function Collection() {
  const navigate = useFadeNavigate()
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collection</h1>
        <span className={styles.count}>{found} of {ARTIFACTS.length} found</span>
      </div>

      <ul className={styles.grid}>
        {ARTIFACTS.map((a, i) => {
          const done = isLevelComplete(a.level)
          const delay = `${i * 150}ms`   // the timeline's stagger
          return (
            <li key={a.level} className={styles.cell} style={{ animationDelay: delay }}>
              {done ? (
                <button type="button" className={`${card.card} ${styles.card} ${styles.found}`} onClick={() => navigate(a.path)}>
                  {THUMBS[a.level] && (
                    <span className={styles.thumb}>
                      <img src={THUMBS[a.level]} alt="" />
                    </span>
                  )}
                  <span className={card.body}>
                    <span className={card.year}>{a.year}</span>
                    <span className={card.discoveredLabel}>{a.title}</span>
                    <span className={card.artifactName}>{a.name}</span>
                    <span className={card.description}>{a.description}</span>
                  </span>
                </button>
              ) : (
                <button type="button" className={`${styles.card} ${styles.missing}`} onClick={() => navigate(a.path)}>
                  <span className={styles.missingYear}>{a.year}</span>
                  <span className={styles.missingTitle}>{a.title}</span>
                  <span className={styles.missingNote}>Finish this room to add it.</span>
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <button type="button" className={`${hud.backLink} ${styles.back}`} onClick={() => navigate('/timeline')}>
        ← Back to timeline
      </button>
    </div>
  )
}
