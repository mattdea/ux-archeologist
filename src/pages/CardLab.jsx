// src/pages/CardLab.jsx
//
// The card lab (dev server only, at /card-lab or "Card lab (dev)" on the
// timeline): every card design in src/pages/cardLab/variants.js, one row
// each, all six artifacts side by side (or fanned, stacked, scattered). Click a card to turn it over;
// "Fronts" and "Backs" turn them all. The cards are the collection's own
// (collection/cards.jsx), so a change there shows here too.
import { useState } from 'react'
import styles from './Collection.module.css'
import lab from './CardLab.module.css'
import hud from '../shared/SharedLayout.module.css'
import { FoundCard, FaceDownCard } from './collection/cards'
import { lookClass } from './collection/cardLook'
import { VARIANTS } from './cardLab/variants'
import { LabFace } from './cardLab/LabCards'
import { ARTIFACTS } from '../data/artifacts'
import { useFadeNavigate } from '../shared/SharedLayout'

const SIZES = { S: 220, M: 260, L: 300 }
const SIZE_KEY = 'ux-archaeologist:card-lab-size'
const readSize = () => { try { const v = localStorage.getItem(SIZE_KEY); return v in SIZES ? v : 'M' } catch { return 'M' } }

// How a row lays its cards out (variants.js `arrange`): a style for the
// card in place i of n. 'row' is a plain row; the rest overlap, turn or
// drift (CardLab.module.css .fan, .deck, .scatter, .stagger).
const TILT = [-6, 4, -2, 7, -4, 3]
const DRIFT = [0, 26, -12, 18, -4, 30]
const ARRANGE = {
  row: () => ({}),
  fan: (i, n) => {
    const d = i - (n - 1) / 2
    return { '--rot': `${d * 7}deg`, '--dy': `${d * d * 7}px` }
  },
  deck: (i) => ({ '--rot': `${TILT[i % 6] / 2}deg`, '--dy': `${-i * 2}px` }),
  scatter: (i) => ({ '--rot': `${TILT[i % 6]}deg`, '--dy': `${DRIFT[i % 6]}px` }),
  stagger: (i) => ({ '--dy': `${i % 2 ? 48 : 0}px` }),
}

// One card that turns over on click. Both faces are always stacked; the
// whole place takes the click, so a tilted card can't lose it.
function FlipCard({ a, v, backUp, onFlip }) {
  return (
    <div
      className={`${lab.flip} ${backUp ? lab.flipped : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${a.name}, ${v.name}: turn over`}
      aria-pressed={backUp}
      onClick={onFlip}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFlip() } }}
    >
      <div className={lab.inner}>
        <div className={lab.face}>
          {v.design ? <LabFace a={a} v={v} side="front" /> : <FoundCard a={a} art={v.art} plates={v.plates} tabIndex={-1} />}
        </div>
        <div className={`${lab.face} ${lab.backFace}`}>
          {v.design ? <LabFace a={a} v={v} side="back" /> : <FaceDownCard a={a} tabIndex={-1} />}
        </div>
      </div>
    </div>
  )
}

export default function CardLab() {
  const navigate = useFadeNavigate()
  const [size, setSize] = useState(readSize)
  const [only, setOnly] = useState('all')          // 'all' or a level
  const [allBack, setAllBack] = useState(false)    // the default side
  const [turned, setTurned] = useState({})         // cards turned from the default

  const chooseSize = (s) => { setSize(s); try { localStorage.setItem(SIZE_KEY, s) } catch { /* storage blocked */ } }
  const showAll = (back) => { setAllBack(back); setTurned({}) }
  const artifacts = only === 'all' ? ARTIFACTS : ARTIFACTS.filter(a => a.level === Number(only))

  return (
    <div className={lab.page} style={{ '--lab-w': `${SIZES[size]}px` }}>
      <div className={lab.bar}>
        <h1 className={lab.title}>Card lab (dev)</h1>
        <div className={lab.controls}>
          <div className={styles.lookSwitch} role="group" aria-label="Show">
            <span>Show:</span>
            {[[false, 'Fronts'], [true, 'Backs']].map(([back, label]) => (
              <button key={label} type="button" aria-pressed={allBack === back && !Object.keys(turned).length} className={allBack === back && !Object.keys(turned).length ? styles.lookOn : ''} onClick={() => showAll(back)}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.lookSwitch} role="group" aria-label="Size">
            <span>Size:</span>
            {Object.keys(SIZES).map(s => (
              <button key={s} type="button" aria-pressed={size === s} className={size === s ? styles.lookOn : ''} onClick={() => chooseSize(s)}>
                {s}
              </button>
            ))}
          </div>
          <label className={lab.select}>
            <span>Artifacts:</span>
            <select value={only} onChange={(e) => setOnly(e.target.value)}>
              <option value="all">All six</option>
              {ARTIFACTS.map(a => <option key={a.level} value={a.level}>{a.year} · {a.name}</option>)}
            </select>
          </label>
          <button type="button" className={`${hud.backLink} ${lab.back}`} onClick={() => navigate('/timeline')}>
            ← Back to timeline
          </button>
        </div>
      </div>

      {VARIANTS.map((v, vi) => (
        <section key={v.name} className={`${lab.variant} ${lookClass(v.look)} ${v.className ? lab[v.className] ?? '' : ''}`}>
          <h2 className={lab.variantName}>
            <span className={lab.variantNo}>{String(vi + 1).padStart(2, '0')}</span>
            {v.name}
            {v.note && <span className={lab.variantNote}>{v.note}</span>}
          </h2>
          <div className={`${lab.row} ${lab[v.arrange] ?? ''}`}>
            {artifacts.map((a, i) => {
              const id = `${vi}-${a.level}`
              return (
                <div key={id} className={lab.slot} style={(ARRANGE[v.arrange] ?? ARRANGE.row)(i, artifacts.length)}>
                  <FlipCard
                    a={a}
                    v={v}
                    backUp={allBack !== !!turned[id]}
                    onFlip={() => setTurned(t => ({ ...t, [id]: !t[id] }))}
                  />
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
