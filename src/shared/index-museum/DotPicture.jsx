// src/shared/index-museum/DotPicture.jsx
//
// A room's picture in the index museum.
//
// Dots (the default): Matthew's dot illustration (10 Nov 2026;
// assets/dots/dots-N.webp, 400 × 340, ink-only masks, the same files as the
// style lab's G and B2), drawn in currentColor through the mask, so it is
// black on white and white when its line or card is inverted.
//
// Stamps (dev server only, the "Stamp pictures" line; pictureStyle.js): the
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

export default function DotPicture({ level, className = '' }) {
  const style = usePictureStyle()
  if (style === 'stamps' && stamp(level)) {
    return <img src={stamp(level)} className={`${s.stamp} ${className}`} alt="" aria-hidden="true" draggable="false" data-picture="stamp" />
  }
  return <span className={`${s.dots} ${className}`} style={{ '--art': `url(${DOTS[level]})` }} aria-hidden="true" data-picture="dots" />
}
