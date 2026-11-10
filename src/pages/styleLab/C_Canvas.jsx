// src/pages/styleLab/C_Canvas.jsx
//
// Concept C, "Canvas": the whole museum is one large grey plane and the
// window only ever shows part of it. Nothing is a page: the title, the
// timeline, the collection and a room are places on the plane, and going to
// one slides the plane. The timeline is a map with a real time scale (48px
// to the year), the rooms drawn as boxes in the proportions of their
// artifacts. Drag it, scroll it, or use the arrow keys; Tab brings whatever
// takes focus into view. The corner shows where you are.
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import s from './C_Canvas.module.css'
import { ROOMS, TITLE, ABOUT, WORDS, MOCK, isFound, collectionLine, foundLine } from './content'
import { CurrentCard, ArtifactPicture } from './CurrentCard'

const WORLD = { w: 4000, h: 2700 }

// Where each "screen" is on the plane: x, y, width, height
const REGIONS = {
  title: [200, 200, 1040, 640],
  timeline: [1500, 140, 2400, 940],
  collection: [200, 1240, 900, 1150],
  level: [1560, 1300, 1380, 800],
}
const REGION_LABELS = { title: TITLE.name, timeline: WORDS.backPlain, collection: WORDS.collection, level: 'Level frame' }

// The map: 48px to the year, 1979 at x = 1540, the axis at y = 300
const PX_PER_YEAR = 48
const AXIS_Y = 300
const yearX = (year) => 1540 + (Number(year) - 1979) * PX_PER_YEAR
const ROOM_Y = [370, 630, 400, 590, 370, 670]
const ROOM_SCALE = 0.3

// Small pictures drifting beside the title: x, y, width
const TITLE_TILES = [[830, 210, 190], [1060, 300, 150], [800, 400, 130], [960, 470, 210], [1110, 640, 120], [820, 620, 170]]
// The cards, dropped on the plane: x, y, turn
const CARD_SPOTS = [[200, 1370, -2], [500, 1410, 1.5], [800, 1360, -1], [240, 1890, 2], [540, 1860, -1.5], [830, 1910, 1]]

const at = (x, y, w) => ({ left: x, top: y, ...(w ? { width: w } : {}) })
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ── Everything on the plane ──────────────────────────────────────────
const World = memo(function World({ level, art, href, go }) {
  const room = ROOMS[level]
  const next = ROOMS[level + 1]
  const [lx, ly] = REGIONS.level
  // The artifact's stand-in, in its own proportions, within 620 × 460
  const fit = Math.min(620 / room.frame[0], 460 / room.frame[1])
  const aw = Math.round(room.frame[0] * fit), ah = Math.round(room.frame[1] * fit)
  const ax = lx + 350, ay = ly + 90
  const dx = ax + aw + 50

  return (
    <>
      {/* ── Lines: the time axis, the stems, the route, the level's ties ── */}
      <svg className={s.lines} width={WORLD.w} height={WORLD.h} aria-hidden="true">
        <line x1={1500} y1={AXIS_Y} x2={3900} y2={AXIS_Y} />
        {Array.from({ length: 2026 - 1978 }, (_, i) => 1978 + i).map(y => (
          <line key={y} x1={yearX(y)} y1={AXIS_Y - (y % 10 === 0 ? 10 : 4)} x2={yearX(y)} y2={AXIS_Y} />
        ))}
        {ROOMS.map((r, i) => <line key={r.level} className={s.dashed} x1={yearX(r.year)} y1={AXIS_Y} x2={yearX(r.year)} y2={ROOM_Y[i]} />)}
        <polyline
          className={s.dotted}
          points={ROOMS.map((r, i) => `${yearX(r.year) + r.frame[0] * ROOM_SCALE / 2},${ROOM_Y[i] + r.frame[1] * ROOM_SCALE / 2}`).join(' ')}
        />
        {/* title → map */}
        <polyline className={s.dotted} points={`440,407 740,407 1300,${AXIS_Y} 1500,${AXIS_Y}`} />
        {/* intro, tracker and discovery card tied to the artifact */}
        <line x1={lx + 310} y1={ly + 150} x2={ax} y2={ay + 60} />
        <line x1={lx + 320} y1={ly + 640} x2={ax + 40} y2={ay + ah} />
        <line x1={dx} y1={ly + 120} x2={ax + aw} y2={ay + 60} />
      </svg>

      {/* ── Title ─────────────────────────────────────────────────── */}
      <div className={`${s.box} ${s.titleBox}`} style={at(200, 200)}>
        <h1 className={s.big}>{TITLE.name}</h1>
        <p className={s.sub}>{TITLE.subtitle}</p>
      </div>
      <a className={`${s.box} ${s.dark} ${s.action}`} style={at(200, 380, 240)} href={href('timeline')}>
        <span>{TITLE.enter}</span><span aria-hidden="true">→</span>
      </a>
      <p className={s.label} style={at(200, 446)}>{TITLE.by}</p>
      <div className={`${s.box} ${s.paper}`} style={at(200, 480, 460)}>
        <p className={s.tag}>{ABOUT.label}</p>
        {ABOUT.paragraphs.map(p => <p key={p} className={s.body}>{p}</p>)}
        <p className={s.body}>{ABOUT.designedBy} <b>{ABOUT.name}</b>. {ABOUT.built}</p>
        <p className={s.body}>
          {ABOUT.links.map((l, i) => <span key={l.label}>{i > 0 && ' · '}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></span>)}
        </p>
      </div>
      {ROOMS.map((r, i) => {
        const [x, y, w] = TITLE_TILES[i]
        return (
          <a key={r.level} className={s.tile} style={{ ...at(x, y, w), height: Math.round(w * 0.75) }} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`}>
            <ArtifactPicture room={r} art={art} className={s.fill} />
          </a>
        )
      })}

      {/* ── Timeline: the map ─────────────────────────────────────── */}
      <p className={s.label} style={at(1500, 150)}>{WORDS.timelineTitle}</p>
      {[1980, 1990, 2000, 2010, 2020].map(y => <span key={y} className={s.tick} style={at(yearX(y), AXIS_Y - 28)}>{y}</span>)}
      {ROOMS.map((r, i) => {
        const w = Math.round(r.frame[0] * ROOM_SCALE), h = Math.round(r.frame[1] * ROOM_SCALE)
        const found = isFound(r.level)
        return (
          <a key={r.level} className={s.room} style={at(yearX(r.year), ROOM_Y[i], Math.max(w, 150))} href={href('level', r.level)}>
            <span className={`${s.roomBox} ${found ? '' : s.empty}`} style={{ width: w, height: h }}>
              {found && <ArtifactPicture room={r} art={art} className={s.fill} />}
            </span>
            <span className={s.roomYear}>{r.year}</span>
            <span className={s.roomTitle}>{r.title} →</span>
            {found && <span className={s.roomName}>{r.name}</span>}
          </a>
        )
      })}
      <a className={`${s.box} ${s.action} ${s.small}`} style={at(1500, 184, 200)} href={href('collection')}><span>{collectionLine}</span></a>
      <a className={`${s.box} ${s.action} ${s.small}`} style={at(1712, 184)} href={href('title')}><span>{TITLE.about}</span></a>
      <button type="button" className={`${s.box} ${s.action} ${s.small}`} style={at(1790, 184)}><span>{WORDS.reset}</span></button>

      {/* ── Collection ────────────────────────────────────────────── */}
      <div style={at(200, 1240)} className={s.plain}>
        <h2 className={s.big}>{WORDS.collection}</h2>
        <p className={s.sub}>{foundLine}</p>
      </div>
      <a className={`${s.box} ${s.action}`} style={at(560, 1262)} href={href('timeline')}><span>{WORDS.back}</span></a>
      {ROOMS.map((r, i) => {
        const [x, y, turn] = CARD_SPOTS[i]
        return (
          <div key={r.level} className={s.card} style={{ ...at(x, y), rotate: `${turn}deg` }}>
            <CurrentCard room={r} art={art} width={250} onOpen={() => go('level', r.level)} />
          </div>
        )
      })}

      {/* ── A room: the artifact with its cards around it ──────────── */}
      <div className={`${s.box} ${s.paper}`} style={at(lx, ly + 60, 310)}>
        <p className={s.tag}>{room.year}</p>
        <h2 className={s.cardTitle}>{room.title}</h2>
        <p className={s.body}>{room.intro}</p>
        <p className={s.tag}>{WORDS.objectives}</p>
        <ul className={s.checks}>{room.objectives.map(o => <li key={o}><span className={s.check} />{o}</li>)}</ul>
        <button type="button" className={`${s.dark} ${s.button}`}>{WORDS.begin}</button>
      </div>
      <div className={s.standin} style={{ ...at(ax, ay, aw), height: ah }}>artifact</div>
      <p className={`${s.box} ${s.paper} ${s.hint}`} style={at(ax + Math.round((aw - 300) / 2), ay + ah + 18, 300)} role="status">{room.hints[MOCK.hintFor]}</p>
      <div className={`${s.box} ${s.dark}`} style={at(lx + 40, ly + 600, 280)}>
        <p className={s.tag}>{WORDS.objectives}</p>
        <ul className={s.checks}>
          {room.objectives.map((o, i) => {
            const done = MOCK.done.includes(i)
            return <li key={o} className={done ? s.done : ''}><span className={s.check}>{done ? '×' : ''}</span>{o}</li>
          })}
        </ul>
      </div>
      <div className={`${s.box} ${s.paper}`} style={at(dx, ly + 40, 330)}>
        <p className={s.tag}>{WORDS.discovered}</p>
        <p className={s.year}>{room.year}</p>
        <h2 className={s.cardTitle}>{room.name}</h2>
        <p className={s.body}>{room.description}</p>
        <button type="button" className={`${s.dark} ${s.button}`} onClick={() => (next ? go('level', next.level) : go('timeline'))}>{WORDS.cont}</button>
      </div>
      <div className={`${s.box} ${s.paper}`} style={at(ax + 20, ay + ah + 110, 300)}>
        <h2 className={s.notice}>{WORDS.smallScreen}</h2>
        <button type="button" className={`${s.dark} ${s.button}`}>{WORDS.smallScreenGo}</button>
      </div>
    </>
  )
})

// ── The window onto the plane ────────────────────────────────────────
export default function Canvas({ screen, level, href, go, art, thumb }) {
  const view = useRef(null)
  const [size, setSize] = useState({ w: 1440, h: 860 })
  const [pos, setPos] = useState(() => targetFor(screen, { w: 1440, h: 860 }))
  const [gliding, setGliding] = useState(false)
  const drag = useRef(null)
  const swallowClick = useRef(false)
  const sizeRef = useRef(size)
  sizeRef.current = size

  const clamp = useCallback((p, sz = sizeRef.current) => ({
    x: Math.round(Math.max(0, Math.min(WORLD.w - sz.w, p.x))),
    y: Math.round(Math.max(0, Math.min(WORLD.h - sz.h, p.y))),
  }), [])

  // Measure the window (clientWidth ignores the index's thumbnail scaling)
  useLayoutEffect(() => {
    const el = view.current
    if (!el) return
    const measure = () => { if (el.clientWidth && el.clientHeight) setSize({ w: el.clientWidth, h: el.clientHeight }) }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Going to a screen slides the plane there (it jumps on arrival, in the
  // thumbnails and under reduced motion)
  const first = useRef(true)
  useLayoutEffect(() => {
    setGliding(!first.current && !thumb && !reducedMotion())
    first.current = false
    setPos(clamp(targetFor(screen, size), size))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, level, size.w, size.h])

  // Scrolling moves the plane (needs a non-passive listener to keep the page still)
  useEffect(() => {
    const el = view.current
    if (!el || thumb) return
    const onWheel = (e) => {
      e.preventDefault()
      setGliding(false)
      setPos(p => clamp({ x: p.x + e.deltaX, y: p.y + e.deltaY }))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [thumb, clamp])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.px, dy = e.clientY - d.py
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 5) return
    if (!d.moved) {
      d.moved = true
      setGliding(false)
      view.current?.setPointerCapture?.(e.pointerId)
    }
    setPos(clamp({ x: d.x - dx, y: d.y - dy }))
  }
  const onPointerUp = () => {
    if (drag.current?.moved) {
      // The click that ends a drag isn't a click on whatever was under it
      swallowClick.current = true
      setTimeout(() => { swallowClick.current = false }, 0)
    }
    drag.current = null
  }
  const onClickCapture = (e) => {
    if (swallowClick.current) { e.preventDefault(); e.stopPropagation() }
  }
  const onKeyDown = (e) => {
    if (e.target !== view.current) return
    const step = { ArrowLeft: [-120, 0], ArrowRight: [120, 0], ArrowUp: [0, -120], ArrowDown: [0, 120] }[e.key]
    if (!step) return
    e.preventDefault()
    setGliding(false)
    setPos(p => clamp({ x: p.x + step[0], y: p.y + step[1] }))
  }
  // Whatever takes focus is brought into view
  const onFocus = (e) => {
    const el = view.current
    if (!el || e.target === el || !e.target.matches?.(':focus-visible')) return
    const v = el.getBoundingClientRect(), r = e.target.getBoundingClientRect()
    const m = 48
    if (r.left >= v.left + m && r.right <= v.right - m && r.top >= v.top + m && r.bottom <= v.bottom - m) return
    setGliding(!reducedMotion())
    setPos(p => clamp({
      x: p.x + (r.left + r.width / 2) - (v.left + v.width / 2),
      y: p.y + (r.top + r.height / 2) - (v.top + v.height / 2),
    }))
  }

  const room = ROOMS[level]
  const mini = 1 / 30
  return (
    <div
      ref={view}
      className={s.view}
      tabIndex={thumb ? -1 : 0}
      role="group"
      aria-label="The exhibit as a map. Drag it, scroll, or use the arrow keys to move around."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        className={`${s.world} ${gliding ? s.gliding : ''}`}
        style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${-pos.x}px, ${-pos.y}px)` }}
        onTransitionEnd={() => setGliding(false)}
      >
        <World level={level} art={art} href={href} go={go} />
      </div>

      {/* ── Pinned to the window: the HUD (in a room) and the minimap ── */}
      {screen === 'level' && (
        <>
          <div className={`${s.pin} ${s.pinTopLeft}`}>
            <span className={s.tag}>{room.year}</span>
            <span>{room.title}</span>
          </div>
          <div className={`${s.pin} ${s.pinTopRight}`}>
            {ROOMS.map(r => (
              <a key={r.level} href={href('level', r.level)} aria-label={`${r.year} ${r.title}`} aria-current={r.level === level ? 'page' : undefined}
                className={`${s.dot} ${r.level === level ? s.dotNow : isFound(r.level) ? s.dotDone : ''}`} />
            ))}
          </div>
          <div className={`${s.pin} ${s.pinBottomRight}`}>
            <button type="button" className={`${s.dark} ${s.button}`} onClick={() => go('level', level)}>{WORDS.cont}</button>
            <a href={href('timeline')}>{WORDS.back}</a>
          </div>
        </>
      )}
      <div className={`${s.pin} ${s.pinBottomLeft}`}>
        <div className={s.mini} style={{ width: WORLD.w * mini, height: WORLD.h * mini }}>
          {Object.entries(REGIONS).map(([id, [x, y, w, h]]) => (
            <a key={id} href={href(id, id === 'level' ? level : undefined)} aria-label={REGION_LABELS[id]} aria-current={id === screen ? 'page' : undefined}
              className={s.miniRegion} style={{ left: x * mini, top: y * mini, width: w * mini, height: h * mini }} />
          ))}
          <span className={s.miniView} style={{ left: pos.x * mini, top: pos.y * mini, width: size.w * mini, height: size.h * mini }} />
        </div>
        <span className={s.readout}>x {pos.x}&nbsp;&nbsp;y {pos.y}</span>
      </div>
    </div>
  )
}

// Where the plane should sit for a screen: its region centred if it fits
// the window, or its top-left corner tucked into the window's if it doesn't
function targetFor(screen, size) {
  const [x, y, w, h] = REGIONS[screen] ?? REGIONS.title
  const inset = size.w < 600 ? 16 : 28
  return {
    x: w + inset * 2 <= size.w ? x - (size.w - w) / 2 : x - inset,
    y: h + inset * 2 <= size.h ? y - (size.h - h) / 2 : y - inset,
  }
}
