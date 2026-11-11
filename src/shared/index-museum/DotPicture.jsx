// src/shared/index-museum/DotPicture.jsx
//
// A room's picture in the index museum.
//
// Dots (the default): Matthew's dot illustration (10 Nov 2026;
// assets/dots/dots-N.webp, 400 × 340, ink-only masks, the same files as the
// style lab's G and B2), drawn in currentColor through the mask, so it is
// black on white and white when its line or card is inverted.
//
// Fossils (dev server only, the dev panel's Pictures; pictureStyle.js): each
// room's idea as an archaeological find in stipple ink
// (assets/fossils/fossil-N.webp, ink-density masks made by
// scripts/fossil-pictures.mjs, 600 × 510, the same 400 / 340 shape). Drawn
// in currentColor like the dots, so black on white, light on dark, and
// inverted on the black row.
//
// Stamps (dev server only, the dev panel's Pictures): the
// stamp print cut from docs/reference/style-lab/stamp-illustrations.webp
// (assets/stamps/stamp-N.webp, 480 × 408, the same 400 / 340 shape), on its
// own paper in its own colours. It never inverts and has no frame: the
// paper's edge is the picture's edge.
import s from './IndexMuseum.module.css'
import { usePictureStyle } from './pictureStyle'

const byLevel = (files) => Object.fromEntries(
  Object.entries(files).map(([file, url]) => [Number(file.match(/-(\d)\.webp$/)[1]), url]),
)
const DOTS = byLevel(import.meta.glob('../../../assets/dots/dots-*.webp', { eager: true, import: 'default' }))
// Dev only: served by path by the dev server and never imported, so the
// production build carries no stamp files
const stamp = (level) => (import.meta.env.DEV ? `/assets/stamps/stamp-${level}.webp` : null)
const fossil = (level) => (import.meta.env.DEV ? `/assets/fossils/fossil-${level}.webp` : null)

// The stamp shown beside the list while no room is pointed at (Matthew,
// 10 Nov 2026: an arrowhead, the pointer as a found object; source
// docs/reference/style-lab/stamp-default-arrowhead.webp, cut to the stamps'
// 480 × 408 tile and scale). With the fossils, the carved tablet rests
// there: the museum's main picture, the six rooms' signs cut into one broken
// stone (Matthew, 10 Nov 2026; assets/fossils/fossil-tablet.webp, a mask made
// by scripts/fossil-tablet.mjs, at its own proportions; `contain` fits it,
// so a larger file swaps in without code changes). Null with the dots.
export function RestingPicture({ className = '' }) {
  const style = usePictureStyle()
  if (!import.meta.env.DEV) return null
  if (style === 'fossils') {
    return <span className={`${s.dots} ${className}`} style={{ '--art': `url(${fossil('tablet')})` }} aria-hidden="true" data-picture="fossil-tablet" />
  }
  if (style !== 'stamps') return null
  return <img src="/assets/stamps/stamp-default.webp" className={`${s.stamp} ${className}`} alt="" aria-hidden="true" draggable="false" data-picture="stamp-default" />
}

export default function DotPicture({ level, className = '' }) {
  const style = usePictureStyle()
  if (style === 'stamps' && stamp(level)) {
    return <img src={stamp(level)} className={`${s.stamp} ${className}`} alt="" aria-hidden="true" draggable="false" data-picture="stamp" />
  }
  if (style === 'fossils' && fossil(level)) {
    return <span className={`${s.dots} ${className}`} style={{ '--art': `url(${fossil(level)})` }} aria-hidden="true" data-picture="fossil" />
  }
  return <span className={`${s.dots} ${className}`} style={{ '--art': `url(${DOTS[level]})` }} aria-hidden="true" data-picture="dots" />
}
