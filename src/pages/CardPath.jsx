// src/pages/CardPath.jsx
//
// The timeline as a path of the collection's cards (dev switch, under
// consideration). All six start face down; finishing a room turns its card
// over the next time you come back here, and from then on it stays face
// up. You navigate by the cards: each one opens its room. A thin line joins
// them in order. With nothing done yet, the first card says "Start here".
// The card style follows the collection's "Card style (dev)" switch.
import { useEffect, useState } from 'react'
import styles from './Collection.module.css'
import path from './CardPath.module.css'
import { FoundCard, FaceDownCard } from './collection/cards'
import { readCardLook, saveCardLook, lookClass } from './collection/cardLook'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { cardsSeen, markCardsSeen } from '../shared/devLooks'
import { useFadeNavigate } from '../shared/SharedLayout'

const FLIP_AFTER = 700   // ms: let the page fade in first
const FLIP_STAGGER = 260 // ms between cards when several turn at once

// One place on the path: both faces stacked, turned to the front once the
// room is done. A card finished since the last visit starts face down and
// turns over shortly after the page appears.
function PathCard({ a, done, seen, order, onOpen }) {
  const [front, setFront] = useState(done && seen)
  useEffect(() => {
    if (!done || seen) return
    const t = setTimeout(() => { setFront(true); markCardsSeen([a.level]) }, FLIP_AFTER + order * FLIP_STAGGER)
    return () => clearTimeout(t)
  }, [done, seen, order, a.level])

  return (
    <div className={`${path.flip} ${front ? path.flipped : ''}`}>
      <div className={path.inner}>
        <div className={`${path.face} ${path.backFace}`} aria-hidden={front || undefined}>
          <FaceDownCard a={a} onOpen={onOpen} tabIndex={front ? -1 : undefined} />
        </div>
        {done && (
          <div className={`${path.face} ${path.frontFace}`} aria-hidden={!front || undefined}>
            <FoundCard a={a} onOpen={onOpen} tabIndex={front ? undefined : -1} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function CardPath() {
  const navigate = useFadeNavigate()
  const [look, setLook] = useState(readCardLook)
  const [seen] = useState(cardsSeen)          // as it was when the page opened
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  const toTurn = ARTIFACTS.filter(a => isLevelComplete(a.level) && !seen.includes(a.level)).map(a => a.level)

  return (
    <div className={`${styles.page} ${path.page} ${lookClass(look)}`}>
      <div className={styles.lookSwitch} role="group" aria-label="Card style (dev)">
        <span>Card style (dev):</span>
        {[['card', 'Collectible'], ['museum', 'Museum'], ['hybrid', 'Hybrid']].map(([v, label]) => (
          <button key={v} type="button" aria-pressed={look === v} className={look === v ? styles.lookOn : ''} onClick={() => { setLook(v); saveCardLook(v) }}>
            {label}
          </button>
        ))}
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>Interface Artifacts</h1>
        <span className={styles.count}>{found} of {ARTIFACTS.length} found</span>
      </div>

      <ol className={path.grid}>
        {ARTIFACTS.map((a, i) => (
          <li key={a.level} className={path.cell} style={{ animationDelay: `${i * 150}ms` }}>
            {found === 0 && i === 0 && <span className={path.startHere}>Start here</span>}
            <PathCard
              a={a}
              done={isLevelComplete(a.level)}
              seen={seen.includes(a.level)}
              order={Math.max(0, toTurn.indexOf(a.level))}
              onOpen={() => navigate(a.path)}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
