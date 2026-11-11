// src/test/DotPictures.test.jsx
//
// The index museum's dot pictures on one grid (backlog, "dot pictures drawn
// on one grid"): six pictures, each ROWS rows of COLS points, only '#' and
// '.', drawn as one circle per ink dot plus the background points left bare.
import { render } from '@testing-library/react'
import { PICTURES, COLS, ROWS, isBackground } from '../shared/index-museum/pictures'
import DotGrid from '../shared/index-museum/DotGrid'

describe('dot pictures', () => {
  it('six pictures, every one 36 × 30 of # and .', () => {
    expect(Object.keys(PICTURES).map(Number)).toEqual([0, 1, 2, 3, 4, 5])
    expect([COLS, ROWS]).toEqual([36, 30])
    for (const rows of Object.values(PICTURES)) {
      expect(rows).toHaveLength(ROWS)
      rows.forEach(row => expect(row).toMatch(new RegExp(`^[#.]{${COLS}}$`)))
    }
  })

  it('DotGrid draws each ink dot once and a background dot only where there is no ink', () => {
    const rows = PICTURES[0]
    const { container } = render(<DotGrid rows={rows} />)
    let ink = 0, bg = 0
    rows.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch === '#') ink++
      else if (isBackground(c, r)) bg++
    }))
    const circles = [...container.querySelectorAll('circle')]
    expect(circles).toHaveLength(ink + bg)
    expect(circles.filter(e => e.getAttribute('r') === '0.4')).toHaveLength(ink)
    expect(container.querySelector('svg').getAttribute('viewBox')).toBe('0 0 36 30')
  })

  it('without rows it draws the bare 12 × 10 background grid', () => {
    const { container } = render(<DotGrid />)
    expect(container.querySelectorAll('circle')).toHaveLength(120)
  })
})
