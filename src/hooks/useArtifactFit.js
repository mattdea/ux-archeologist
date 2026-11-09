// src/hooks/useArtifactFit.js
import { useState, useLayoutEffect } from 'react'

/**
 * Fits a native-size artifact (width × height) into the viewport around the
 * museum HUD, as large as the space allows, with EQUAL breathing room above
 * and below it.
 *
 * Every element marked `data-hud` is a rectangle the artifact must not
 * overlap. HUD boxes must be their visible boxes (no invisible top padding),
 * or the gaps measured here will not be the gaps the eye sees.
 *
 *  - The TOP HUD (era label, progress dots) is always a full-width band.
 *    The artifact starts `bandGap` below it, never beside it.
 *  - The BOTTOM HUD (objectives, Continue, back link) is cleared either
 *    vertically (artifact above it, `bandGap` away — wide terminal, Mac,
 *    Netscape) or horizontally (artifact beside it, `sideGap` away — phone).
 *    Both are tried; the larger artifact wins.
 *  - Vertical symmetry: when the artifact sits beside the bottom HUD, it is
 *    kept as far from the bottom edge as from the top edge. When it sits
 *    above the bottom HUD, it is centred between the top band and the
 *    bottom HUD. Either way the gap above equals the gap below.
 *  - Always centred horizontally in the viewport.
 *  - Room for the hint: the docked HintPill sits `hintGap` under the
 *    artifact, so an artifact above the bottom HUD keeps at least
 *    `hintSpace` between its bottom and the HUD (pill + gaps), not just
 *    `bandGap`. The hook publishes the pill's place as CSS variables on
 *    <html>: --hint-top (artifact bottom + hintGap) and --hint-max (the
 *    artifact's width), removed again on unmount.
 *
 * Returns { scale, left, top } in viewport px for an absolutely positioned
 * wrapper of width*scale × height*scale. Recomputes on resize and once
 * after mount (so the tracker is measured once it has laid out).
 *
 * @param {number} width      Native artifact width (must equal the frame's CSS width)
 * @param {number} height     Native artifact height (must equal the frame's CSS height)
 * @param {object} [opts]
 * @param {number} [opts.maxScale=1.35]  Never enlarge past this
 * @param {number} [opts.bandGap=32]    Clearance from the top band and from a bottom HUD below
 * @param {number} [opts.sideGap=40]    Clearance from a bottom HUD block beside the artifact
 * @param {number} [opts.edgeGap=24]    Clearance from the viewport edges when no HUD is there
 * @param {number} [opts.hintSpace=64]  Least space between the artifact and a bottom HUD below it
 */
export const HINT_GAP = 14

export default function useArtifactFit(width, height, { maxScale = 1.35, bandGap = 32, sideGap = 40, edgeGap = 24, hintSpace = 64 } = {}) {
  const [fit, setFit] = useState(() => computeFit(width, height, { maxScale, bandGap, sideGap, edgeGap, hintSpace }))

  // Where the docked hint goes: just under the artifact, no wider than it.
  useLayoutEffect(() => {
    const s = document.documentElement.style
    s.setProperty('--hint-top', `${fit.top + height * fit.scale + HINT_GAP}px`)
    s.setProperty('--hint-max', `${width * fit.scale}px`)
    return () => { s.removeProperty('--hint-top'); s.removeProperty('--hint-max') }
  }, [fit, width, height])

  useLayoutEffect(() => {
    const update = () => setFit(computeFit(width, height, { maxScale, bandGap, sideGap, edgeGap, hintSpace }))
    update()
    // Measure again once fonts/tracker have settled.
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [width, height, maxScale, bandGap, sideGap, edgeGap, hintSpace])

  return fit
}

/** Layout box of an element in viewport coordinates, ignoring transforms. */
function layoutRect(el) {
  let x = 0, y = 0
  for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop }
  return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight }
}

function union(a, b) {
  return a
    ? { left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) }
    : b
}

export function computeFit(width, height, { maxScale = 1.35, bandGap = 32, sideGap = 40, edgeGap = 24, hintSpace = 64 } = {}) {
  if (typeof document === 'undefined') return { scale: 1, left: 0, top: 0 }
  const W = window.innerWidth
  const H = window.innerHeight

  let bandBottom = 0
  const bottom = { L: null, R: null }
  document.querySelectorAll('[data-hud]').forEach(el => {
    if (!el.offsetWidth || !el.offsetHeight) return
    const r = layoutRect(el)
    if (r.top + r.bottom < H) bandBottom = Math.max(bandBottom, r.bottom)
    else bottom[r.left + r.right < W ? 'L' : 'R'] = union(bottom[r.left + r.right < W ? 'L' : 'R'], r)
  })

  // Top of the free region: below the band. The bottom edge mirrors it so
  // an artifact beside the bottom HUD never sits closer to the floor than
  // to the ceiling.
  const y0 = bandBottom ? bandBottom + bandGap : edgeGap
  const sides = Object.keys(bottom).filter(k => bottom[k])

  let best = null
  for (let mask = 0; mask < (1 << sides.length); mask++) {
    let x0 = edgeGap, x1 = W - edgeGap, y1 = H - y0
    sides.forEach((side, i) => {
      const r = bottom[side]
      if ((mask >> i) & 1) {
        if (side === 'L') x0 = Math.max(x0, r.right + sideGap)
        else x1 = Math.min(x1, r.left - sideGap)
      } else {
        y1 = Math.min(y1, r.top - Math.max(bandGap, hintSpace))
      }
    })
    const rw = 2 * Math.min(W / 2 - x0, x1 - W / 2), rh = y1 - y0
    if (rw <= 0 || rh <= 0) continue
    const scale = Math.min(rw / width, rh / height, maxScale)
    const sw = width * scale, sh = height * scale
    // Centred in the free region → gap above === gap below.
    const fit = { scale, left: W / 2 - sw / 2, top: y0 + (rh - sh) / 2 }
    if (!best || scale > best.scale + 1e-6) best = fit
  }

  if (!best) {
    const rh = Math.max(1, H - 2 * y0)
    const scale = Math.min((W - 2 * edgeGap) / width, rh / height, maxScale)
    return { scale, left: W / 2 - width * scale / 2, top: y0 + (rh - height * scale) / 2 }
  }
  return best
}
