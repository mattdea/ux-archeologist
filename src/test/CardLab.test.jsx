// src/test/CardLab.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import CardLab from '../pages/CardLab'
import { FadeNavCtx } from '../shared/SharedLayout'
import { VARIANTS } from '../pages/cardLab/variants'
import { ARTIFACTS } from '../data/artifacts'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const renderLab = () => render(<FadeNavCtx.Provider value={vi.fn()}><CardLab /></FadeNavCtx.Provider>)
// role queries over 40-odd cards are slow in jsdom; the cards carry this label
const cards = () => [...document.querySelectorAll('[role="button"][aria-label$="turn over"]')]

describe('Card lab', () => {
  beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
  afterEach(() => vi.unstubAllGlobals())

  it('lays out every design with all six artifacts, fronts up', () => {
    renderLab()
    VARIANTS.forEach(v => expect(screen.getByText(v.name)).toBeInTheDocument())
    const flips = cards()
    expect(flips).toHaveLength(VARIANTS.length * ARTIFACTS.length)
    flips.forEach(f => expect(f).toHaveAttribute('aria-pressed', 'false'))
  })

  it('turns one card over on click, and all of them with Backs and Fronts', () => {
    renderLab()
    const first = () => cards()[0]
    fireEvent.click(first())
    expect(first()).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByText('Backs'))
    cards().forEach(f => expect(f).toHaveAttribute('aria-pressed', 'true'))
    fireEvent.click(screen.getByText('Fronts'))
    cards().forEach(f => expect(f).toHaveAttribute('aria-pressed', 'false'))
  })

  it('narrows to one artifact', () => {
    renderLab()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } })
    expect(cards()).toHaveLength(VARIANTS.length)
  })

  it('stamp cards: a grid of six, each with its stamp, text and number, and text that passes AA on its colour', () => {
    renderLab()
    const stamp = VARIANTS.find(v => v.design === 'stamp')
    expect(stamp.arrange).toBe('grid')
    const h = screen.getByText('Stamp cards')
    const row = h.closest('section').querySelector('[class*="grid"]')
    expect(row).not.toBeNull()
    ARTIFACTS.forEach((a, i) => {
      const label = `No. ${String(i + 1).padStart(2, '0')} of 6`
      // front and back both carry the number
      expect([...row.querySelectorAll('span')].filter(e => e.textContent === label)).toHaveLength(2)
      expect(row.textContent).toContain(`${a.title}, ${a.year}`)
    })
    const masks = [...row.querySelectorAll('[style*="--mask"]')]
    expect(masks).toHaveLength(6)
    masks.forEach((m, i) => expect(m.style.getPropertyValue('--mask')).toMatch(new RegExp(`mask-${i}`)))
    // WCAG contrast of the ink on each card's colour
    const lum = (hex) => {
      const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    }
    stamp.plates.forEach(bg => {
      const [a, b] = [lum(bg), lum(stamp.ink)].sort((x, y) => y - x)
      expect((a + 0.05) / (b + 0.05)).toBeGreaterThanOrEqual(4.5)
    })
  })
})
