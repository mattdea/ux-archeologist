// src/shared/index-museum/IndexMuseum.jsx
//
// The index museum: one monospace list that is the whole museum (backlog,
// "the index museum", from concept B2 in the style lab). SharedLayout
// renders it in place of the classic HUD when src/shared/museumStyle.js
// says 'index'. It stays mounted from view to view, and its lines are keyed,
// so moving between views redraws the list in place: lines that stay, stay;
// new ones type in; gone ones go.
//
//  - Title, timeline and collection are the list itself (App renders no
//    page for them), with the peeked room's dot picture or the collection's
//    cards beside it.
//  - In a level the list is the HUD: a column down the left (data-hud="side")
//    on a wide window, a band across the top (data-hud="top") on a narrow
//    one, and useArtifactFit puts the artifact in the rest. The open room's
//    line is inverted and its intro, objectives, hint, Continue or discovery
//    open under it, one at a time, from what the level publishes
//    (store.js, src/shared/museum/).
//
// Lines: [cursor][mark][text][leader][meta][arrow]. A dotted leader means
// the line can be chosen; the arrow says what it does (→ goes, ↗ leaves the
// site, + / − opens / closes). Inverted = where you are, or keyboard focus.
// Pointer hover is lighter: the > cursor and an underline. Grey (the second
// ink) is for what's secondary: leaders, right-hand sides, [ ], the hint,
// labels and rooms you're not in.
//
// Keyboard: arrow keys move through the list's lines, Home / End jump,
// Enter opens, Escape closes what's open (About, the reset question). Tab
// order is the DOM order, as for any page.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import s from './IndexMuseum.module.css'
import { ARTIFACTS } from '../../data/artifacts'
import { isLevelComplete, completeLevel, resetAll } from '../../state/state'
import { cardTimelineOn, forgetCardsSeen } from '../devLooks'
import { setMuseumStyle } from '../museumStyle'
import { useIndexSlots, peekHandlers } from './store'
import { TITLE, ABOUT, WORDS, pad } from './words'
import DotPicture from './DotPicture'

const NARROW = '(max-width: 899.98px)'
const SMALL = '(max-width: 599.98px)'
const SMALL_KEY = 'ux-archaeologist:small-screen-dismissed'   // shared with the classic notice

function useMedia(query) {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches
  const [on, setOn] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return
    const change = () => setOn(mq.matches)
    mq.addEventListener?.('change', change)
    return () => mq.removeEventListener?.('change', change)
  }, [query])
  return on
}

function smallDismissed() {
  try { return window.sessionStorage.getItem(SMALL_KEY) === '1' } catch { return false }
}

// ── A line ──────────────────────────────────────────────────────────────
function Line({ as = 'text', i = 0, onClick, href, mark = '', text, meta, arrow, sub, current, dim, quiet, bare, peek, focus, label }) {
  const ref = useRef(null)
  useEffect(() => { if (focus) ref.current?.focus({ preventScroll: false }) }, [focus])
  const chooses = as === 'go' || as === 'ext'
  const cls = [s.line, sub && s.sub, current && s.current, dim && s.dim, quiet && s.quiet, chooses && s.choose].filter(Boolean).join(' ')
  const inner = (
    <>
      <span className={s.cursor} aria-hidden="true" />
      <span className={s.mark}>{mark}</span>
      <span className={s.text}>{text}</span>
      {chooses && !bare ? <span className={s.leader} aria-hidden="true" /> : <span className={s.space} />}
      {meta || arrow ? (
        <span className={s.end}>
          {meta ? <span className={s.meta}>{meta}</span> : null}
          {arrow ? <span className={s.arrow} aria-hidden="true">{arrow}</span> : null}
        </span>
      ) : null}
    </>
  )
  const common = { ref, className: cls, style: { '--i': Math.min(i, 30) }, ...(peek ?? {}) }
  if (as === 'go') return <button type="button" data-ix-nav onClick={onClick} aria-current={current ? 'page' : undefined} aria-label={label} {...common}>{inner}</button>
  if (as === 'ext') return <a data-ix-nav href={href} target="_blank" rel="noopener noreferrer" {...common}>{inner}</a>
  return <div aria-current={current ? 'page' : undefined} {...common}>{inner}</div>
}

function Note({ i = 0, mark = '', children, quiet, italic }) {
  return (
    <div className={`${s.line} ${s.sub} ${s.note} ${quiet ? s.quiet : ''}`} style={{ '--i': Math.min(i, 30) }}>
      <span className={s.cursor} aria-hidden="true" />
      <span className={s.mark}>{mark}</span>
      <p className={`${s.noteText} ${italic ? s.italic : ''}`}>{children}</p>
    </div>
  )
}

const Gap = ({ i }) => <div className={s.gap} style={{ '--i': i }} aria-hidden="true" />

// ── The museum ──────────────────────────────────────────────────────────
export default function IndexMuseum({ view, navigate, continueAction, hudReady }) {
  const slots = useIndexSlots()
  const narrow = useMedia(NARROW)
  const small = useMedia(SMALL)
  const [smallGone, setSmallGone] = useState(smallDismissed)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [asking, setAsking] = useState(false)          // the reset question
  const [, refresh] = useState(0)
  const listRef = useRef(null)

  const levelMatch = /^level(\d)$/.exec(view)
  const level = levelMatch ? Number(levelMatch[1]) : null
  const inLevel = level !== null
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length

  // Whatever was open closes when the view changes
  useEffect(() => { setAboutOpen(false); setAsking(false) }, [view])

  // What the open room shows, from what the level published
  const roomState = !inLevel ? null
    : slots.intro ? 'intro'
    : slots.discovery ? 'discovery'
    : hudReady ? 'playing' : 'booting'

  // In a level the list's box is the HUD the artifact is fitted around, and
  // its size changes with what's open: tell useArtifactFit (it listens for
  // resize) and give Level 5's full-width chat its inset.
  useLayoutEffect(() => {
    const el = listRef.current
    const root = document.documentElement.style
    if (!inLevel || !el) return
    const publish = () => {
      const r = el.getBoundingClientRect()
      root.setProperty('--museum-inset-left', narrow ? '0px' : `${r.right}px`)
      root.setProperty('--museum-inset-top', narrow ? `${r.bottom + 16}px` : '24px')
      window.dispatchEvent(new Event('resize'))
    }
    publish()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(publish) : null
    ro?.observe(el)
    return () => {
      ro?.disconnect()
      root.removeProperty('--museum-inset-left')
      root.removeProperty('--museum-inset-top')
    }
  }, [inLevel, narrow, view])

  // Keyboard, like a terminal menu: arrows move, Home / End jump, Escape
  // closes. Listened for on window in the capture phase, so it runs before
  // an artifact's own document-level listeners (Level 0's terminal pulls
  // focus back on every keydown); while the list has focus, its keys stay
  // with the list. Any other key (typing) goes on to the artifact as usual.
  const openRef = useRef({ asking, aboutOpen })
  openRef.current = { asking, aboutOpen }
  useEffect(() => {
    const MENU_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Enter', ' ', 'Tab']
    const onKey = (e) => {
      const list = listRef.current
      if (!list || !list.contains(e.target) || !MENU_KEYS.includes(e.key)) return
      e.stopPropagation()
      if (e.key === 'Escape') {
        if (openRef.current.asking) { e.preventDefault(); setAsking(false) }
        else if (openRef.current.aboutOpen) { e.preventDefault(); setAboutOpen(false) }
        return
      }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return   // Enter, Space, Tab: the browser's own
      const items = [...list.querySelectorAll('[data-ix-nav]')]
      if (!items.length) return
      const at = items.indexOf(document.activeElement)
      const next = e.key === 'Home' ? 0
        : e.key === 'End' ? items.length - 1
        : e.key === 'ArrowDown' ? (at < 0 ? 0 : Math.min(items.length - 1, at + 1))
        : (at < 0 ? items.length - 1 : Math.max(0, at - 1))
      e.preventDefault()
      items[next].focus()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  // ── The lines, in order. Keys are stable from view to view. ───────────
  const L = []
  let n = 0
  const push = (el) => { L.push(el); n++ }

  if (small && !smallGone) {
    push(<Note key="small" i={n}>{WORDS.smallScreen}</Note>)
    push(<Line key="small-go" i={n} as="go" sub text={WORDS.smallScreenGo} arrow="→" focus
      onClick={() => { try { window.sessionStorage.setItem(SMALL_KEY, '1') } catch { /* blocked */ } setSmallGone(true) }} />)
    push(<Gap key="small-gap" i={n} />)
  }

  // The museum's name: a heading on the title, a way back to it elsewhere
  if (view === 'title') push(<Line key="name" i={n} text={TITLE.name} />)
  else push(<Line key="name" i={n} as="go" text={TITLE.name} arrow="→" onClick={() => navigate('/')} />)

  if (view === 'title') {
    push(<Note key="subtitle" i={n}>{TITLE.subtitle}</Note>)
    push(<Gap key="title-gap" i={n} />)
    push(<Line key="enter" i={n} as="go" sub text={TITLE.enter} arrow="→" focus={!small || smallGone} onClick={() => navigate('/timeline')} />)
  }
  push(<Gap key="rooms-gap" i={n} />)

  // ── The six rooms (on the collection, its entries are the rooms) ──
  const nextToPlay = ARTIFACTS.find(a => !isLevelComplete(a.level))?.level ?? 0
  if (view !== 'collection') ARTIFACTS.forEach(a => {
    const done = isLevelComplete(a.level)
    const open = a.level === level
    if (inLevel && !open) {
      // rooms you're not in: one quiet line each (folded away on a narrow window)
      if (!narrow) push(<Line key={`room-${a.level}`} i={n} as="go" dim bare mark={a.year} text={a.title} onClick={() => navigate(a.path)} />)
      return
    }
    if (open) {
      push(<Line key={`room-${a.level}`} i={n} current mark={a.year} text={a.title} meta={done ? a.name : null} />)
      const before = L.length
      pushRoom(a)
      if (L.length > before && a.level < ARTIFACTS.length - 1 && !narrow) push(<Gap key={`room-gap-${a.level}`} i={n} />)
      return
    }
    push(<Line key={`room-${a.level}`} i={n} as="go" mark={a.year} text={a.title}
      meta={done ? a.name : <span className={s.quiet}>{WORDS.notFound}</span>} arrow="→"
      peek={peekHandlers(a.level)} focus={view === 'timeline' && a.level === nextToPlay}
      onClick={() => navigate(a.path)} />)
  })

  // What opens under the room you're in, one thing at a time
  function pushRoom(a) {
    const next = ARTIFACTS[a.level + 1]
    if (roomState === 'intro') {
      const intro = slots.intro
      push(<Note key={`intro-${a.level}`} i={n}>{intro.description}</Note>)
      push(<Gap key={`intro-gap-${a.level}`} i={n} />)
      push(<Line key={`begin-${a.level}`} i={n} as="go" sub text={WORDS.begin} arrow="→" focus onClick={() => intro.onBegin()} />)
    }
    if (roomState === 'playing' && slots.tracker) {
      const { objectives, completedIndices } = slots.tracker
      push(<Line key={`obj-label-${a.level}`} i={n} sub quiet text={WORDS.objectives} />)
      objectives.forEach((o, k) => {
        const done = completedIndices.includes(k)
        push(<Line key={`obj-${a.level}-${k}`} i={n} sub quiet={done}
          text={<span className={s.check}><span className={s.box}>{done ? '[x]' : '[ ]'}</span><span className={done ? s.struck : ''}>{o}</span></span>} />)
      })
      if (slots.hint) push(<Note key={`hint-${a.level}`} i={n} mark="?" quiet italic>{slots.hint}</Note>)
      if (continueAction) push(<Line key={`continue-${a.level}`} i={n} as="go" sub text={WORDS.cont} arrow="→" onClick={() => continueAction()} />)
    }
    if (roomState === 'discovery') {
      const d = slots.discovery
      const to = cardTimelineOn() ? '/timeline' : d.nextUrl
      const nextLabel = to === '/timeline' || !next ? WORDS.backPlain : `${next.year} ${next.title}`
      push(<Line key={`disc-label-${a.level}`} i={n} sub quiet text={WORDS.discovered} meta={d.era} />)
      push(<Line key={`disc-name-${a.level}`} i={n} sub text={d.artifactName} />)
      push(
        <div key={`disc-pic-${a.level}`} className={`${s.line} ${s.sub} ${s.pictureLine}`} style={{ '--i': n }}>
          <span className={s.cursor} /><span className={s.mark} />
          <DotPicture level={a.level} className={s.discoveryPicture} />
        </div>,
      )
      push(<Note key={`disc-text-${a.level}`} i={n}>{d.description}</Note>)
      push(<Gap key={`disc-gap-${a.level}`} i={n} />)
      push(<Line key={`disc-next-${a.level}`} i={n} as="go" sub text={WORDS.cont} meta={nextLabel} arrow="→" focus onClick={() => navigate(to)} />)
    }
  }

  if (view !== 'collection') push(<Gap key="after-rooms" i={n} />)

  // ── Collection ──
  if (!inLevel) {
    const here = view === 'collection'
    push(here
      ? <Line key="collection" i={n} current text={WORDS.collection} meta={WORDS.found(found, ARTIFACTS.length)} />
      : <Line key="collection" i={n} as="go" text={WORDS.collection} meta={WORDS.found(found, ARTIFACTS.length)} arrow="→" onClick={() => navigate('/collection')} />)
    if (here) {
      ARTIFACTS.forEach((a, k) => {
        const got = isLevelComplete(a.level)
        push(<Line key={`entry-${a.level}`} i={n} as="go" sub mark={a.year} quiet={!got}
          text={`No. ${pad(a.level + 1)}  ${got ? a.name : WORDS.unfound}`} arrow="→"
          peek={peekHandlers(a.level)} focus={k === 0} label={`No. ${pad(a.level + 1)}, ${a.year}, ${got ? a.name : WORDS.unfound} ${a.title}`}
          onClick={() => navigate(a.path)} />)
      })
    }
  }

  // ── About ──
  if (!inLevel && view !== 'collection') {
    push(<Line key="about" i={n} as="go" text={WORDS.about} meta={ABOUT.label} arrow={aboutOpen ? '−' : '+'}
      onClick={() => setAboutOpen(o => !o)} />)
    if (aboutOpen) {
      ABOUT.paragraphs.forEach((p, k) => {
        if (k) push(<Gap key={`about-gap-${k}`} i={n} />)
        push(<Note key={`about-${k}`} i={n}>{p}</Note>)
      })
      push(<Gap key="about-gap-by" i={n} />)
      push(<Note key="about-by" i={n}>{ABOUT.designedBy} {ABOUT.name}. {ABOUT.built}</Note>)
      ABOUT.links.forEach(l => push(<Line key={`about-${l.label}`} i={n} as="ext" sub text={l.label} arrow="↗" href={l.href} />))
    }
  }

  // ── Reset, on the timeline ──
  if (view === 'timeline') {
    if (!asking) push(<Line key="reset" i={n} as="go" text={WORDS.reset} arrow="+" onClick={() => setAsking(true)} />)
    else {
      push(<Line key="reset" i={n} text={WORDS.resetAsk} />)
      push(<Line key="reset-yes" i={n} as="go" sub text={WORDS.resetYes} arrow="→"
        onClick={() => { resetAll(); forgetCardsSeen(); setAsking(false); navigate('/') }} />)
      push(<Line key="reset-no" i={n} as="go" sub text={WORDS.resetNo} arrow="−" focus onClick={() => setAsking(false)} />)
    }
  }

  if (view === 'title') {
    push(<Gap key="by-gap" i={n} />)
    push(<Note key="by" i={n} quiet>{TITLE.by}</Note>)
  }

  if (inLevel || view === 'collection') {
    push(<Gap key="back-gap" i={n} />)
    push(<Line key="back" i={n} as="go" text={WORDS.backPlain} mark="←" arrow="→" onClick={() => navigate('/timeline')} />)
  }

  // ── Dev switches, on the timeline (grey, after everything) ──
  if (import.meta.env.DEV && view === 'timeline' && !asking) {
    push(<Gap key="dev-gap" i={n} />)
    push(<Line key="dev-museum" i={n} as="go" quiet text="Museum (dev): Index" meta="switch to Classic" arrow="→" onClick={() => setMuseumStyle('classic')} />)
    push(<Line key="dev-complete" i={n} as="go" quiet text="Complete all (dev)" arrow="→" onClick={() => { ARTIFACTS.forEach(a => completeLevel(a.level)); refresh(k => k + 1) }} />)
    push(<Line key="dev-lab" i={n} as="go" quiet text="Style lab (dev)" arrow="→" onClick={() => navigate('/style-lab')} />)
  }
  // …and in a level, so the museums can be flipped mid-game
  if (import.meta.env.DEV && inLevel) {
    push(<Line key="dev-museum" i={n} as="go" quiet text="Museum (dev): Index" meta="Classic" arrow="→" onClick={() => setMuseumStyle('classic')} />)
  }

  const pageKind = inLevel ? s.levelView : view === 'collection' ? s.collectionView : s.listView
  return (
    <div className={`${s.ix} ${pageKind}`} data-index-museum>
      <div className={s.page}>
        <nav
          ref={listRef}
          className={s.list}
          aria-label={TITLE.name}
          {...(inLevel ? { 'data-hud': narrow ? 'top' : 'side' } : {})}
        >
          {L}
        </nav>

        {/* Beside the list: the peeked room's picture, or the collection's cards */}
        {!inLevel && view !== 'collection' && (
          <div className={s.aside} aria-hidden="true">
            {slots.peek !== null && slots.peek !== undefined && (
              <div className={s.peekBox} data-peek={slots.peek}>
                <DotPicture level={slots.peek} className={s.peekPicture} />
                <span className={s.peekYear}>{ARTIFACTS[slots.peek].year}</span>
              </div>
            )}
          </div>
        )}
        {view === 'collection' && <Cards navigate={navigate} peek={slots.peek} />}
      </div>
    </div>
  )
}

// ── The collection's cards, in the list's own terms ─────────────────────
function Cards({ navigate, peek }) {
  return (
    <div className={s.cards}>
      {ARTIFACTS.map(a => {
        const got = isLevelComplete(a.level)
        return (
          <button
            type="button"
            key={a.level}
            className={`${s.card} ${got ? '' : s.blank} ${peek === a.level ? s.cardLit : ''}`}
            onClick={() => navigate(a.path)}
            tabIndex={-1}
            aria-hidden="true"
            {...peekHandlers(a.level)}
          >
            <span className={s.cardHead}><span>No. {pad(a.level + 1)}</span><span>{a.year}</span></span>
            <span className={s.cardPicture}>
              {got ? <DotPicture level={a.level} className={s.fill} /> : <span className={`${s.fill} ${s.dotGrid}`} />}
            </span>
            <span className={s.cardBody}>
              {got ? (
                <>
                  <span className={s.cardName}>{a.name}</span>
                  <span className={s.cardRoom}>{a.title}</span>
                  <span className={s.cardRule} />
                  <span>{a.description}</span>
                </>
              ) : (
                <>
                  <span className={s.cardName}>{a.title}</span>
                  <span className={s.cardRoom}>{WORDS.unfound}</span>
                </>
              )}
            </span>
            <span className={s.cardFoot}><span>{TITLE.name}</span><span>{a.level + 1} / {ARTIFACTS.length}</span></span>
          </button>
        )
      })}
    </div>
  )
}
