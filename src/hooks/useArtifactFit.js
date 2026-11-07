// src/hooks/useArtifactFit.js
import { useState, useLayoutEffect } from 'react'

/**
 * Fits a native-size artifact (width × height) into the viewport around the
 * museum HUD, as large as the space allows.
 *
 * The HUD lives in the four corners (era label, progress dots, objective
 * tracker, Continue / back link). Rather than reserving full-width bands
 * for it, this treats every element marked `data-hud` as a rectangle the
 * artifact must not overlap. Each corner can be cleared either vertically
 * (the artifact sits above/below it — what a wide terminal wants) or
 * horizontally (the artifact sits beside it — what a tall phone wants); the
 * hook tries every combination and keeps the one that yields the largest
 * scale. The artifact is always centred horizontally in the viewport (an
 * off-centre device looks wrong), so clearing a corner horizontally costs
 * the same clearance on both sides; vertically it centres as far as the
 * free region allows.
 *
 * Returns { scale, left, top } in viewport px for a `position: fixed`
 * (or fixed-inset parent) wrapper of width*scale × height*scale.
 * Recomputes on resize and once after mount (so the tracker is measured).
 *
 * @param {number} width      Native artifact width
 * @param {number} height     Native artifact height
 * @param {object} [opts]
 * @param {number} [opts.maxScale=1.35]  Never enlarge past this
 * @param {number} [opts.gap=24]        Clearance from HUD blocks and edges
 */
export default function useArtifactFit(width, height, { maxScale = 1.35, gap = 24 } = {}) {
  const [fit, setFit] = useState(() => computeFit(width, height, maxScale, gap))

  useLayoutEffect(() => {
    const update = () => setFit(computeFit(width, height, maxScale, gap))
    update()
    // Measure again once fonts/tracker have settled.
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [width, height, maxScale, gap])

  return fit
}

/** Layout box of an element in viewport coordinates, ignoring transforms. */
function layoutRect(el) {
  let x = 0, y = 0
  for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop }
  return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight }
}

export function computeFit(width, height, maxScale, gap) {
  const W = window.innerWidth
  const H = window.innerHeight
  if (typeof document === 'undefined') return { scale: 1, left: 0, top: 0 }

  // Union rect per corner: TL, TR, BL, BR.
  const corners = {}
  document.querySelectorAll('[data-hud]').forEach(el => {
    if (!el.offsetWidth || !el.offsetHeight) return
    const r = layoutRect(el)
    const key = (r.top + r.bottom < H ? 'T' : 'B') + (r.left + r.right < W ? 'L' : 'R')
    const c = corners[key]
    corners[key] = c
      ? { left: Math.min(c.left, r.left), top: Math.min(c.top, r.top), right: Math.max(c.right, r.right), bottom: Math.max(c.bottom, r.bottom) }
      : r
  })

  const keys = Object.keys(corners)
  let best = null
  // Each corner: cleared vertically (bit 0) or horizontally (bit 1).
  for (let mask = 0; mask < (1 << keys.length); mask++) {
    let x0 = gap, x1 = W - gap, y0 = gap, y1 = H - gap
    keys.forEach((key, i) => {
      const r = corners[key]
      const horizontal = (mask >> i) & 1
      if (horizontal) {
        if (key[1] === 'L') x0 = Math.max(x0, r.right + gap)
        else x1 = Math.min(x1, r.left - gap)
      } else {
        if (key[0] === 'T') y0 = Math.max(y0, r.bottom + gap)
        else y1 = Math.min(y1, r.top - gap)
      }
    })
    // Horizontal room is symmetric about the viewport centre.
    const rw = 2 * Math.min(W / 2 - x0, x1 - W / 2), rh = y1 - y0
    if (rw <= 0 || rh <= 0) continue
    const scale = Math.min(rw / width, rh / height, maxScale)
    const sw = width * scale, sh = height * scale
    const left = W / 2 - sw / 2
    // Centre vertically when the region allows, else inside the region.
    const top = clamp(H / 2 - sh / 2, y0, y1 - sh)
    const offCentre = Math.abs(top + sh / 2 - H / 2)
    if (!best || scale > best.scale + 1e-6 || (Math.abs(scale - best.scale) < 1e-6 && offCentre < best.offCentre)) {
      best = { scale, left, top, offCentre }
    }
  }
  if (!best) {
    const scale = Math.min((W - 2 * gap) / width, (H - 2 * gap) / height, maxScale)
    return { scale, left: W / 2 - width * scale / 2, top: H / 2 - height * scale / 2 }
  }
  return { scale: best.scale, left: best.left, top: best.top }
}

function clamp(v, lo, hi) {
  return hi < lo ? lo : Math.min(Math.max(v, lo), hi)
}
