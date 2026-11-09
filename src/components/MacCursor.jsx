// src/components/MacCursor.jsx
//
// The Mac's pointer, drawn by us instead of the browser so it moves the way
// it does on an emulated 1984 Mac (infinite mac): in visible steps, about 30
// times a second, not glued to the hand. Over the Mac's screen the real
// pointer is hidden; this draws the 1984 arrow (era-cursors.css), the
// wristwatch while `busy`, or the I-beam over text, at the pointer's last
// sampled position. It lives on <body> so the Mac's scale() doesn't change
// its size (cursors are screen-space, as before).
//
// The 30 Hz step and the I-beam bitmap (Inside Macintosh's iBeamCursor,
// from memory) are reconstructed. During a native drag the browser shows its
// own pointer, which a page can't hide.
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const STEP_MS = 1000 / 30

// iBeamCursor: 16×16, hot spot at the middle of the stem
const IBEAM_ROWS = [0x0C60, 0x0280, 0x0100, 0x0100, 0x0100, 0x0100, 0x0100, 0x0100,
  0x0100, 0x0100, 0x0100, 0x0100, 0x0100, 0x0280, 0x0C60, 0x0000]
const IBEAM = (() => {
  let rects = ''
  IBEAM_ROWS.forEach((row, y) => {
    for (let x = 0; x < 16; x++) if (row & (0x8000 >> x)) rects += `<rect x='${x}' y='${y}' width='1' height='1'/>`
  })
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'>${rects}</svg>`
  return { src: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, w: 16, h: 16, hx: 7, hy: 8 }
})()

// Read a cursor from its CSS variable: url("…") hx hy, fallback
function cssCursor(host, name, w, h) {
  const v = getComputedStyle(host).getPropertyValue(name)
  const m = v.match(/url\((["']?)(.*?)\1\)\s+(\d+)\s+(\d+)/)
  return m ? { src: `url("${m[2]}")`, w, h, hx: +m[3], hy: +m[4] } : null
}

export default function MacCursor({ busy = false }) {
  const markerRef = useRef(null)      // sits inside the Mac's screen
  const drawRef = useRef(null)        // the drawn pointer, on <body>
  const busyRef = useRef(busy)
  useEffect(() => { busyRef.current = busy }, [busy])

  useEffect(() => {
    const host = markerRef.current?.parentElement
    const el = drawRef.current
    if (!host || !el) return
    const arrow = cssCursor(host, '--cursor-mac-arrow', 16, 16)
    const watch = cssCursor(host, '--cursor-mac-watch', 18, 18)
    let pos = null, overText = false, shown = null

    const place = (e) => {
      pos = { x: e.clientX, y: e.clientY }
      overText = !!e.target?.closest?.('textarea, input[type="text"], [contenteditable="true"]')
    }
    const leave = () => { pos = null }
    host.addEventListener('pointermove', place)
    host.addEventListener('pointerdown', place)
    host.addEventListener('dragover', place)
    host.addEventListener('pointerleave', leave)

    const tick = setInterval(() => {
      if (!pos) { el.style.display = 'none'; return }
      const c = busyRef.current ? watch : overText ? IBEAM : arrow
      if (!c) return
      if (shown !== c) {
        shown = c
        el.style.backgroundImage = c.src
        el.style.width = `${c.w}px`
        el.style.height = `${c.h}px`
      }
      el.style.display = 'block'
      el.style.transform = `translate(${Math.round(pos.x - c.hx)}px, ${Math.round(pos.y - c.hy)}px)`
    }, STEP_MS)

    return () => {
      clearInterval(tick)
      host.removeEventListener('pointermove', place)
      host.removeEventListener('pointerdown', place)
      host.removeEventListener('dragover', place)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      <span ref={markerRef} hidden />
      {createPortal(
        <div
          ref={drawRef}
          aria-hidden="true"
          style={{
            position: 'fixed', left: 0, top: 0, display: 'none', zIndex: 2147483647,
            pointerEvents: 'none', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated',
          }}
        />,
        document.body,
      )}
    </>
  )
}
