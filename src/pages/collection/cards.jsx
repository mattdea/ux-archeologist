// src/pages/collection/cards.jsx
//
// The collection's cards, shared by the collection page and the card
// version of the timeline: a found card (set number, year, the device on its
// era plate, the artifact's name, the room, the description as small print)
// and a card lying face down. Styles live in Collection.module.css; the
// page that shows them puts lookClass(look) on an ancestor.
import { useRef } from 'react'
import styles from '../Collection.module.css'
import DeviceArt from './DeviceArt'
import { ARTIFACTS } from '../../data/artifacts'
import { PLATES, ILLUSTRATIONS, ILLUSTRATION_GROUND, pad } from './cardArt'

// A card tilts a few degrees towards the pointer and catches a soft light
// where it is (none under reduced motion: the CSS turns it off)
function useTilt() {
  const ref = useRef(null)
  const onPointerMove = (e) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  const onPointerLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return { ref, onPointerMove, onPointerLeave }
}

export function FoundCard({ a, onOpen, tabIndex, art = 'drawn', plates = PLATES }) {
  const tilt = useTilt()
  return (
    <button type="button" className={`${styles.card} ${styles.front}`} onClick={onOpen} tabIndex={tabIndex} {...tilt}>
      <span className={styles.top}>
        <span className={styles.number}>No. {pad(a.level + 1)}</span>
        <span className={styles.year}>{a.year}</span>
      </span>
      {art === 'illustrated' && ILLUSTRATIONS[a.level] ? (
        <span className={`${styles.plate} ${styles.plateIllustrated}`} style={{ background: ILLUSTRATION_GROUND[a.level] }}>
          <img src={ILLUSTRATIONS[a.level]} alt="" />
        </span>
      ) : (
        <span className={styles.plate} style={{ background: plates[a.level] }}>
          <DeviceArt level={a.level} />
        </span>
      )}
      <span className={styles.name}>{a.name}</span>
      <span className={styles.room}>{a.title}</span>
      <span className={styles.rule} />
      <span className={styles.description}>{a.description}</span>
      <span className={styles.foot}>
        <span>Interface Artifacts</span>
        <span>{a.level + 1} / {ARTIFACTS.length}</span>
      </span>
      <span className={styles.sheen} aria-hidden="true" />
    </button>
  )
}

export function FaceDownCard({ a, onOpen, tabIndex }) {
  const tilt = useTilt()
  return (
    <button type="button" className={`${styles.card} ${styles.back}`} onClick={onOpen} tabIndex={tabIndex} {...tilt}>
      <span className={styles.backInner}>
        <span className={styles.backNumber}>No. {pad(a.level + 1)}</span>
        <span className={styles.backSeal}>
          <span className={styles.backYear}>{a.year}</span>
        </span>
        <span className={styles.backRoom}>{a.title}</span>
        <span className={styles.backNote}>Finish this room to add it.</span>
      </span>
    </button>
  )
}
