// src/components/MacScrollPane.jsx
//
// A window's scrolling area: the contents, a vertical and/or horizontal
// MacScrollBar, and the grow box in the corner. Fills its parent, which sets
// the size. The bars sit on the window's right and bottom edges and overlap
// the frame (and the line above them) by a pixel, as on the Mac.
//
// The contents move only through the scroll bars: the viewport hides its
// overflow and the contents are translated, so a mouse wheel or trackpad
// does nothing (the 1984 mouse had no wheel).

import { useLayoutEffect, useRef, useState } from 'react'
import MacScrollBar from './MacScrollBar'
import styles from './MacScrollPane.module.css'

const INSET = 15   // a 16px bar placed 1px over the frame takes 15px inside

export default function MacScrollPane({
  children, vertical = true, horizontal = true, growBox = true, active = true,
  line = 16, fillWidth = false, onGrowMouseDown, contentClassName = '',
}) {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const [size, setSize] = useState({ vw: 0, vh: 0, cw: 0, ch: 0 })
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    const vp = viewportRef.current, ct = contentRef.current
    if (!vp || !ct) return
    const measure = () => setSize(prev => {
      const next = { vw: vp.clientWidth, vh: vp.clientHeight, cw: ct.offsetWidth, ch: ct.offsetHeight }
      return Object.keys(next).every(k => next[k] === prev[k]) ? prev : next
    })
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    ro.observe(ct)
    return () => ro.disconnect()
  }, [])

  const maxX = horizontal ? Math.max(0, size.cw - size.vw) : 0
  const maxY = vertical ? Math.max(0, size.ch - size.vh) : 0
  const x = Math.min(pos.x, maxX)
  const y = Math.min(pos.y, maxY)
  const corner = growBox || (vertical && horizontal)

  return (
    <div className={styles.pane}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ right: vertical ? INSET : 0, bottom: (horizontal || growBox) ? INSET : 0 }}
        // The browser can still scroll a hidden-overflow box to show a
        // selection or focus; undo it so only the bars move the contents.
        onScroll={e => { e.currentTarget.scrollTop = 0; e.currentTarget.scrollLeft = 0 }}
      >
        <div
          ref={contentRef}
          className={`${styles.content} ${contentClassName}`}
          style={{ width: fillWidth ? '100%' : 'max-content', transform: `translate(${-x}px, ${-y}px)` }}
        >
          {children}
        </div>
      </div>

      {vertical && (
        <MacScrollBar
          orientation="vertical" active={active} line={line}
          value={y} max={maxY} page={Math.max(line, size.vh - line)}
          onChange={v => setPos(p => ({ ...p, y: v }))}
          style={{ top: -1, right: -1, bottom: corner ? INSET - 1 : -1 }}
        />
      )}
      {horizontal && (
        <MacScrollBar
          orientation="horizontal" active={active} line={line}
          value={x} max={maxX} page={Math.max(line, size.vw - line)}
          onChange={v => setPos(p => ({ ...p, x: v }))}
          style={{ left: -1, bottom: -1, right: corner ? INSET - 1 : -1 }}
        />
      )}
      {corner && (
        <div className={styles.growBox} onMouseDown={active && growBox ? onGrowMouseDown : undefined} data-growbox="">
          {active && growBox && (
            <svg viewBox="0 0 14 14" width="14" height="14" shapeRendering="crispEdges" aria-hidden="true">
              <rect x="2.5" y="2.5" width="6" height="6" fill="#fff" stroke="#000" />
              <rect x="4.5" y="4.5" width="8" height="8" fill="#fff" stroke="#000" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}
