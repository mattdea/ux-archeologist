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
// Round 2's concepts (B2, G) show the level frame twice, around a wide
// artifact and a tall one (`frames` in concepts.js), and G brings a third
// card art, its dot illustrations.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import lab from './styleLab/lab.module.css'
import { CONCEPTS, SCREENS } from './styleLab/concepts'
import { useFadeNavigate } from '../shared/SharedLayout'

const ART_KEY = 'ux-archaeologist:style-lab-art'
const DOTS_KEY = 'ux-archaeologist:style-lab-dots'
const readArt = () => { try { return localStorage.getItem(ART_KEY) === 'drawn' ? 'drawn' : 'illustrated' } catch { return 'illustrated' } }
// A concept with its own dot art shows it unless Drawn or Illustrated was chosen there
const readDots = () => { try { return localStorage.getItem(DOTS_KEY) !== 'off' } catch { return true } }

const hashFor = (id, screen = 'title', level) => `#${id}/${screen}${level === undefined ? '' : `/${level}`}`

// The level frames a concept shows: one (room 0) or the two in `frames`
const framesOf = (c) => c.frames ?? [{ level: 0, label: 'Level frame' }]

function parseHash(hash) {
  const [id, screen, level] = hash.replace(/^#/, '').split('/')
  const concept = CONCEPTS.find(c => c.id === id)
  if (!concept) return null
  const n = Number(level)
  return {
    concept,
    screen: SCREENS.some(s => s.id === screen) ? screen : 'title',
    level: level !== undefined && Number.isInteger(n) && n >= 0 && n <= 5 ? n : framesOf(concept)[0].level,
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
// other screens (href for <a>, go for buttons), and which card art to use
// ('drawn', 'illustrated' or, in a concept with dot art, 'dots').
function conceptProps(concept, screen, level, look, thumb = false) {
  return {
    screen,
    level,
    art: concept.dotArt && look.dots ? 'dots' : look.art,
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

// The screens a concept shows, in order: title, timeline, collection, then
// its level frame or frames
const viewsOf = (c) => [
  ...SCREENS.filter(s => s.id !== 'level').map(s => ({ screen: s.id, label: s.label })),
  ...framesOf(c).map(f => ({ screen: 'level', level: f.level, label: f.label })),
]

function Index({ look }) {
  const navigate = useFadeNavigate()
  return (
    <div className={lab.index} data-lab-index>
      <header className={lab.indexHead}>
        <h1 className={lab.indexTitle}>Style lab (dev)</h1>
        <p className={lab.indexNote}>
          Museum restyle. {CONCEPTS.length} concepts (A&ndash;F from round 1, B2 and G from round 2), as static mocks of the title, timeline, collection and level frame with the museum&rsquo;s real text. Nothing in the game uses them.
        </p>
        <button type="button" onClick={() => navigate('/timeline')}>← Back to timeline</button>
      </header>
      <div className={lab.columns}>
        {CONCEPTS.map(c => (
          <section key={c.id} className={lab.concept} aria-label={`${c.letter}. ${c.name}`}>
            <h2 className={lab.conceptName}><a href={hashFor(c.id)}>{c.letter}. {c.name}</a></h2>
            <p className={lab.conceptBlurb}>{c.blurb}</p>
            {viewsOf(c).map(v => (
              // The link is the label; its ::after covers the picture above
              // it, so the picture (which has links of its own, inert) isn't
              // nested inside an <a>
              <div key={`${v.screen}${v.level ?? ''}`} className={lab.thumbCell}>
                <Thumb><c.Component {...conceptProps(c, v.screen, v.level ?? 0, look, true)} /></Thumb>
                <a className={lab.thumbLink} href={hashFor(c.id, v.screen, c.frames ? v.level : undefined)} aria-label={`${c.letter}. ${c.name}: ${v.label}`}>{v.label}</a>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

function ConceptView({ at, look, setArt }) {
  const { concept, screen, level } = at
  const i = CONCEPTS.indexOf(concept)
  const prev = CONCEPTS[(i + CONCEPTS.length - 1) % CONCEPTS.length]
  const next = CONCEPTS[(i + 1) % CONCEPTS.length]
  const scroller = useRef(null)
  // A new screen starts at its top
  useEffect(() => { scroller.current?.scrollTo?.(0, 0) }, [concept.id, screen, level])
  const props = conceptProps(concept, screen, level, look)
  const arts = [['drawn', 'Drawn'], ['illustrated', 'Illustrated'], ...(concept.dotArt ? [['dots', 'Dots']] : [])]

  return (
    <>
      <nav className={lab.bar} aria-label="Style lab" data-lab-bar>
        <a href="#">← Style lab</a>
        <span className={lab.barName}>{concept.letter}. {concept.name}</span>
        <span className={lab.barGroup}>
          {viewsOf(concept).map(v => {
            // With one level frame the tab keeps whichever room you are in;
            // with two, each tab is its own room
            const here = v.screen === screen && (v.screen !== 'level' || !concept.frames || v.level === level)
            const to = v.screen !== 'level' ? undefined : concept.frames ? v.level : level
            return <a key={`${v.screen}${v.level ?? ''}`} href={hashFor(concept.id, v.screen, to)} aria-current={here ? 'page' : undefined}>{v.label}</a>
          })}
        </span>
        <span className={lab.barSpacer} />
        <span className={lab.barGroup} role="group" aria-label="Card art">
          <span>Art:</span>
          {arts.map(([v, label]) => (
            <button key={v} type="button" aria-pressed={props.art === v} onClick={() => setArt(v)}>{label}</button>
          ))}
        </span>
        <span className={lab.barGroup}>
          <a href={hashFor(prev.id, screen)} aria-label={`Previous concept: ${prev.name}`}>‹ {prev.letter}</a>
          <a href={hashFor(next.id, screen)} aria-label={`Next concept: ${next.name}`}>{next.letter} ›</a>
        </span>
      </nav>
      <div className={lab.stage}>
        <div className={lab.scroll} ref={scroller} data-lab-scroll>
          <concept.Component key={concept.id} {...props} />
        </div>
      </div>
    </>
  )
}

export default function StyleLab() {
  const at = parseHash(useHash())
  const [look, setLook] = useState(() => ({ art: readArt(), dots: readDots() }))
  // Drawn and Illustrated are remembered for every concept; Dots only says
  // whether a concept with dot art shows it
  const setArt = (v) => {
    const next = v === 'dots' ? { ...look, dots: true } : { art: v, dots: false }
    setLook(next)
    try {
      localStorage.setItem(ART_KEY, next.art)
      localStorage.setItem(DOTS_KEY, next.dots ? 'on' : 'off')
    } catch { /* storage blocked */ }
  }
  return (
    <div className={lab.root}>
      {at ? <ConceptView at={at} look={look} setArt={setArt} /> : <Index look={look} />}
    </div>
  )
}
