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
import { readCardLook, saveCardLook, lookClass } from './collection/cardLook'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'

export default function Collection() {
  const navigate = useFadeNavigate()
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  const [look, setLook] = useState(() => (import.meta.env.DEV ? readCardLook() : 'card'))
  const chooseLook = (v) => { setLook(v); saveCardLook(v) }

  return (
    <div className={`${styles.page} ${lookClass(look)}`}>
      {import.meta.env.DEV && (
        <div className={styles.lookSwitch} role="group" aria-label="Card style (dev)">
          <span>Card style (dev):</span>
          {[['card', 'Collectible'], ['museum', 'Museum'], ['hybrid', 'Hybrid']].map(([v, label]) => (
            <button key={v} type="button" aria-pressed={look === v} className={look === v ? styles.lookOn : ''} onClick={() => chooseLook(v)}>
              {label}
            </button>
          ))}
        </div>
      )}
      <div className={styles.header}>
        <h1 className={styles.title}>Collection</h1>
        <span className={styles.count}>{found} of {ARTIFACTS.length} found</span>
      </div>

      <ul className={styles.grid}>
        {ARTIFACTS.map((a, i) => (
          <li key={a.level} className={styles.cell} style={{ animationDelay: `${i * 150}ms` }}>
            {isLevelComplete(a.level)
              ? <FoundCard a={a} onOpen={() => navigate(a.path)} />
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
