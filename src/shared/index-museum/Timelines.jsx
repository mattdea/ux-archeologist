// src/shared/index-museum/Timelines.jsx
//
// Three more ways to show the home page's timeline, beside today's list, to
// compare (backlog, "Index museum: one home page, the timeline opening
// under Enter", part 4; 12 Nov 2026). The dev panel's "timeline" under
// Museum picks one (devLooks.js indexTimeline); production has the list.
//
//  - Line: a hairline from 1975 to 2025, a tick every five years, each room
//    a point at its own year, so the gaps are to scale; the picture above
//    on a short stem, the year below. Top to bottom at phone width.
//  - Cards: the six rooms as cards in a row, a blank card (the year and a
//    `?`) for a room not yet found; a grid on narrow windows.
//  - Dig: the rooms as layers of soil, oldest at the bottom.
//
// Every version: each room is a button (data-ix-nav, so the list's arrow
// keys reach it) in time order, labelled with the year, the title and the
// find's name or "not yet found", opening its level; the pictures follow
// the dev panel's Pictures. Focus starts on the next room to play.
//
// The reveal: a room finished since the timeline was last shown (not in
// cardsSeen, the Classic card path's list) shows its find appearing in its
// spot: it fades into the outline, the card turns over, or the layer's text
// gives way. Each find is revealed once; none of it under reduced motion.
import { useEffect, useRef, useState } from 'react'
import s from './IndexMuseum.module.css'
import { ARTIFACTS } from '../../data/artifacts'
import { isLevelComplete } from '../../state/state'
import { cardsSeen, markCardsSeen } from '../devLooks'
import { WORDS, pad } from './words'
import DotPicture from './DotPicture'
import { peekHandlers } from './store'

const FIRST = 1975
const LAST = 2025
const SPAN = LAST - FIRST
const TICKS = Array.from({ length: SPAN / 5 + 1 }, (_, k) => FIRST + k * 5)


/** The rooms with what each version needs to draw them */
function useRooms() {
  // finds not seen yet, as they were when the timeline opened
  const [fresh] = useState(() => {
    const seen = cardsSeen()
    return ARTIFACTS.filter(a => isLevelComplete(a.level) && !seen.includes(a.level)).map(a => a.level)
  })
  const done = ARTIFACTS.filter(a => isLevelComplete(a.level)).map(a => a.level)
  const key = done.join(',')
  // once shown, they're seen
  useEffect(() => { if (done.length) markCardsSeen(done) }, [key])   // eslint-disable-line react-hooks/exhaustive-deps
  const next = ARTIFACTS.find(a => !isLevelComplete(a.level))?.level ?? 0
  return ARTIFACTS.map(a => {
    const found = done.includes(a.level)
    const order = fresh.indexOf(a.level)
    return {
      a,
      found,
      next: a.level === next && !found,
      focus: a.level === next,
      reveal: found && order >= 0,
      revealOrder: Math.max(0, order),
      label: `${a.year}, ${a.title}, ${found ? a.name : WORDS.notYetFound}`,
    }
  })
}

// A room's button, with what every version shares: the link, the label, the
// list's keys, the picture beside the list, focus on the next room
function Room({ r, i, className = '', navigate, children, scroll, vars }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!r.focus) return
    ref.current?.focus({ preventScroll: true })
    ref.current?.scrollIntoView?.({ block: scroll ?? 'nearest', inline: 'nearest' })
  }, [r.focus, scroll])
  return (
    <button
      ref={ref}
      type="button"
      data-ix-nav
      data-ix-room={r.a.level}
      data-found={r.found}
      data-reveal={r.reveal || undefined}
      className={`${s.tlRoom} ${className}`}
      style={{ '--i': i, '--reveal': r.revealOrder, ...vars }}
      aria-label={r.label}
      onClick={() => navigate(r.a.path)}
      {...peekHandlers(r.a.level)}
    >
      {children}
    </button>
  )
}

// ── Line ────────────────────────────────────────────────────────────────
function LineTimeline({ navigate, i0 }) {
  const rooms = useRooms()
  return (
    <div className={`${s.tlBlock} ${s.tlLine}`} data-ix-timeline="line" data-ix-row>
      <div className={s.tlTrack}>
        <span className={s.tlHair} aria-hidden="true" />
        <span className={`${s.tlEnd} ${s.tlFirst}`} aria-hidden="true">{FIRST}</span>
        <span className={`${s.tlEnd} ${s.tlLast}`} aria-hidden="true">{LAST}</span>
        {TICKS.map(y => (
          <span key={y} className={s.tlTick} style={{ '--at': (y - FIRST) / SPAN }} aria-hidden="true" />
        ))}
        {rooms.map((r, k) => (
          <Room key={r.a.level} r={r} i={i0 + k} navigate={navigate} vars={{ '--at': (Number(r.a.year) - FIRST) / SPAN }}
            className={`${s.tlPoint} ${r.reveal ? s.revealFade : ''}`}>
            <span className={s.tlNext} aria-hidden="true">{r.next ? WORDS.next : ''}</span>
            {/* a find not yet seen fades into its outline */}
            <span className={`${s.tlPic} ${r.found && !r.reveal ? '' : s.tlOutline}`} aria-hidden="true">
              {r.found && <DotPicture level={r.a.level} className={s.tlFind} />}
            </span>
            <span className={s.tlStem} aria-hidden="true" />
            <span className={`${s.tlDot} ${r.found ? s.tlDotFull : ''}`} aria-hidden="true" />
            <span className={s.tlYear} aria-hidden="true">{r.a.year}</span>
            <span className={s.tlAbout} aria-hidden="true">
              <span>{r.a.title}</span>
              <span className={s.quiet}>{r.found ? r.a.name : WORDS.notYetFound}</span>
            </span>
          </Room>
        ))}
      </div>
    </div>
  )
}

// ── Cards ───────────────────────────────────────────────────────────────
// The card from the collection's cards in the list's own terms; a room not
// yet found is the blank card: its number, year and title, a `?`, no name,
// and no "next" (Matthew, 12 Nov 2026).
function FoundFace({ a }) {
  return (
    <>
      <span className={s.cardHead}><span>No. {pad(a.level + 1)}</span><span>{a.year}</span></span>
      <span className={s.cardPicture}><DotPicture level={a.level} className={s.fill} /></span>
      <span className={s.cardBody}>
        {/* the room's title first, its name under it (Matthew, 12 Nov 2026),
            so the title is on the same line found or not */}
        <span className={s.cardRoom}>{a.title}</span>
        <span className={s.cardName}>{a.name}</span>
      </span>
    </>
  )
}
function BlankFace({ a }) {
  return (
    <>
      <span className={s.cardHead}><span>No. {pad(a.level + 1)}</span><span>{a.year}</span></span>
      <span className={s.cardPicture}><span className={`${s.fill} ${s.dotGrid}`} /><span className={s.cardAsk}>?</span></span>
      <span className={s.cardBody}><span className={s.cardRoom}>{a.title}</span><span>{' '}</span></span>
    </>
  )
}

function CardsTimeline({ navigate, i0 }) {
  const rooms = useRooms()
  return (
    <div className={`${s.tlBlock} ${s.tlCards}`} data-ix-timeline="cards" data-ix-row>
      {rooms.map((r, k) => (
        <Room key={r.a.level} r={r} i={i0 + k} navigate={navigate}
          className={`${s.card} ${s.tlCard} ${r.found ? '' : s.blank} ${r.reveal ? s.revealTurn : ''}`}>
          {r.reveal ? (
            <span className={s.turn} aria-hidden="true">
              <span className={`${s.face} ${s.faceBack}`}><BlankFace a={r.a} /></span>
              <span className={`${s.face} ${s.faceFront}`}><FoundFace a={r.a} /></span>
            </span>
          ) : r.found ? <FoundFace a={r.a} /> : <BlankFace a={r.a} />}
        </Room>
      ))}
    </div>
  )
}

// ── Dig ─────────────────────────────────────────────────────────────────
// Each find at a fixed spot in its layer, a different one per room, so they
// look scattered: [across, down] as fractions of the band's free space
const SPOTS = [[0.62, 0.55], [0.18, 0.25], [0.78, 0.7], [0.4, 0.3], [0.9, 0.4], [0.28, 0.65]]

function DigTimeline({ navigate, i0 }) {
  const rooms = useRooms()
  return (
    // in time order in the page (Tab, screen readers), drawn oldest at the bottom
    <div className={`${s.tlBlock} ${s.tlDig}`} data-ix-timeline="dig" data-ix-reverse>
      {rooms.map((r, k) => (
        <Room key={r.a.level} r={r} i={i0 + (rooms.length - 1 - k)} navigate={navigate} scroll="center"
          className={`${s.layer} ${r.reveal ? s.revealDig : ''}`}>
          <span className={s.layerSoil} data-soil={r.a.level} aria-hidden="true" />
          <span className={s.layerYear} aria-hidden="true">{r.a.year}</span>
          {(!r.found || r.reveal) && (
            <span className={`${s.layerText} ${s.quiet} ${r.reveal ? s.digOut : ''}`} aria-hidden="true">
              {WORDS.unexcavated}{r.next ? ` · ${WORDS.next}` : ''}
            </span>
          )}
          {r.found && (
            <span className={`${s.layerFind} ${r.reveal ? s.digIn : ''}`} aria-hidden="true"
              style={{ '--x': SPOTS[r.a.level][0], '--y': SPOTS[r.a.level][1] }}>
              <DotPicture level={r.a.level} className={s.layerPic} />
              <span className={s.layerTitle}>{r.a.title}</span>
            </span>
          )}
        </Room>
      ))}
    </div>
  )
}

/** The open timeline in the version `kind` ('line' | 'cards' | 'dig') */
export default function TimelineVersion({ kind, navigate, i0 = 0 }) {
  if (kind === 'line') return <LineTimeline navigate={navigate} i0={i0} />
  if (kind === 'cards') return <CardsTimeline navigate={navigate} i0={i0} />
  if (kind === 'dig') return <DigTimeline navigate={navigate} i0={i0} />
  return null
}
