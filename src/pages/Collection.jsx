// src/pages/Collection.jsx
//
// The six artifacts a visitor collects by finishing each room, laid out as
// a set of collectible cards in timeline order. A found card shows its set
// number, year, a drawing of the room's device on an era-coloured plate,
// the artifact's name, the room and its description as the card's small
// print. A room not finished yet is a card lying face down. Every card
// opens its room. Found or not comes from isLevelComplete(n); the text from
// src/data/artifacts.js. Reached from the timeline's "Collection · N of 6".
import { useRef, useState } from 'react'
import styles from './Collection.module.css'
import hud from '../shared/SharedLayout.module.css'
import DeviceArt from './collection/DeviceArt'
import { ARTIFACTS } from '../data/artifacts'
import { isLevelComplete } from '../state/state'
import { useFadeNavigate } from '../shared/SharedLayout'

// Each era's plate behind its device, as one palette: the same muted
// strength and near-equal lightness, the hue moving through the eras —
// phosphor sage, Platinum blue, Netscape teal, pewter, 2016 clay, umber
const PLATES = ['#5b7d68', '#7d93a6', '#4f8487', '#89909b', '#c48c78', '#7a6a5d']
const pad = (n) => String(n).padStart(2, '0')

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

function FoundCard({ a, onOpen }) {
  const tilt = useTilt()
  return (
    <button type="button" className={`${styles.card} ${styles.front}`} onClick={onOpen} {...tilt}>
      <span className={styles.top}>
        <span className={styles.number}>No. {pad(a.level + 1)}</span>
        <span className={styles.year}>{a.year}</span>
      </span>
      <span className={styles.plate} style={{ background: PLATES[a.level] }}>
        <DeviceArt level={a.level} />
      </span>
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

function FaceDownCard({ a, onOpen }) {
  const tilt = useTilt()
  return (
    <button type="button" className={`${styles.card} ${styles.back}`} onClick={onOpen} {...tilt}>
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

// Looks to compare while deciding (dev server only): 'card', the
// collectible cards; 'museum', the same cards in the museum's own style
// (square corners, white, sans, still); 'hybrid', the museum's square
// corners and sans with the collectible's card stock, tilt and light.
// Remembered per browser.
const STYLE_KEY = 'ux-archaeologist:collection-style'
const LOOKS = ['card', 'museum', 'hybrid']
const readStyle = () => { try { const v = localStorage.getItem(STYLE_KEY); return LOOKS.includes(v) ? v : 'card' } catch { return 'card' } }

export default function Collection() {
  const navigate = useFadeNavigate()
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  const [look, setLook] = useState(() => (import.meta.env.DEV ? readStyle() : 'card'))
  const chooseLook = (v) => { setLook(v); try { localStorage.setItem(STYLE_KEY, v) } catch { /* storage blocked */ } }

  return (
    <div className={`${styles.page} ${look !== 'card' ? styles.museum : ''} ${look === 'hybrid' ? styles.hybrid : ''}`}>
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
