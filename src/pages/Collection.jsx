// src/pages/Collection.jsx
//
// The six artifacts a visitor collects by finishing each room, laid out as
// a set of collectible cards in timeline order. A found card shows its set
// number, year, a drawing of the room's device on an era-coloured plate,
// the artifact's name, the room and its description as the card's small
// print. A room not finished yet is a card lying face down. Every card
// opens its room. Found or not comes from isLevelComplete(n); the text from
// src/data/artifacts.js. Reached from the timeline's "Collection · N of 6".
import { useState } from 'react'
import styles from './Collection.module.css'
import hud from '../shared/SharedLayout.module.css'
import { FoundCard, FaceDownCard } from './collection/cards'
import { readCardLook, lookClass, readCardArt } from './collection/cardLook'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'
import { useDevChange } from '../shared/dev/devEvents'

export default function Collection() {
  const navigate = useFadeNavigate()
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  // Card style and art are chosen in the dev panel (dev server only)
  const [look, setLook] = useState(() => (import.meta.env.DEV ? readCardLook() : 'card'))
  const [art, setArt] = useState(() => (import.meta.env.DEV ? readCardArt() : 'drawn'))
  const [, refresh] = useState(0)
  useDevChange(() => { setLook(readCardLook()); setArt(readCardArt()); refresh(n => n + 1) })

  return (
    <div className={`${styles.page} ${lookClass(look)}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collection</h1>
        <span className={styles.count}>{found} of {ARTIFACTS.length} found</span>
      </div>

      <ul className={styles.grid}>
        {ARTIFACTS.map((a, i) => (
          <li key={a.level} className={styles.cell} style={{ animationDelay: `${i * 150}ms` }}>
            {isLevelComplete(a.level)
              ? <FoundCard a={a} art={art} onOpen={() => navigate(a.path)} />
              : <FaceDownCard a={a} onOpen={() => navigate(a.path)} />}
          </li>
        ))}
      </ul>

      <button type="button" className={`${hud.backLink} ${styles.backLink}`} onClick={() => navigate('/timeline')}>
        ← Back to timeline
      </button>
    </div>
  )
}
