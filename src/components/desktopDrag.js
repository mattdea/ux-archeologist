// src/components/desktopDrag.js
//
// Drag helpers for the 1984 desktop. The Mac is drawn inside a scale()
// transform (useArtifactFit), so mouse coordinates (screen px) and desktop
// positions (native px) differ by that scale. Every drag works in desktop
// coordinates, and the dashed outlines live inside the desktop element, so
// they scale with the Mac, match the dragged item exactly and track the
// cursor at any bezel size.

/** Screen point → coordinates local to `el` (its unscaled CSS box). */
export function toLocal(el, clientX, clientY) {
  const r = el.getBoundingClientRect()
  const s = r.width / el.offsetWidth || 1
  return { x: (clientX - r.left) / s, y: (clientY - r.top) / s }
}

/** Dashed drag outline, positioned in `parent`'s local coordinates. */
export function createOutline(parent, { x, y, w, h }) {
  const el = document.createElement('div')
  el.style.cssText = `
    position: absolute;
    box-sizing: border-box;
    width: ${w}px;
    height: ${h}px;
    left: ${x}px;
    top: ${y}px;
    border: 1px dashed #000;
    box-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff;
    pointer-events: none;
    z-index: 9999;
  `
  parent.appendChild(el)
  return el
}

export function moveOutline(el, x, y) {
  el.style.left = `${x}px`
  el.style.top = `${y}px`
}

export function resizeOutline(el, w, h) {
  el.style.width = `${w}px`
  el.style.height = `${h}px`
}

export function removeOutline(el) {
  el?.parentNode?.removeChild(el)
}
