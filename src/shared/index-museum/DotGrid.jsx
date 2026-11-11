// src/shared/index-museum/DotGrid.jsx
//
// Draws rows of '#' and '.' (pictures.js) as an SVG of circles in
// currentColor: an ink dot on every '#', a small background dot on every
// third point where there is no ink. One unit per grid point, so it stays
// sharp at any size and inverts with its line. Without rows it draws the
// bare background grid (an unfound room's card).
import { COLS, ROWS, INK, BG, isBackground } from './pictures'

export default function DotGrid({ rows, className = '', ...rest }) {
  const dots = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ink = rows?.[r]?.[c] === '#'
      if (!ink && !isBackground(c, r)) continue
      dots.push(<circle key={r * COLS + c} cx={c + 0.5} cy={r + 0.5} r={(ink ? INK : BG) / 2} />)
    }
  }
  return (
    <svg className={className} viewBox={`0 0 ${COLS} ${ROWS}`} fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      {dots}
    </svg>
  )
}
