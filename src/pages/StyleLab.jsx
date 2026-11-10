// src/pages/StyleLab.jsx
//
// The style lab (dev server only, at /style-lab or "Style lab (dev)" on the
// timeline): phase 1 of the museum restyle in docs/backlog.md. It opens on
// an index of the concepts side by side; each concept is a static mock of
// four screens (title, timeline, collection, one level frame) using the
// museum's real text (styleLab/content.js). The lab shares nothing with the
// real museum components: delete this file, src/pages/styleLab/, its test,
// its screenshots (docs/style-lab/, scripts/style-lab-shots.mjs) and the
// three dev-only hooks (views.js, SharedLayout.jsx, Timeline.jsx) and it is
// gone.
//
// Where you are lives in the hash, so every screen has its own address:
//   /style-lab            the index
//   /style-lab#a/timeline concept A's timeline
//   /style-lab#d/level/3  concept D's level frame, for room 3 (2007)
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import lab from './styleLab/lab.module.css'
import { CONCEPTS, SCREENS } from './styleLab/concepts'
import { useFadeNavigate } from '../shared/SharedLayout'

const ART_KEY = 'ux-archaeologist:style-lab-art'
const readArt = () => { try { return localStorage.getItem(ART_KEY) === 'drawn' ? 'drawn' : 'illustrated' } catch { return 'illustrated' } }

const hashFor = (id, screen = 'title', level) => `#${id}/${screen}${level === undefined ? '' : `/${level}`}`

function parseHash(hash) {
  const [id, screen, level] = hash.replace(/^#/, '').split('/')
  const concept = CONCEPTS.find(c => c.id === id)
  if (!concept) return null
  const n = Number(level)
  return {
    concept,
    screen: SCREENS.some(s => s.id === screen) ? screen : 'title',
    level: Number.isInteger(n) && n >= 0 && n <= 5 ? n : 0,
  }
}

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

// What every concept is given: which screen and room to draw, links to its
// other screens (href for <a>, go for buttons), and which card art to use.
function conceptProps(concept, screen, level, art, thumb = false) {
  return {
    screen,
    level,
    art,
    thumb,
    href: (s, l) => hashFor(concept.id, s, l),
    go: (s, l) => { window.location.hash = hashFor(concept.id, s, l) },
  }
}

// A concept's screen drawn at 1440 × 900 and scaled down to the width of its
// box, inert: a picture of the screen, not a second copy to tab through.
function Thumb({ children }) {
  const box = useRef(null)
  const [k, setK] = useState(0.15)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => { const w = el.getBoundingClientRect().width; if (w) setK(w / 1440) }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <span className={lab.thumb} ref={box} aria-hidden="true">
      <span className={lab.thumbStage} style={{ transform: `scale(${k})` }} inert>
        {children}
      </span>
    </span>
  )
}

function Index({ art }) {
  const navigate = useFadeNavigate()
  return (
    <div className={lab.index} data-lab-index>
      <header className={lab.indexHead}>
        <h1 className={lab.indexTitle}>Style lab (dev)</h1>
        <p className={lab.indexNote}>
          Museum restyle, phase 1. {CONCEPTS.length} concepts, four screens each, as static mocks with the museum&rsquo;s real text. Nothing in the game uses them.
        </p>
        <button type="button" onClick={() => navigate('/timeline')}>← Back to timeline</button>
      </header>
      <div className={lab.columns}>
        {CONCEPTS.map(c => (
          <section key={c.id} className={lab.concept} aria-label={`${c.letter}. ${c.name}`}>
            <h2 className={lab.conceptName}><a href={hashFor(c.id)}>{c.letter}. {c.name}</a></h2>
            <p className={lab.conceptBlurb}>{c.blurb}</p>
            {SCREENS.map(s => (
              // The link is the label; its ::after covers the picture above
              // it, so the picture (which has links of its own, inert) isn't
              // nested inside an <a>
              <div key={s.id} className={lab.thumbCell}>
                <Thumb><c.Component {...conceptProps(c, s.id, 0, art, true)} /></Thumb>
                <a className={lab.thumbLink} href={hashFor(c.id, s.id)} aria-label={`${c.letter}. ${c.name}: ${s.label}`}>{s.label}</a>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

function ConceptView({ at, art, setArt }) {
  const { concept, screen, level } = at
  const i = CONCEPTS.indexOf(concept)
  const prev = CONCEPTS[(i + CONCEPTS.length - 1) % CONCEPTS.length]
  const next = CONCEPTS[(i + 1) % CONCEPTS.length]
  const scroller = useRef(null)
  // A new screen starts at its top
  useEffect(() => { scroller.current?.scrollTo?.(0, 0) }, [concept.id, screen, level])

  return (
    <>
      <nav className={lab.bar} aria-label="Style lab" data-lab-bar>
        <a href="#">← Style lab</a>
        <span className={lab.barName}>{concept.letter}. {concept.name}</span>
        <span className={lab.barGroup}>
          {SCREENS.map(s => (
            <a key={s.id} href={hashFor(concept.id, s.id, s.id === 'level' ? level : undefined)} aria-current={s.id === screen ? 'page' : undefined}>{s.label}</a>
          ))}
        </span>
        <span className={lab.barSpacer} />
        <span className={lab.barGroup} role="group" aria-label="Card art">
          <span>Art:</span>
          {[['drawn', 'Drawn'], ['illustrated', 'Illustrated']].map(([v, label]) => (
            <button key={v} type="button" aria-pressed={art === v} onClick={() => setArt(v)}>{label}</button>
          ))}
        </span>
        <span className={lab.barGroup}>
          <a href={hashFor(prev.id, screen)} aria-label={`Previous concept: ${prev.name}`}>‹ {prev.letter}</a>
          <a href={hashFor(next.id, screen)} aria-label={`Next concept: ${next.name}`}>{next.letter} ›</a>
        </span>
      </nav>
      <div className={lab.stage}>
        <div className={lab.scroll} ref={scroller} data-lab-scroll>
          <concept.Component key={concept.id} {...conceptProps(concept, screen, level, art)} />
        </div>
      </div>
    </>
  )
}

export default function StyleLab() {
  const at = parseHash(useHash())
  const [art, setArtState] = useState(readArt)
  const setArt = (v) => { setArtState(v); try { localStorage.setItem(ART_KEY, v) } catch { /* storage blocked */ } }
  return (
    <div className={lab.root}>
      {at ? <ConceptView at={at} art={art} setArt={setArt} /> : <Index art={art} />}
    </div>
  )
}
