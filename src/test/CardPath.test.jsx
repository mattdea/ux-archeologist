// src/test/CardPath.test.jsx
import { render, screen, act } from '@testing-library/react'
import CardPath from '../pages/CardPath'
import { FadeNavCtx } from '../shared/SharedLayout'
import { completeLevel, resetAll } from '../state/state'
import { cardsSeen } from '../shared/devLooks'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const renderPath = () => render(<FadeNavCtx.Provider value={vi.fn()}><CardPath /></FadeNavCtx.Provider>)
const flipped = (container) => container.querySelectorAll('[class*="flipped"]').length

describe('CardPath (the timeline as cards)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('sessionStorage', memoryStorage())
    resetAll()
    vi.useFakeTimers()
  })
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

  it('with nothing done, all six are face down and the first says Start here', () => {
    const { container } = renderPath()
    expect(screen.getAllByText('Finish this room to add it.')).toHaveLength(6)
    expect(screen.getByText('Start here')).toBeInTheDocument()
    expect(flipped(container)).toBe(0)
  })

  it('a room finished since the last visit turns over, and is remembered as seen', () => {
    completeLevel(2)
    const { container, unmount } = renderPath()
    expect(flipped(container)).toBe(0)
    expect(screen.queryByText('Start here')).not.toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(flipped(container)).toBe(1)
    expect(cardsSeen()).toEqual([2])
    unmount()
    // next visit: already face up, no turn
    const again = renderPath()
    expect(flipped(again.container)).toBe(1)
  })
})
