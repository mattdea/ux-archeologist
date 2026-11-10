// src/shared/index-museum/DotPicture.jsx
//
// A room's dot illustration (Matthew's, 10 Nov 2026; assets/dots/dots-N.webp,
// 400 × 340, ink-only masks, the same files as the style lab's G and B2).
// Drawn in currentColor through the mask, so it is black on white and white
// when its line or card is inverted.
import s from './IndexMuseum.module.css'

const DOTS = Object.fromEntries(
  Object.entries(import.meta.glob('../../../assets/dots/dots-*.webp', { eager: true, import: 'default' }))
    .map(([file, url]) => [Number(file.match(/dots-(\d)\.webp$/)[1]), url]),
)

export default function DotPicture({ level, className = '' }) {
  return <span className={`${s.dots} ${className}`} style={{ '--art': `url(${DOTS[level]})` }} aria-hidden="true" />
}
