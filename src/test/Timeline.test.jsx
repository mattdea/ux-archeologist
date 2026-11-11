// src/test/Timeline.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Timeline from '../pages/Timeline'
import { FadeNavCtx } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete, resetAll } from '../state/state'

function renderTimeline(navigate = vi.fn()) {
  render(
    <FadeNavCtx.Provider value={navigate}>
      <Timeline />
    </FadeNavCtx.Provider>
  )
  return navigate
}

// Node's built-in localStorage shadows jsdom's and doesn't store anything
// here, so progress gets an in-memory stand-in.
function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

describe('Timeline', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('sessionStorage', memoryStorage())
    resetAll()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('level entries are buttons that open their level', () => {
    const navigate = renderTimeline()
    fireEvent.click(screen.getByRole('button', { name: /1984.*The Desktop/ }))
    expect(navigate).toHaveBeenCalledWith('/level/1')
  })

  it('Reset progress asks first, and Cancel keeps progress', () => {
    completeLevel(0)
    const navigate = renderTimeline()
    fireEvent.click(screen.getByText('Reset progress'))
    expect(screen.getByText('Reset all six levels?')).toBeInTheDocument()
    expect(isLevelComplete(0)).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(isLevelComplete(0)).toBe(true)
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByText('Reset progress')).toBeInTheDocument()
  })

  it('confirming the reset clears progress and returns to the title', () => {
    completeLevel(0)
    const navigate = renderTimeline()
    fireEvent.click(screen.getByText('Reset progress'))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(isLevelComplete(0)).toBe(false)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('Reset also clears what a level kept for the visit (Level 1\'s ticks)', () => {
    sessionStorage.setItem('l1_completed', JSON.stringify([0, 1, 2]))
    sessionStorage.setItem('l1_notepad', '["a"]')
    renderTimeline()
    fireEvent.click(screen.getByText('Reset progress'))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(sessionStorage.getItem('l1_completed')).toBeNull()
    expect(sessionStorage.getItem('l1_notepad')).toBeNull()
  })
})
