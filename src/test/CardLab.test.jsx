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
})
