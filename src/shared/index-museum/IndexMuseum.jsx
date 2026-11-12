// src/shared/index-museum/IndexMuseum.jsx
//
// The index museum: one monospace list that is the whole museum (backlog,
// "the index museum", from concept B2 in the style lab). SharedLayout
// renders it in place of the classic HUD when src/shared/museumStyle.js
// says 'index'. It stays mounted from view to view, and its lines are keyed,
// so moving between views redraws the list in place: lines that stay, stay;
// new ones type in; gone ones go.
//
//  - The home page is the list itself (App renders no page for it): the
//    title, with the timeline opening under Enter (view 'title' closed,
//    'timeline' open), and the peeked room's picture beside it. There is
//    no collection page: /collection lands on the open timeline.
//  - In a level, by default (the dev panel's level layout, devLooks.js), the
//    list splits into four corner blocks round a centred device
//    (data-hud="corner"): where you are, getting around, what to read, what
//    to do next. ≡ opens the whole list as a panel over the page. At under
//    900px the room's line is a band at the top and the reading and the
//    next step stack in a band at the bottom (data-hud="top" / "bottom").
//  - The earlier side layout, kept for comparing: a column down the left (data-hud="side")
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
// Enter opens, Escape closes what's open (About). Tab
// order is the DOM order, as for any page.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './IndexMuseum.module.css'
import { ARTIFACTS } from '../../data/artifacts'
import { isLevelComplete } from '../../state/state'
import { cardTimelineOn, indexLevelLayout, indexTimeline } from '../devLooks'
import TimelineVersion from './Timelines'
import { useIndexSlots, peekHandlers } from './store'
import { TITLE, ABOUT, WORDS } from './words'
import DotPicture, { RestingPicture } from './DotPicture'
import { useIndexTheme, setIndexTheme } from './theme'
import { usePictureStyle } from './pictureStyle'
import './pointer'   // the museum's pointer (pointers.css), arrowhead or stick
import { useDevChange } from '../dev/devEvents'
import { deviceBox } from './band'

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
// `whole`: the line reads as one link, so on hover its right side lights
// and underlines with the text (the discovery's Continue → next room)
function Line({ as = 'text', i = 0, onClick, href, mark = '', text, meta, arrow, sub, current, dim, quiet, bare, whole, peek, focus, label, pressed, expanded, className, ref2 }) {
  const ref = useRef(null)
  useEffect(() => { if (focus) ref.current?.focus({ preventScroll: false }) }, [focus])
  const chooses = as === 'go' || as === 'ext'
  const cls = [s.line, sub && s.sub, current && s.current, dim && s.dim, quiet && s.quiet, chooses && s.choose, whole && s.whole, className].filter(Boolean).join(' ')
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
  const setRef = (el) => { ref.current = el; if (ref2) ref2.current = el }
  const common = { ref: setRef, className: cls, style: { '--i': Math.min(i, 30) }, ...(peek ?? {}) }
  if (as === 'go') return <button type="button" data-ix-nav onClick={onClick} aria-current={current ? 'page' : undefined} aria-label={label} aria-pressed={pressed} aria-expanded={expanded} {...common}>{inner}</button>
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
  const theme = useIndexTheme()
  const pictures = usePictureStyle()
  const narrow = useMedia(NARROW)
  const small = useMedia(SMALL)
  const [smallGone, setSmallGone] = useState(smallDismissed)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [, refresh] = useState(0)                // the dev panel's progress switch
  useDevChange(() => refresh(k => k + 1))
  const listRef = useRef(null)
  const panelRef = useRef(null)
  const menuRef = useRef(null)                   // the room line's ≡, focus returns there
  const [panelOpen, setPanelOpen] = useState(false)

  const levelMatch = /^level(\d)$/.exec(view)
  const level = levelMatch ? Number(levelMatch[1]) : null
  const inLevel = level !== null
  const corners = inLevel && indexLevelLayout() === 'corners'
  const found = ARTIFACTS.filter(a => isLevelComplete(a.level)).length
  // The home page (backlog, "Index museum: one home page", 12 Nov 2026):
  // the title, with the timeline opening under Enter. 'title' is the page
  // with it closed, 'timeline' the same page with it open (/timeline).
  const home = view === 'title' || view === 'timeline'
  const timelineOpen = view === 'timeline'
  // which timeline opens under Enter (the dev panel's Museum > timeline)
  const version = home ? indexTimeline() : 'list'
  const wide = timelineOpen && version !== 'list'

  // Whatever was open closes when the view changes
  // (opening or closing the timeline stays on the home page, so About stays)
  const lastView = useRef(view)
  useEffect(() => {
    const homeToHome = ['title', 'timeline'].includes(lastView.current) && home
    lastView.current = view
    if (!homeToHome) setAboutOpen(false)
    setPanelOpen(false)
  }, [view, home])

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
    const publish = (announce = true) => {
      if (corners) {
        // between the top corners and the bottom ones, full width
        const huds = [...el.querySelectorAll('[data-hud]')].map(h => h.getBoundingClientRect())
        const H = window.innerHeight
        const top = Math.max(0, ...huds.filter(r => r.top + r.bottom < H).map(r => r.bottom))
        const bottom = Math.min(H, ...huds.filter(r => r.top + r.bottom >= H).map(r => r.top))
        root.setProperty('--museum-inset-left', '0px')
        root.setProperty('--museum-inset-top', `${top + 16}px`)
        root.setProperty('--museum-inset-bottom', `${H - bottom + 16}px`)
      } else {
        const r = el.getBoundingClientRect()
        root.setProperty('--museum-inset-left', narrow ? '0px' : `${r.right}px`)
        root.setProperty('--museum-inset-top', narrow ? `${r.bottom + 16}px` : '24px')
        root.removeProperty('--museum-inset-bottom')
      }
      // useArtifactFit listens for resize
      if (announce) window.dispatchEvent(new Event('resize'))
    }
    publish()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => publish()) : null
    const onResize = () => publish(false)
    ro?.observe(el)
    if (corners) el.querySelectorAll('[data-hud]').forEach(h => ro?.observe(h))
    window.addEventListener('resize', onResize)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
      root.removeProperty('--museum-inset-left')
      root.removeProperty('--museum-inset-top')
      root.removeProperty('--museum-inset-bottom')
    }
  }, [inLevel, narrow, view, corners])

  // Keyboard, like a terminal menu: arrows move, Home / End jump, Escape
  // closes. Listened for on window in the capture phase, so it runs before
  // an artifact's own document-level listeners (Level 0's terminal pulls
  // focus back on every keydown); while the list has focus, its keys stay
  // with the list. Any other key (typing) goes on to the artifact as usual.
  const openRef = useRef({ aboutOpen, panelOpen })
  openRef.current = { aboutOpen, panelOpen }
  useEffect(() => {
    const MENU_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape', 'Enter', ' ', 'Tab']
    const onKey = (e) => {
      // the full list over the page takes the keys while it is open
      const list = openRef.current.panelOpen && panelRef.current ? panelRef.current : listRef.current
      if (openRef.current.panelOpen && e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation()
        setPanelOpen(false); menuRef.current?.focus()
        return
      }
      if (!list || !list.contains(e.target) || !MENU_KEYS.includes(e.key)) return
      e.stopPropagation()
      if (e.key === 'Escape') {
        if (openRef.current.aboutOpen) { e.preventDefault(); setAboutOpen(false) }
        return
      }
      // the years row, and the line and cards timelines: left and right
      // move between rooms
      const row = e.target.closest?.('[data-ix-years], [data-ix-row]')
      if (row && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const years = [...row.querySelectorAll('[data-ix-nav]')]
        const at = years.indexOf(e.target)
        e.preventDefault()
        years[(at + (e.key === 'ArrowRight' ? 1 : years.length - 1)) % years.length].focus()
        return
      }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return   // Enter, Space, Tab: the browser's own
      const items = [...list.querySelectorAll('[data-ix-nav]')]
      if (!items.length) return
      // the dig is drawn oldest at the bottom: up and down follow the drawing
      const rev = e.target.closest?.('[data-ix-reverse]')
      if (rev) {
        const inside = items.filter(el => rev.contains(el))
        const from = items.indexOf(inside[0])
        items.splice(from, inside.length, ...inside.reverse())
      }
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

  // The full list over the page: its first line takes focus; a pointer down
  // outside it closes it
  useEffect(() => {
    if (!panelOpen) return undefined
    panelRef.current?.querySelector('[data-ix-nav]')?.focus()
    const down = (e) => {
      if (panelRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setPanelOpen(false)
    }
    document.addEventListener('pointerdown', down, true)
    return () => document.removeEventListener('pointerdown', down, true)
  }, [panelOpen])

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

  // The museum's name: a heading on the home page, a way back to it elsewhere
  if (home) push(<Line key="name" i={n} text={TITLE.name} />)
  else push(<Line key="name" i={n} as="go" text={TITLE.name} arrow="→" onClick={() => navigate('/')} />)

  // Enter the exhibit opens the timeline under itself, the way About opens
  if (home) {
    push(<Note key="subtitle" i={n}>{TITLE.subtitle}</Note>)
    push(<Gap key="title-gap" i={n} />)
    push(<Line key="enter" i={n} as="go" sub text={TITLE.enter} meta={WORDS.found(found, ARTIFACTS.length)}
      arrow={timelineOpen ? '−' : '+'} expanded={timelineOpen} focus={!timelineOpen && (!small || smallGone)}
      onClick={() => navigate(timelineOpen ? '/' : '/timeline')} />)
  }
  if (!home || timelineOpen) push(<Gap key="rooms-gap" i={n} />)

  // ── The six rooms ──
  const nextToPlay = ARTIFACTS.find(a => !isLevelComplete(a.level))?.level ?? 0
  if (wide) push(<TimelineVersion key={`timeline-${version}`} kind={version} navigate={navigate} i0={n} />)
  if (!wide && (!home || timelineOpen)) ARTIFACTS.forEach(a => {
    const done = isLevelComplete(a.level)
    const open = a.level === level
    if (inLevel && !open) {
      // rooms you're not in: one quiet line each (folded away on a narrow window)
      if (!narrow || corners) push(<Line key={`room-${a.level}`} i={n} as="go" dim bare mark={a.year} text={a.title} onClick={() => navigate(a.path)} />)
      return
    }
    if (open) {
      push(<Line key={`room-${a.level}`} i={n} current mark={a.year} text={a.title} meta={done ? a.name : null} />)
      const before = L.length
      if (!corners) pushRoom(a)
      if (L.length > before && a.level < ARTIFACTS.length - 1 && !narrow) push(<Gap key={`room-gap-${a.level}`} i={n} />)
      return
    }
    push(<Line key={`room-${a.level}`} i={n} as="go" mark={a.year} text={a.title}
      meta={done ? a.name : <span className={s.quiet}>{WORDS.notFound}</span>} arrow="→"
      peek={peekHandlers(a.level)} focus={timelineOpen && a.level === nextToPlay}
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
      if (slots.hint) push(<Note key={`hint-${a.level}`} i={n} mark="[?]" quiet italic>{slots.hint}</Note>)
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
      push(<Line key={`disc-next-${a.level}`} i={n} as="go" sub whole text={WORDS.cont} meta={nextLabel} arrow="→" focus onClick={() => navigate(to)} />)
    }
  }

  if (!inLevel) push(<Gap key="after-rooms" i={n} />)

  // No Collection line: the finds show on the timeline itself, and
  // /collection lands on it (backlog, "one home page", part 3)

  // ── About ──
  if (!inLevel) {
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

  // Light or dark, on every view: a toggle, so its right side is [ ] / [x]
  const darkLine = () => push(<Line key="dark" i={n} as="go" text={WORDS.dark} arrow={theme === 'dark' ? '[x]' : '[ ]'}
    pressed={theme === 'dark'} onClick={() => setIndexTheme(theme === 'dark' ? 'light' : 'dark')} />)
  if (!inLevel) darkLine()

  if (home) {
    push(<Gap key="by-gap" i={n} />)
    push(<Note key="by" i={n} quiet>{TITLE.by}</Note>)
  }

  if (inLevel) {
    push(<Gap key="back-gap" i={n} />)
    push(<Line key="back" i={n} as="go" text={WORDS.backPlain} mark="←" arrow="→" onClick={() => navigate('/timeline')} />)
    darkLine()
  }

  const pageKind = inLevel ? s.levelView : s.listView
  if (corners) return (
    <div className={`${s.ix} ${s.levelView} ${s.cornersView}`} data-index-museum data-level-layout="corners">
      <Corners
        listRef={listRef} menuRef={menuRef} narrow={narrow} level={level} roomState={roomState}
        slots={slots} continueAction={continueAction} navigate={navigate}
        panelOpen={panelOpen} togglePanel={() => setPanelOpen(o => !o)}
      />
      {panelOpen && (
        <nav ref={panelRef} className={s.panel} aria-label={WORDS.allRooms} data-ix-panel>
          {L}
        </nav>
      )}
    </div>
  )
  return (
    <div className={`${s.ix} ${pageKind} ${wide ? s.wideView : ''}`} data-index-museum data-ix-version={home ? version : undefined}>
      <div className={s.page}>
        <nav
          ref={listRef}
          className={s.list}
          aria-label={TITLE.name}
          {...(inLevel ? { 'data-hud': narrow ? 'top' : 'side' } : {})}
        >
          {L}
        </nav>

        {/* Beside the list: the peeked room's picture (with the stamps, the
            arrowhead while no room is pointed at) */}
        {!inLevel && !wide && (
          <div className={s.aside} aria-hidden="true">
            {slots.peek !== null && slots.peek !== undefined ? (
              <div className={s.peekBox} data-peek={slots.peek}>
                <DotPicture level={slots.peek} className={s.peekPicture} />
              </div>
            ) : pictures !== 'dots' && (
              // stamps and fossils: an arrowhead rests here until a room is pointed at
              <div className={s.peekBox} data-peek="rest">
                <RestingPicture className={s.peekPicture} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── In a level, the corners ─────────────────────────────────────────────
// Top left, where you are; top right, getting around; bottom left, what to
// read; bottom right, what to do next. Each is a data-hud="corner" box of a
// fixed size, so the device (centred by useArtifactFit) doesn't move when
// what's in them changes. Under 900px: the room's line across the top, the
// reading and the next step stacked across the bottom.
function Corners({ listRef, menuRef, narrow, level, roomState, slots, continueAction, navigate, panelOpen, togglePanel }) {
  const a = ARTIFACTS[level]
  const next = ARTIFACTS[level + 1]
  // the device under a fade while there's text to read over or beside it:
  // the intro (the device is inert then) and the discovery
  const fade = <DeviceFade level={level} on={roomState === 'intro' || roomState === 'discovery'} />
  const room = (
    <Line as="go" current mark={`${a.year}  `} text={a.title} arrow="≡" bare
      className={s.roomLine} expanded={panelOpen} label={`${a.year} ${a.title}. ${WORDS.allRooms}`}
      onClick={togglePanel} ref2={menuRef} />
  )

  // what to read
  let read = null
  // intro: the text, then Begin one row under it, in the same corner, so
  // what to read and what to click are in one place (Matthew's review)
  if (roomState === 'intro') read = (
    <>
      <p className={s.cornerText}>{slots.intro.description}</p>
      <Line as="go" className={s.cornerGo} text={WORDS.begin} arrow="→" focus onClick={() => slots.intro.onBegin()} />
    </>
  )
  if (roomState === 'playing' && slots.tracker) {
    const { objectives, completedIndices } = slots.tracker
    read = (
      <>
        {objectives.map((o, k) => {
          const done = completedIndices.includes(k)
          return (
            <div key={k} className={`${s.check} ${done ? s.quiet : ''}`}>
              <span className={s.box}>{done ? '[x]' : '[ ]'}</span><span className={done ? s.struck : ''}>{o}</span>
            </div>
          )
        })}
        {slots.hint && <div className={`${s.check} ${s.quiet} ${s.cornerHint}`}><span className={s.box}>[?]</span><span className={s.italic}>{slots.hint}</span></div>}
      </>
    )
  }
  if (roomState === 'discovery') {
    const d = slots.discovery
    const text = (
      <>
        <div className={s.cornerSplit}><span className={s.quiet}>{WORDS.discovered}</span><span className={s.quiet}>{d.era}</span></div>
        <div>{d.artifactName}</div>
        <p className={s.cornerText}>{d.description}</p>
      </>
    )
    read = narrow ? (
      <>
        {/* under 900px the bottom band is already wide: the room's picture above the text */}
        <DotPicture level={level} className={`${s.findNarrow} ${s.findIn}`} />
        <div>{text}</div>
      </>
    ) : <DiscoveryBand level={level}>{text}</DiscoveryBand>
  }

  // what to do next
  let act = null
  // playing: Continue once all are done (no count: the [x] boxes say it;
  // Matthew's review, 12 Nov 2026)
  if (roomState === 'playing' && slots.tracker && continueAction) {
    act = <Line as="go" text={WORDS.cont} arrow="→" onClick={() => continueAction()} />
  }
  if (roomState === 'discovery') {
    const d = slots.discovery
    const to = cardTimelineOn() ? '/timeline' : d.nextUrl
    const nextLabel = to === '/timeline' || !next ? WORDS.backPlain : `${next.year} ${next.title}`
    act = <Line as="go" whole text={WORDS.cont} meta={nextLabel} arrow="→" focus onClick={() => navigate(to)} />
  }

  if (narrow) return (
    <div ref={listRef} className={s.cornersNarrow}>
      <div className={s.topBand} data-hud="top">{room}</div>
      {fade}
      <div className={s.bottomBand} data-hud="bottom" data-state={roomState}>
        <div className={s.read}>{read}</div>
        {act && <div className={s.act}>{act}</div>}
      </div>
    </div>
  )

  return (
    <div ref={listRef} className={s.corners}>
      {fade}
      <div className={`${s.corner} ${s.tl}`} data-hud="corner" data-corner="tl">
        <Line as="go" text={TITLE.name} arrow="→" onClick={() => navigate('/')} />
        {room}
      </div>
      <div className={`${s.corner} ${s.tr}`} data-hud="corner" data-corner="tr">
        <div className={s.years} data-ix-years role="group" aria-label={WORDS.allRooms}>
          {ARTIFACTS.map(r => (
            <button key={r.level} type="button" data-ix-nav className={`${s.year} ${r.level === level ? s.current : ''}`}
              aria-current={r.level === level ? 'page' : undefined} aria-label={`${r.year} ${r.title}`}
              onClick={() => { if (r.level !== level) navigate(r.path) }}>{r.year}</button>
          ))}
        </div>
      </div>
      <div className={`${s.corner} ${s.bl}`} data-hud="corner" data-corner="bl" data-state={roomState}>{read}</div>
      <div className={`${s.corner} ${s.br}`} data-hud="corner" data-corner="br" data-state={roomState}>{act}</div>
    </div>
  )
}

// ── The discovery, in a band along the bottom ──────────────────────────
// At discovery the bottom-left corner's content (the "Artifact Discovered"
// line with the year, the name, the text, and the room's picture) goes in a
// band along the bottom (backlog, "Index museum: the discovery text in a
// wide band at the bottom", 12 Nov 2026): from the left gutter to the
// bottom-right corner, bottom-aligned with it, the text at most 80ch, the
// picture at the band's left as tall as the text. It's position: fixed
// inside the corner, which keeps its size, and not data-hud, so the device
// stays exactly where it was in playing.
// It sits over the device's lower part where the device reaches that far;
// the device is faded then (DeviceFade), so the text stays readable.
const PICTURE_RATIO = 400 / 340

function DiscoveryBand({ level, children }) {
  const textRef = useRef(null)
  const [pictureH, setPictureH] = useState(0)
  useLayoutEffect(() => {
    const measure = () => { if (textRef.current) setPictureH(textRef.current.offsetHeight) }
    measure()
    const raf = requestAnimationFrame(measure)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (textRef.current) ro?.observe(textRef.current)
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener('resize', measure) }
  }, [level])
  return (
    <div className={`${s.band} ${s.findIn}`} data-ix-band>
      <div className={s.bandInner}>
        {pictureH > 0 && (
          <span className={s.bandPicture} style={{ height: pictureH, width: Math.round(pictureH * PICTURE_RATIO) }} data-ix-find>
            <DotPicture level={level} className={s.findPicture} />
          </span>
        )}
        <div ref={textRef} className={s.bandText} data-ix-band-text>{children}</div>
      </div>
    </div>
  )
}

// ── The fade over the device ───────────────────────────────────────────
// While the corners have text to read over or beside the device (the
// intro and the discovery), the device sits under a fade: the page colour at partial
// opacity with a light backdrop blur (backlog, "Index museum: fixes from
// Matthew's review", 12 Nov 2026), so the discovery band's text passes AA
// where it runs over the device's foot. It covers the device's box
// (useArtifactFit's --artifact-*, read live; Level 5, with no fit, its
// data-artifact zone, measured), 1px over on every side.
//
// It's portalled into the level's data-artifact box at z-index 2: the
// level page is position: fixed, so it is its own stacking context, and
// only inside it can the fade sit over the device and under the catalogue
// record (z-index 3), which stays unfaded. The index's corners and band are
// above the whole level page. It fades in and out over 400ms (at once under
// reduced motion), and while on it takes the pointer, so the device can't
// be used through it.
function DeviceFade({ level, on }) {
  const [at, setAt] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const host = document.querySelector('[data-artifact]')
      const box = host && deviceBox()
      setAt(box ? { host, box } : null)
    }
    measure()
    const raf = requestAnimationFrame(measure)
    const onResize = () => requestAnimationFrame(measure)
    window.addEventListener('resize', onResize)
    // at the intro the level's chunk may still be loading: measure again
    // once its data-artifact box is in the page
    let mo = null
    if (!document.querySelector('[data-artifact]') && typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(() => {
        if (document.querySelector('[data-artifact]')) { mo.disconnect(); requestAnimationFrame(measure) }
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }
    return () => { cancelAnimationFrame(raf); mo?.disconnect(); window.removeEventListener('resize', onResize) }
  }, [level, on])
  if (!at || !at.host.isConnected) return null
  const { box } = at
  // --ix-fade-bleed past the device on every side: the blur only works
  // inside the fade's own box, so a box that ended at the device's edge
  // left that edge a hard line (Matthew's review, 12 Nov 2026). Out there
  // the backdrop is the page, so the box's own edge doesn't show.
  const style = {
    left: `calc(var(--artifact-left, ${box.x}px) - var(--ix-fade-bleed))`, top: `calc(var(--artifact-top, ${box.y}px) - var(--ix-fade-bleed))`,
    width: `calc(var(--artifact-width, ${box.w}px) + 2 * var(--ix-fade-bleed))`, height: `calc(var(--artifact-height, ${box.h}px) + 2 * var(--ix-fade-bleed))`,
  }
  return createPortal(
    <div className={`${s.fade} ${on ? s.fadeOn : ''}`} style={style} data-ix-fade={on ? 'on' : 'off'} aria-hidden="true" />,
    at.host,
  )
}
