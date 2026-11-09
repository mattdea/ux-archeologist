// src/components/MacScrollBar.jsx
//
// The 1984 scroll bar (Inside Macintosh I, Control Manager: scrollBarProc
// and TrackControl). A 16px bar: an arrow box at each end, a 50% gray
// track and a square white thumb (the "scroll box").
//
//   arrow held      one line, then repeats while the button is down
//   track held      one page (a windowful less a line), repeating until the
//                   thumb reaches the pointer
//   thumb dragged   a dotted outline of the thumb follows the pointer; the
//                   contents stay still and jump once, on release
//
// Nothing to scroll (max 0): white track, no thumb, arrows still drawn.
// Inactive window: the bar is blank, frame only.
// The repeat timing is reconstructed (no source gives it).

import { useLayoutEffect, useRef, useState } from 'react'
import ScreenTexture from './ScreenTexture'
import { toLocal } from './desktopDrag'
import styles from './MacScrollBar.module.css'

export const BAR = 16              // bar thickness, frame included
const THUMB = 16                   // the scroll box is square
const REPEAT_DELAY = 250           // ms before an arrow or track press repeats
const REPEAT_EVERY = 50            // ms between repeats

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Hollow arrow inside the bar's frame: 14 across, 15 along the bar (the
// 16th pixel is the line between arrow and track). Points are the up arrow,
// on half pixels so the 1px stroke lands on whole pixels.
const UP = [[6.5, 2.5], [12.5, 8.5], [9.5, 8.5], [9.5, 12.5], [3.5, 12.5], [3.5, 8.5], [0.5, 8.5]]
const MAP = {
  up:    ([x, y]) => [x, y],
  down:  ([x, y]) => [x, 15 - y],
  left:  ([x, y]) => [y, x],
  right: ([x, y]) => [15 - y, x],
}

function Arrow({ dir, pressed }) {
  const across = dir === 'up' || dir === 'down'
  const w = across ? 14 : 15, h = across ? 15 : 14
  const d = 'M' + UP.map(MAP[dir]).map(p => p.join(' ')).join(' L') + ' Z'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} shapeRendering="crispEdges" aria-hidden="true"
      style={{ display: 'block' }}>
      <path d={d} fill={pressed ? '#000' : '#fff'} stroke="#000" strokeWidth="1" />
    </svg>
  )
}

export default function MacScrollBar({
  orientation = 'vertical', value = 0, max = 0, page = 0, line = 16,
  active = true, onChange, className = '', style,
}) {
  const vertical = orientation === 'vertical'
  const trackRef = useRef(null)
  const [trackLen, setTrackLen] = useState(0)
  const [pressed, setPressed] = useState(null)    // 'dec' | 'inc' while an arrow is down
  const [ghost, setGhost] = useState(null)        // outline position while the thumb drags
  // The value repeats build on. Follows the prop when the prop changes, not
  // on every render, so a repeat isn't reset by an unrelated re-render.
  const valueRef = useRef(value)
  useLayoutEffect(() => { valueRef.current = value }, [value])
  const timers = useRef([])

  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setTrackLen(vertical ? el.offsetHeight : el.offsetWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [vertical, active])

  useLayoutEffect(() => () => timers.current.forEach(clearTimeout), [])

  const scrollable = active && max > 0
  const travel = Math.max(0, trackLen - THUMB + 2)        // thumb borders overlap the arrows'
  const thumbAt = v => -1 + (max > 0 ? Math.round((v / max) * travel) : 0)

  const set = v => {
    const next = clamp(Math.round(v), 0, max)
    if (next === valueRef.current) return false
    valueRef.current = next
    onChange?.(next)
    return true
  }

  const along = (clientX, clientY) => {
    const p = toLocal(trackRef.current, clientX, clientY)
    return vertical ? p.y : p.x
  }

  // Press-and-hold: run `step` now, then repeat until the button comes up
  // or `step` returns false.
  const hold = (step, onUp) => {
    const stop = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      document.removeEventListener('mouseup', stop)
      onUp?.()
    }
    const tick = () => {
      if (step() === false) return
      timers.current = [setTimeout(tick, REPEAT_EVERY)]
    }
    document.addEventListener('mouseup', stop)
    if (step() === false) return
    timers.current = [setTimeout(tick, REPEAT_DELAY)]
  }

  const arrowDown = dir => e => {
    if (!scrollable || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    setPressed(dir)
    hold(() => { set(valueRef.current + (dir === 'inc' ? line : -line)) }, () => setPressed(null))
  }

  const trackDown = e => {
    if (!scrollable || e.button !== 0 || e.target !== e.currentTarget) return
    e.preventDefault()
    e.stopPropagation()
    let pointer = along(e.clientX, e.clientY)
    const move = ev => { pointer = along(ev.clientX, ev.clientY) }
    document.addEventListener('mousemove', move)
    const dir = pointer < thumbAt(valueRef.current) ? -1 : 1
    hold(() => {
      const top = thumbAt(valueRef.current)
      const reached = dir < 0 ? pointer >= top : pointer <= top + THUMB
      if (reached) return false
      return set(valueRef.current + dir * Math.max(line, page))
    }, () => document.removeEventListener('mousemove', move))
  }

  const thumbDown = e => {
    if (!scrollable || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const start = thumbAt(valueRef.current)
    const grab = along(e.clientX, e.clientY) - start
    const place = (cx, cy) => clamp(along(cx, cy) - grab, -1, travel - 1)
    setGhost(start)
    const move = ev => setGhost(place(ev.clientX, ev.clientY))
    const up = ev => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      const at = place(ev.clientX, ev.clientY)
      setGhost(null)
      if (travel > 0) set(((at + 1) / travel) * max)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  const pos = vertical ? 'top' : 'left'
  return (
    <div
      className={`${styles.bar} ${vertical ? styles.vertical : styles.horizontal} ${className}`}
      style={style}
      data-scrollbar={orientation}
    >
      {active && (
        <div className={styles.arrow} onMouseDown={arrowDown('dec')} data-arrow="dec">
          <Arrow dir={vertical ? 'up' : 'left'} pressed={pressed === 'dec'} />
        </div>
      )}
      <div ref={trackRef} className={styles.track} onMouseDown={trackDown} data-track="">
        {scrollable && <ScreenTexture />}
        {scrollable && (
          <div className={styles.thumb} style={{ [pos]: thumbAt(value) }} onMouseDown={thumbDown} data-thumb="" />
        )}
        {ghost != null && <div className={styles.ghost} style={{ [pos]: ghost }} />}
      </div>
      {active && (
        <div className={styles.arrow} onMouseDown={arrowDown('inc')} data-arrow="inc">
          <Arrow dir={vertical ? 'down' : 'right'} pressed={pressed === 'inc'} />
        </div>
      )}
    </div>
  )
}
