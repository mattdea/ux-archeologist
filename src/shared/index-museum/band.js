// src/shared/index-museum/band.js
//
// The discovery in a level's corners layout (backlog, "Index museum: the
// discovery text in a wide band at the bottom", 12 Nov 2026). At discovery
// the bottom-left corner's content goes in a band along the bottom; the
// corner keeps its size, so the device doesn't move. If the band would
// still cover the device it becomes a tray (on the page colour, over the
// device's lower part). These measure the boxes that decide it.

// The band counts as covering the device when it comes closer than this.
// Under the 16px gap the layout itself leaves (Level 5's chat stops 16px
// above the bottom corners), so a band set at that gap is not a tray.
export const BAND_GAP = 12

// The device's box, as useArtifactFit publishes it on <html>
// (--artifact-left / -top / -width / -height)
export function artifactBox() {
  const cs = getComputedStyle(document.documentElement)
  const v = (k) => parseFloat(cs.getPropertyValue(`--artifact-${k}`))
  const box = { x: v('left'), y: v('top'), w: v('width'), h: v('height') }
  return Object.values(box).every(Number.isFinite) && box.w > 0 ? box : null
}

// The device's box, or, with no fit published (Level 5's chat), the box
// the level marks data-artifact
export function deviceBox() {
  const fit = artifactBox()
  if (fit) return fit
  const el = document.querySelector('[data-artifact]')
  if (!el) return null
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 ? { x: r.left, y: r.top, w: r.width, h: r.height } : null
}

// An element's box in the viewport, ignoring transforms (so the tray's
// slide doesn't change the answer while it runs)
export function layoutBox(el) {
  let x = 0, y = 0
  for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

// Do two boxes come within `gap` of each other?
export function overlaps(a, b, gap = BAND_GAP) {
  if (!a || !b || !a.w || !a.h || !b.w || !b.h) return false
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y
}
