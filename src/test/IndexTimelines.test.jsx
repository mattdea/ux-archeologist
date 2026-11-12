// src/test/IndexTimelines.test.jsx
//
// The home page's four timelines (backlog, "Index museum: one home page,
// the timeline opening under Enter", part 4): each lists the six rooms in
// time order with their states, as buttons labelled with the year, the
// title and the find's name or "not yet found", and the line, cards and
// dig reveal a new find once.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import IndexMuseum from '../shared/index-museum/IndexMuseum'
import { _resetIndexSlots } from '../shared/index-museum/store'
import { completeLevel, resetAll } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import { indexTimeline, setIndexTimeline, cardsSeen, markCardsSeen, forgetCardsSeen } from '../shared/devLooks'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const open = () => {
  const navigate = vi.fn()
  render(<IndexMuseum view="timeline" navigate={navigate} continueAction={null} hudReady={false} />)
  return navigate
}
const rooms = () => [...document.querySelectorAll('[data-ix-room]')]

describe('Index museum: the four timelines', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); resetAll(); _resetIndexSlots() })
  afterEach(() => { cleanup(); resetAll(); vi.unstubAllGlobals() })

  it('the list is the default, and the choice is remembered', () => {
    expect(indexTimeline()).toBe('list')
    setIndexTimeline('dig')
    expect(indexTimeline()).toBe('dig')
    expect(localStorage.getItem('ux-archaeologist:index-timeline')).toBe('dig')
    setIndexTimeline('list')
    expect(localStorage.getItem('ux-archaeologist:index-timeline')).toBeNull()
  })

  it('list: six room lines, found by name, the rest "not found"', () => {
    completeLevel(0); completeLevel(1)
    open()
    expect(document.querySelector('[data-ix-timeline]')).toBeNull()
    const lines = [...document.querySelectorAll('[data-ix-nav]')].map(b => b.textContent).filter(t => /^(1979|1984|1995|2007|2016|2023)/.test(t))
    expect(lines).toHaveLength(6)
    expect(lines[1]).toContain('Direct Manipulation')
    expect(lines[2]).toContain('not found')
  })

  for (const kind of ['line', 'cards', 'dig']) {
    it(`${kind}: six rooms in time order, each a labelled button to its level, focus on the next room`, () => {
      setIndexTimeline(kind)
      completeLevel(0); completeLevel(1); completeLevel(2)
      const navigate = open()
      expect(document.querySelector(`[data-ix-timeline="${kind}"]`)).not.toBeNull()
      const r = rooms()
      expect(r).toHaveLength(6)
      expect(r.map(b => b.getAttribute('aria-label'))).toEqual(ARTIFACTS.map(a => `${a.year}, ${a.title}, ${a.level <= 2 ? a.name : 'not yet found'}`))
      expect(r.map(b => b.dataset.found)).toEqual(['true', 'true', 'true', 'false', 'false', 'false'])
      r.forEach(b => expect(b.tagName).toBe('BUTTON'))
      expect(document.activeElement).toBe(r[3])
      expect(r[3].textContent).toContain('next')
      fireEvent.click(r[4])
      expect(navigate).toHaveBeenCalledWith('/level/4')
      // the picture beside the list goes; the timeline has the width
      expect(document.querySelector('[data-peek]')).toBeNull()
    })

    it(`${kind}: a new find is revealed once`, () => {
      setIndexTimeline(kind)
      forgetCardsSeen()
      completeLevel(0); markCardsSeen([0])
      completeLevel(1)
      open()
      expect(rooms().filter(b => b.dataset.reveal).map(b => b.dataset.ixRoom)).toEqual(['1'])
      expect(cardsSeen()).toEqual(expect.arrayContaining([0, 1]))
      cleanup()
      open()
      expect(rooms().filter(b => b.dataset.reveal)).toHaveLength(0)
    })
  }

  it('dig: oldest at the bottom, so up and down follow the drawing', () => {
    setIndexTimeline('dig')
    completeLevel(0)
    open()
    const r = rooms()
    expect(screen.getByText('unexcavated · next')).toBeInTheDocument()
    expect(document.activeElement).toBe(r[1])
    fireEvent.keyDown(r[1], { key: 'ArrowUp' })
    expect(document.activeElement).toBe(r[2])
    fireEvent.keyDown(r[2], { key: 'ArrowDown' })
    fireEvent.keyDown(r[1], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(r[0])
  })

  it('line and cards: left and right move between the rooms', () => {
    setIndexTimeline('cards')
    open()
    const r = rooms()
    expect(document.activeElement).toBe(r[0])
    fireEvent.keyDown(r[0], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(r[1])
    fireEvent.keyDown(r[1], { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(r[0])
  })
})
