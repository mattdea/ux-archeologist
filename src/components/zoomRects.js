// src/components/zoomRects.js
//
// The 1984 Finder's "zoom rectangles". Opening an icon drew a run of
// outlines growing from the icon to where the window would appear; closing
// drew them shrinking back. QuickDraw drew each in the 50% gray pattern
// with XOR, a few outlines visible at once, trailing one another, and
// erased them by drawing again. The outlines are plain 1-pixel checkered
// frames, so here each is an SVG rect with a 1-on/1-off dash, drawn inside
// the desktop in its own coordinates (the Mac is scaled; see desktopDrag.js).

const NS = 'http://www.w3.org/2000/svg'

/**
 * Animate outlines from `from` to `to` ({x,y,w,h}, desktop px) inside
 * `parent`. Resolves when done. `steps` outlines in all, `trail` visible at
 * once, one step every `interval` ms.
 */
export function zoomRects(parent, from, to, { steps = 12, trail = 3, interval = 24 } = {}) {
  return new Promise(resolve => {
    if (!parent || !from || !to) return resolve()
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:visible'
    parent.appendChild(svg)

    const rects = []
    const lerp = (a, b, t) => a + (b - a) * t
    const frame = (i) => {
      // Ease so the outlines accelerate away from the start, as the
      // Finder's did (it stepped the rectangle by a growing fraction).
      const t = i / (steps - 1)
      const e = t * t * (3 - 2 * t)
      return {
        x: Math.round(lerp(from.x, to.x, e)) + 0.5,
        y: Math.round(lerp(from.y, to.y, e)) + 0.5,
        w: Math.round(lerp(from.w, to.w, e)) - 1,
        h: Math.round(lerp(from.h, to.h, e)) - 1,
      }
    }

    let i = 0
    const tick = () => {
      if (i < steps) {
        const r = frame(i)
        const el = document.createElementNS(NS, 'rect')
        el.setAttribute('x', r.x); el.setAttribute('y', r.y)
        el.setAttribute('width', Math.max(1, r.w)); el.setAttribute('height', Math.max(1, r.h))
        el.setAttribute('fill', 'none')
        el.setAttribute('stroke', '#000')
        el.setAttribute('stroke-width', '1')
        el.setAttribute('stroke-dasharray', '1 1')
        el.setAttribute('shape-rendering', 'crispEdges')
        svg.appendChild(el)
        rects.push(el)
      }
      // Erase the outline that has fallen off the back of the trail
      if (rects.length > trail || i >= steps) {
        const old = rects.shift()
        old?.remove()
      }
      i++
      if (rects.length === 0 && i >= steps) {
        svg.remove()
        resolve()
      } else {
        timer = setTimeout(tick, interval)
      }
    }
    let timer = setTimeout(tick, 0)
  })
}

/** Rect of `el` in `desktop`'s local coordinates. */
export function localRect(desktop, el) {
  if (!desktop || !el) return null
  const d = desktop.getBoundingClientRect()
  const s = d.width / desktop.offsetWidth || 1
  const r = el.getBoundingClientRect()
  return { x: (r.left - d.left) / s, y: (r.top - d.top) / s, w: r.width / s, h: r.height / s }
}
