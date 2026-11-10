// src/test/Collection.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Collection from '../pages/Collection'
import Timeline from '../pages/Timeline'
import { FadeNavCtx } from '../shared/SharedLayout'
import { completeLevel, resetAll } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'

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

const renderWith = (ui, navigate = vi.fn()) => {
  render(<FadeNavCtx.Provider value={navigate}>{ui}</FadeNavCtx.Provider>)
  return navigate
}

describe('Collection', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    resetAll()
  })
  afterEach(() => vi.unstubAllGlobals())

  it('with nothing found, shows six outlines and no artifact names', () => {
    renderWith(<Collection />)
    expect(screen.getByText('0 of 6 found')).toBeInTheDocument()
    expect(screen.getAllByText('Finish this room to add it.')).toHaveLength(6)
    ARTIFACTS.forEach(a => expect(screen.queryByText(a.name)).not.toBeInTheDocument())
  })

  it('with three rooms done, shows those three artifacts in full', () => {
    ;[0, 2, 4].forEach(completeLevel)
    renderWith(<Collection />)
    expect(screen.getByText('3 of 6 found')).toBeInTheDocument()
    expect(screen.getAllByText('Finish this room to add it.')).toHaveLength(3)
    ;[0, 2, 4].forEach(n => {
      expect(screen.getByText(ARTIFACTS[n].name)).toBeInTheDocument()
      expect(screen.getByText(ARTIFACTS[n].description)).toBeInTheDocument()
    })
    expect(screen.queryByText(ARTIFACTS[1].name)).not.toBeInTheDocument()
  })

  it('with all six done, shows every artifact, and each card opens its room', () => {
    ARTIFACTS.forEach(a => completeLevel(a.level))
    const navigate = renderWith(<Collection />)
    expect(screen.getByText('6 of 6 found')).toBeInTheDocument()
    expect(screen.queryByText('Finish this room to add it.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Multi-Touch/ }))
    expect(navigate).toHaveBeenCalledWith('/level/3')
  })

  it('a card for an unfinished room opens it too, and the back link goes to the timeline', () => {
    const navigate = renderWith(<Collection />)
    fireEvent.click(screen.getByRole('button', { name: /1984.*The Desktop/ }))
    expect(navigate).toHaveBeenCalledWith('/level/1')
    fireEvent.click(screen.getByRole('button', { name: '← Back to timeline' }))
    expect(navigate).toHaveBeenCalledWith('/timeline')
  })

  it('the timeline links to it with the count, and Reset empties it', () => {
    completeLevel(0); completeLevel(1)
    const navigate = renderWith(<Timeline />)
    fireEvent.click(screen.getByRole('button', { name: 'Collection · 2 of 6' }))
    expect(navigate).toHaveBeenCalledWith('/collection')
    resetAll()
    renderWith(<Collection />)
    expect(screen.getByText('0 of 6 found')).toBeInTheDocument()
  })
})
