// src/test/CardPath.test.jsx
import { render, screen, act, fireEvent } from '@testing-library/react'
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

const renderPath = (navigate = vi.fn()) => ({ navigate, ...render(<FadeNavCtx.Provider value={navigate}><CardPath /></FadeNavCtx.Provider>) })
const faceUp = () => screen.queryAllByText('Hyperlink Navigation').length

describe('CardPath (the timeline as cards)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('sessionStorage', memoryStorage())
    resetAll()
    vi.useFakeTimers()
  })
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

  it('with nothing done, all six are face down and the first says Start here', () => {
    renderPath()
    expect(screen.getAllByText('Finish this room to add it.')).toHaveLength(6)
    expect(screen.getByText('Start here')).toBeInTheDocument()
  })

  it('a face-down card is a plain button that opens its room', () => {
    const { navigate } = renderPath()
    fireEvent.click(screen.getByRole('button', { name: /2016.*The Feed/ }))
    expect(navigate).toHaveBeenCalledWith('/level/4')
  })

  it('a room finished since the last visit turns over, then rests face up as a plain card', () => {
    completeLevel(2)
    const { unmount, navigate } = renderPath()
    expect(faceUp()).toBe(0)
    expect(screen.queryByText('Start here')).not.toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(800) })    // turning: both faces, no clicks
    act(() => { vi.advanceTimersByTime(1200) })   // done: just the card
    expect(faceUp()).toBe(1)
    expect(cardsSeen()).toEqual([2])
    fireEvent.click(screen.getByRole('button', { name: /Hyperlink Navigation/ }))
    expect(navigate).toHaveBeenCalledWith('/level/2')
    unmount()
    // next visit: already face up, no turn
    renderPath()
    expect(faceUp()).toBe(1)
  })
})
