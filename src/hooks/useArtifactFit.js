// src/hooks/useArtifactFit.js
import { useState, useLayoutEffect } from 'react'

/**
 * Fits a native-size artifact (width × height) into the viewport around the
 * museum HUD, as large as the space allows, and centres it in the room that
 * is left.
 *
 * The HUD lives in the four corners (era label, progress dots, objective
 * tracker, Continue / back link). Every element marked `data-hud` is a
 * rectangle the artifact must not overlap. The rule is:
 *
 *  - The TOP HUD is always a full-width band. The artifact never sits
 *    beside the era label or the progress dots; it always starts below
 *    them, with `topGap` of breathing room. A device touching the top
 *    labels reads as a layout bug, so this is not negotiable.
 *  - The BOTTOM HUD (objectives, Continue, back link) is cleared either
 *    vertically (artifact above it — what a wide terminal or browser wants)
 *    or horizontally (artifact beside it — what a tall phone wants). Both
 *    are tried and the one that yields the larger artifact wins.
 *  - The artifact is always centred horizontally in the viewport, so
 *    clearing the bottom HUD sideways costs the same clearance on both
 *    sides. Vertically it is centred in the free region (between the top
 *    band and whatever bounds it below), not in the raw viewport, so it
 *    looks balanced inside the frame the HUD draws around it.
 *
 * Returns { scale, left, top } in viewport px for an absolutely positioned
 * wrapper of width*scale × height*scale. Recomputes on resize and once
 * after mount (so the tracker is measured once it has laid out).
 *
 * @param {number} width      Native artifact width
 * @param {number} height     Native artifact height
 * @param {object} [opts]
 * @param {number} [opts.maxScale=1.35]  Never enlarge past this
 * @param {number} [opts.gap=24]        Clearance from the bottom HUD and viewport edges
 * @param {number} [opts.topGap=32]     Clearance below the top HUD band
 * @param {number} [opts.sideGap=40]    Clearance when the artifact sits beside a bottom HUD block
 */
export default function useArtifactFit(width, height, { maxScale = 1.35, gap = 24, topGap = 32, sideGap = 40 } = {}) {
  const [fit, setFit] = useState(() => computeFit(width, height, maxScale, gap, topGap, sideGap))

  useLayoutEffect(() => {
    const update = () => setFit(computeFit(width, height, maxScale, gap, topGap, sideGap))
    update()
    // Measure again once fonts/tracker have settled.
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [width, height, maxScale, gap, topGap, sideGap])

  return fit
}

/** Layout box of an element in viewport coordinates, ignoring transforms. */
function layoutRect(el) {
  let x = 0, y = 0
  for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop }
  return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight }
}

export function computeFit(width, height, maxScale, gap, topGap = gap, sideGap = gap) {
  if (typeof document === 'undefined') return { scale: 1, left: 0, top: 0 }
  const W = window.innerWidth
  const H = window.innerHeight

  // Top band: lowest edge of any HUD block in the upper half.
  // Bottom blocks: kept per side so they can be cleared sideways.
  let bandBottom = 0
  const bottom = { L: null, R: null }
  document.querySelectorAll('[data-hud]').forEach(el => {
    if (!el.offsetWidth || !el.offsetHeight) return
    const r = layoutRect(el)
    if (r.top + r.bottom < H) {
      bandBottom = Math.max(bandBottom, r.bottom)
    } else {
      const side = r.left + r.right < W ? 'L' : 'R'
      const c = bottom[side]
      bottom[side] = c
        ? { left: Math.min(c.left, r.left), top: Math.min(c.top, r.top), right: Math.max(c.right, r.right), bottom: Math.max(c.bottom, r.bottom) }
        : r
    }
  })

  const y0 = Math.max(gap, bandBottom + (bandBottom ? topGap : 0))
  const sides = Object.keys(bottom).filter(k => bottom[k])

  let best = null
  // Each bottom block: cleared vertically (bit 0) or horizontally (bit 1).
  for (let mask = 0; mask < (1 << sides.length); mask++) {
    let x0 = gap, x1 = W - gap, y1 = H - gap
    sides.forEach((side, i) => {
      const r = bottom[side]
      if ((mask >> i) & 1) {
        if (side === 'L') x0 = Math.max(x0, r.right + sideGap)
        else x1 = Math.min(x1, r.left - sideGap)
      } else {
        y1 = Math.min(y1, r.top - gap)
      }
    })
    // Horizontal room is symmetric about the viewport centre.
    const rw = 2 * Math.min(W / 2 - x0, x1 - W / 2), rh = y1 - y0
    if (rw <= 0 || rh <= 0) continue
    const scale = Math.min(rw / width, rh / height, maxScale)
    const sw = width * scale, sh = height * scale
    const left = W / 2 - sw / 2
    // Centre in the free region, never above the top band.
    const top = Math.max(y0, y0 + (rh - sh) / 2)
    if (!best || scale > best.scale + 1e-6) best = { scale, left, top }
  }

  if (!best) {
    const rh = Math.max(1, H - gap - y0)
    const scale = Math.min((W - 2 * gap) / width, rh / height, maxScale)
    return { scale, left: W / 2 - width * scale / 2, top: y0 + Math.max(0, (rh - height * scale) / 2) }
  }
  return best
}
