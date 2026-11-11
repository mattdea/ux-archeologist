// src/test/DevPanel.test.jsx
//
// The dev panel behind the corner `dev` tab (backlog, "Dev: one dev panel
// behind a corner tab"): each control does what its old line or button did,
// under the same storage key; the tab, Ctrl+Shift+D, Escape and a click
// outside open and close it; and the production build has none of it.
import { render, screen, fireEvent, act, cleanup, within } from '@testing-library/react'
import DevPanel from '../shared/dev/DevPanel'
import Timeline from '../pages/Timeline'
import Collection from '../pages/Collection'
import { FadeNavCtx } from '../shared/SharedLayout'
import { setMuseumStyle, museumStyle } from '../shared/museumStyle'
import { setPictureStyle, pictureStyle } from '../shared/index-museum/pictureStyle'
import { setSerifTitles } from '../shared/devLooks'
import { isLevelComplete, resetAll } from '../state/state'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const tab = () => screen.getByRole('button', { name: /Dev panel/ })
const panel = () => screen.queryByRole('dialog', { name: 'Dev panel' })
const group = (label) => within(panel()).getByRole('group', { name: label })
const choose = (label, option) => fireEvent.click(within(group(label)).getByRole('button', { name: option }))

function renderWith(page, navigate = vi.fn()) {
  render(
    <FadeNavCtx.Provider value={navigate}>
      {page}
      <DevPanel navigate={navigate} />
    </FadeNavCtx.Provider>
  )
  return navigate
}

describe('Dev panel', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); resetAll(); act(() => setMuseumStyle('classic')) })
  afterEach(() => {
    cleanup()
    act(() => { setMuseumStyle('classic'); setPictureStyle('dots') })
    setSerifTitles(false)
    resetAll(); vi.unstubAllGlobals()
  })

  it('the tab opens it, Escape closes it and puts focus back on the tab', () => {
    renderWith(null)
    expect(tab().textContent).toBe('dev')
    expect(panel()).toBeNull()
    fireEvent.click(tab())
    expect(panel()).not.toBeNull()
    expect(tab().getAttribute('aria-expanded')).toBe('true')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(tab())
  })

  it('Ctrl+Shift+D toggles it, a click outside closes it, and open or closed is remembered', () => {
    renderWith(<p>page</p>)
    fireEvent.keyDown(window, { key: 'D', code: 'KeyD', ctrlKey: true, shiftKey: true })
    expect(panel()).not.toBeNull()
    expect(localStorage.getItem('ux-archaeologist:dev-panel')).toBe('1')
    cleanup()
    renderWith(<p>page</p>)
    expect(panel()).not.toBeNull()                       // still open on the next visit
    fireEvent.pointerDown(screen.getByText('page'))
    expect(panel()).toBeNull()
    expect(localStorage.getItem('ux-archaeologist:dev-panel')).toBeNull()
    fireEvent.keyDown(window, { key: 'D', code: 'KeyD', ctrlKey: true, shiftKey: true })
    fireEvent.keyDown(window, { key: 'D', code: 'KeyD', ctrlKey: true, shiftKey: true })
    expect(panel()).toBeNull()
  })

  it('Museum switches Classic and Index; Pictures shows with the Index only', () => {
    renderWith(null)
    fireEvent.click(tab())
    expect(within(panel()).queryByRole('group', { name: 'pictures' })).toBeNull()
    choose('museum', 'Index')
    expect(museumStyle()).toBe('index')
    choose('pictures', 'stamps')
    expect(pictureStyle()).toBe('stamps')
    expect(localStorage.getItem('ux-archaeologist:index-pictures')).toBe('stamps')
    choose('pictures', 'fossils')
    expect(pictureStyle()).toBe('fossils')
    choose('pictures', 'dots')
    expect(localStorage.getItem('ux-archaeologist:index-pictures')).toBeNull()
    choose('museum', 'Classic')
    expect(museumStyle()).toBe('classic')
  })

  it('Complete all marks every level done and the timeline shows it', () => {
    renderWith(<Timeline />)
    fireEvent.click(tab())
    fireEvent.click(within(panel()).getByRole('button', { name: 'Complete all' }))
    expect([0, 1, 2, 3, 4, 5].every(isLevelComplete)).toBe(true)
    expect(screen.getByRole('button', { name: 'Collection · 6 of 6' })).toBeInTheDocument()
  })

  it('serif titles and the timeline as line or cards, under their old keys', () => {
    renderWith(<Timeline />)
    fireEvent.click(tab())
    choose('titles', 'serif')
    expect(localStorage.getItem('ux-archaeologist:serif-titles')).toBe('1')
    expect(document.documentElement.hasAttribute('data-serif-titles')).toBe(true)
    choose('titles', 'sans')
    expect(document.documentElement.hasAttribute('data-serif-titles')).toBe(false)
    expect(screen.getByRole('button', { name: /^Collection/ })).toBeInTheDocument()
    choose('timeline', 'cards')
    expect(localStorage.getItem('ux-archaeologist:card-timeline')).toBe('1')
    expect(screen.queryByRole('button', { name: /^Collection/ })).toBeNull()   // the card path took its place
    choose('timeline', 'line')
    expect(screen.getByRole('button', { name: /^Collection/ })).toBeInTheDocument()
  })

  it('card style and card art change the collection, under their old keys', () => {
    renderWith(<Collection />)
    const page = () => document.querySelector('h1').closest('div').parentElement
    const before = page().className
    fireEvent.click(tab())
    choose('card style', 'museum')
    expect(localStorage.getItem('ux-archaeologist:collection-style')).toBe('museum')
    expect(page().className).not.toBe(before)
    choose('card style', 'collectible')
    expect(page().className).toBe(before)
    choose('card art', 'illustrated')
    expect(localStorage.getItem('ux-archaeologist:card-art')).toBe('illustrated')
  })

  it('the labs open their pages and close the panel', () => {
    const navigate = renderWith(null)
    for (const [name, path] of [['Card lab', '/card-lab'], ['Style lab', '/style-lab'], ['Dot editor', '/dot-editor']]) {
      fireEvent.click(tab())
      fireEvent.click(within(panel()).getByRole('button', { name }))
      expect(navigate).toHaveBeenLastCalledWith(path)
      expect(panel()).toBeNull()
    }
  })

  it('the old dev lines and buttons are gone from the pages', () => {
    renderWith(<Timeline />)
    expect(screen.queryByText(/\(dev\)/)).toBeNull()
    cleanup()
    renderWith(<Collection />)
    expect(screen.queryByText(/\(dev\)/)).toBeNull()
  })

  it('is absent from the production build', async () => {
    vi.stubEnv('DEV', false)
    vi.resetModules()
    try {
      const { default: App } = await import('../App')
      render(<App />)
      await act(async () => { await new Promise(r => setTimeout(r, 0)) })
      expect(document.querySelector('[data-dev-panel]')).toBeNull()
      expect(screen.queryByRole('button', { name: /Dev panel/ })).toBeNull()
    } finally { vi.unstubAllEnvs(); vi.resetModules() }
  })
})
