// src/shared/index-museum/band.js
//
// The device's box, for museum pieces laid over it in a level's corners
// layout: the fade over the device at discovery (IndexMuseum's DeviceFade;
// backlog, "Index museum: fixes from Matthew's review", 12 Nov 2026).

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
