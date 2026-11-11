// src/shared/index-museum/find.js
//
// Where the room's picture goes beside its discovery text in a level's
// bottom-left corner (IndexMuseum's Find): about as tall as the text and
// bottom-aligned with it, beside it first, at the text's height or as near
// it as fits, then above it, else nowhere. Never over the device
// (useArtifactFit's --artifact-* box), another corner or the window's edge.
const FIND_RATIO = 400 / 340
const FIND_GAP = 16
const FIND_MIN_H = 100

export function artifactBox() {
  const cs = getComputedStyle(document.documentElement)
  const v = (k) => parseFloat(cs.getPropertyValue(`--artifact-${k}`))
  const box = { x: v('left'), y: v('top'), w: v('width'), h: v('height') }
  return Object.values(box).every(Number.isFinite) && box.w > 0 ? box : null
}

export function placeFind({ text, viewport, avoid, row = 20 }) {
  const hit = (a, b) => a.x < b.x + b.w + FIND_GAP && a.x + a.w + FIND_GAP > b.x && a.y < b.y + b.h + FIND_GAP && a.y + a.h + FIND_GAP > b.y
  const fits = (r) => r.x >= FIND_GAP && r.y >= FIND_GAP && r.x + r.w <= viewport.w - FIND_GAP && r.y + r.h <= viewport.h - FIND_GAP && !avoid.some((b) => hit(r, b))
  const full = Math.max(FIND_MIN_H, Math.round(text.h))
  const sizes = []
  for (let h = full; h >= FIND_MIN_H; h -= row) sizes.push(h)
  for (const where of ['beside', 'above']) {
    for (const h of sizes) {
      const w = Math.round(h * FIND_RATIO)
      const r = where === 'beside'
        ? { x: text.x + text.w + FIND_GAP, y: text.y + text.h - h, w, h }
        : { x: text.x, y: text.y - row - h, w, h }
      if (fits(r)) return { ...r, where }
    }
  }
  return null
}

