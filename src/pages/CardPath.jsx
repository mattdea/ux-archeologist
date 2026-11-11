// src/pages/CardPath.jsx
//
// The timeline as a path of the collection's cards (dev switch, under
// consideration). All six start face down; finishing a room turns its card
// over the next time you come back here, and from then on it stays face
// up. You navigate by the cards: each one opens its room. A thin line joins
// them in order. With nothing done yet, the first card says "Start here".
// The card style and art follow the dev panel's card style and card art.
import { useEffect, useState } from 'react'
import styles from './Collection.module.css'
import path from './CardPath.module.css'
import { FoundCard, FaceDownCard } from './collection/cards'
import { readCardLook, lookClass, readCardArt } from './collection/cardLook'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { cardsSeen, markCardsSeen } from '../shared/devLooks'
import { useFadeNavigate } from '../shared/SharedLayout'
import { useDevChange } from '../shared/dev/devEvents'

const FLIP_AFTER = 700   // ms: let the page fade in first
const FLIP_STAGGER = 260 // ms between cards when several turn at once

const FLIP_MS = 900      // the turn itself (CardPath.module.css .inner)

// One place on the path. At rest it's just the card, face down or face up.
// Only while a card turns over are both faces stacked in a 3D flip: kept
// any longer, a card tilting towards the pointer dips behind the flip's
// plane and the wrapper takes its clicks.
function PathCard({ a, done, seen, order, onOpen, art }) {
  // 'down' → 'turning' (faces stacked, about to rotate) → 'rotating' → 'up'
  const [stage, setStage] = useState(done && seen ? 'up' : 'down')
  useEffect(() => {
    if (!done || seen) return
    const timers = []
    timers.push(setTimeout(() => {
      setStage('turning')
      requestAnimationFrame(() => requestAnimationFrame(() => setStage('rotating')))
      markCardsSeen([a.level])
      timers.push(setTimeout(() => setStage('up'), FLIP_MS + 50))
    }, FLIP_AFTER + order * FLIP_STAGGER))
    return () => timers.forEach(clearTimeout)
  }, [done, seen, order, a.level])

  if (stage === 'down') return <FaceDownCard a={a} onOpen={onOpen} />
  if (stage === 'up') return <FoundCard a={a} art={art} onOpen={onOpen} />
  return (
    <div className={`${path.flip} ${stage === 'rotating' ? path.flipped : ''}`} aria-hidden="true">
      <div className={path.inner}>
        <div className={`${path.face} ${path.backFace}`}><FaceDownCard a={a} tabIndex={-1} /></div>
        <div className={`${path.face} ${path.frontFace}`}><FoundCard a={a} art={art} tabIndex={-1} /></div>
      </div>
    </div>
  )
}

export default function CardPath() {
  const navigate = useFadeNavigate()
  const [look, setLook] = useState(readCardLook)
  const [art, setArt] = useState(readCardArt)
  useDevChange(() => { setLook(readCardLook()); setArt(readCardArt()) })
  const [seen] = useState(cardsSeen)          // as it was when the page opened
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  const toTurn = ARTIFACTS.filter(a => isLevelComplete(a.level) && !seen.includes(a.level)).map(a => a.level)

  return (
    <div className={`${styles.page} ${path.page} ${lookClass(look)}`}>
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
              art={art}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
