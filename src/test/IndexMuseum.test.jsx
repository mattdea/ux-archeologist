// src/test/IndexMuseum.test.jsx
//
// The index museum behind the Classic / Index switch (backlog, "the index
// museum"): both museums render every view, a level's museum pieces swap
// presentation without losing the level's place, progress survives a
// switch, and useArtifactFit places an artifact beside a side column.
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { useState } from 'react'
import App from '../App'
import IndexMuseum from '../shared/index-museum/IndexMuseum'
import { _resetIndexSlots, setPeek, clearPeek } from '../shared/index-museum/store'
import { setMuseumStyle, museumStyle, resolveMuseumStyle } from '../shared/museumStyle'
import IntroModal from '../shared/museum/IntroModal'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import HintPill from '../shared/museum/HintPill'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import { FadeNavCtx } from '../shared/SharedLayout'
import { completeLevel, isLevelComplete, resetAll } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import { computeFit } from '../hooks/useArtifactFit'
import { setIndexLevelLayout } from '../shared/devLooks'
import { setIndexTheme } from '../shared/index-museum/theme'
import { setPictureStyle, pictureStyle } from '../shared/index-museum/pictureStyle'
import DotPicture from '../shared/index-museum/DotPicture'

// Node's built-in localStorage shadows jsdom's and doesn't store anything
// here, so progress and the switch get an in-memory stand-in.
function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const list = () => document.querySelector('[data-index-museum] nav')
const lines = () => [...list().querySelectorAll('[data-ix-nav]')].map(e => e.textContent)

function renderIndex(view, extra = {}) {
  const navigate = vi.fn()
  render(<IndexMuseum view={view} navigate={navigate} continueAction={null} hudReady={false} {...extra} />)
  return navigate
}

// A stand-in level built from the same museum pieces the real levels use
const OBJ = ['Open a thing', 'Close a thing', 'Look around']
function FakeLevel() {
  const [screen, setScreen] = useState('intro')
  const [done, setDone] = useState([])
  return (
    <>
      {screen === 'intro' && <IntroModal era="1984" title="The Desktop" description="It's 1984." objectives={OBJ} onBegin={() => setScreen('playing')} />}
      {screen === 'discovery' && <DiscoveryCard era="1984" artifactName="Direct Manipulation" description="Pictures you point at." nextUrl="/level/2" />}
      <HintPill docked text={screen === 'playing' ? 'Try the menus' : null} />
      <div data-hud><ObjectiveTracker objectives={OBJ} completedIndices={done} /></div>
      <button type="button" onClick={() => setDone(d => [...d, d.length])}>do one</button>
      <button type="button" onClick={() => setScreen('discovery')}>finish</button>
    </>
  )
}

describe('Index museum', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); resetAll(); _resetIndexSlots(); act(() => setMuseumStyle('classic')) })
  afterEach(() => { cleanup(); act(() => { setMuseumStyle('classic'); setIndexTheme('dark'); setPictureStyle('dots') }); resetAll(); vi.unstubAllGlobals() })

  it('the switch is remembered and mirrored on <html>', () => {
    act(() => setMuseumStyle('index'))
    expect(museumStyle()).toBe('index')
    expect(localStorage.getItem('ux-archaeologist:museum')).toBeNull()
    expect(document.documentElement.getAttribute('data-museum')).toBe('index')
    act(() => setMuseumStyle('classic'))
    expect(localStorage.getItem('ux-archaeologist:museum')).toBe('classic')
    expect(document.documentElement.getAttribute('data-museum')).toBe('classic')
  })

  it('the dev server defaults to the Index; production is always Classic', () => {
    expect(resolveMuseumStyle(null, true)).toBe('index')
    expect(resolveMuseumStyle('index', true)).toBe('index')
    expect(resolveMuseumStyle('classic', true)).toBe('classic')
    expect(resolveMuseumStyle(null, false)).toBe('classic')
    expect(resolveMuseumStyle('index', false)).toBe('classic')
  })

  it('App draws the classic title in Classic and the list in Index, and flips live', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Interface Artifacts' })).toBeInTheDocument()
    expect(document.querySelector('[data-index-museum]')).toBeNull()
    act(() => setMuseumStyle('index'))
    expect(document.querySelector('[data-index-museum]')).not.toBeNull()
    expect(screen.queryByRole('heading', { name: 'Interface Artifacts' })).toBeNull()
    expect(lines()[0]).toMatch(/Enter the exhibit/)
    act(() => setMuseumStyle('classic'))
    expect(document.querySelector('[data-index-museum]')).toBeNull()
  })

  it('home: the title, Enter with the count, About and Dark mode; the rooms only once Enter opens them', () => {
    completeLevel(2)
    const navigate = renderIndex('title')
    expect(list().textContent).toContain('Six computer interfaces from 1979 to 2023, working as they did.')
    ARTIFACTS.forEach(a => expect(list().textContent).not.toContain(a.title))
    const enter = screen.getByText('Enter the exhibit').closest('button')
    expect(enter.textContent).toContain('1 of 6 found')
    expect(enter.textContent).toContain('+')
    expect(enter).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(enter)
    fireEvent.click(enter)
    expect(navigate).toHaveBeenCalledWith('/timeline')
    // About opens in place and Escape closes it
    fireEvent.click(screen.getByText('About').closest('button'))
    expect(list().textContent).toContain('Built with React + Vite.')
    const about = screen.getByText('About').closest('button')
    about.focus()
    fireEvent.keyDown(about, { key: 'Escape' })
    expect(list().textContent).not.toContain('Built with React + Vite.')
  })

  it('the open timeline: the rooms under Enter, which reads − and closes it; focus on the next room', () => {
    completeLevel(0)
    const navigate = renderIndex('timeline')
    expect(list().textContent).toContain('Six computer interfaces')
    ARTIFACTS.forEach(a => expect(list().textContent).toContain(a.title))
    const enter = screen.getByText('Enter the exhibit').closest('button')
    expect(enter.textContent).toContain('−')
    expect(enter).toHaveAttribute('aria-expanded', 'true')
    expect(document.activeElement.textContent).toContain('The Desktop')
    // no Reset progress: it's in the dev panel now (Matthew's review, 12 Nov 2026)
    expect(list().textContent).not.toContain('Reset')
    fireEvent.click(enter)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('App: Enter opens the timeline with a push to /timeline, Back closes it, and /timeline loads it open', async () => {
    window.history.replaceState(null, '', '/')
    act(() => setMuseumStyle('index'))
    const { unmount } = render(<App />)
    expect(list().textContent).not.toContain('The Desktop')
    fireEvent.click(screen.getByText('Enter the exhibit').closest('button'))
    expect(window.location.pathname).toBe('/timeline')
    expect(list().textContent).toContain('The Desktop')
    // Back: the address returns to / and the timeline closes
    await act(async () => {
      window.history.back()
      await new Promise(r => window.addEventListener('popstate', r, { once: true }))
    })
    expect(window.location.pathname).toBe('/')
    expect(list().textContent).not.toContain('The Desktop')
    unmount()
    // A load of /timeline: the home page, the timeline open
    window.history.replaceState(null, '', '/timeline')
    render(<App />)
    expect(list().textContent).toContain('Enter the exhibit')
    expect(list().textContent).toContain('The Desktop')
    window.history.replaceState(null, '', '/')
  })

  it('timeline: found rooms carry the artifact, others "not found"', () => {
    completeLevel(1)
    renderIndex('timeline')
    const rows = lines()
    expect(rows.find(t => t.includes('The Desktop'))).toContain('Direct Manipulation')
    expect(rows.find(t => t.includes('The Feed'))).toContain('not found')
  })

  it('no Collection line on the home page, open or closed', () => {
    renderIndex('title')
    expect(lines().some(t => t.startsWith('Collection'))).toBe(false)
    cleanup()
    renderIndex('timeline')
    expect(lines().some(t => t.startsWith('Collection'))).toBe(false)
  })

  it('/collection lands on the open timeline in the Index only; Classic keeps its collection page', () => {
    // Index: a load of /collection
    window.history.replaceState(null, '', '/collection')
    act(() => setMuseumStyle('index'))
    const { unmount } = render(<App />)
    expect(window.location.pathname).toBe('/timeline')
    expect(list().textContent).toContain('The Desktop')
    unmount()
    // Classic: the address is left alone and its pages are unchanged
    window.history.replaceState(null, '', '/collection')
    act(() => setMuseumStyle('classic'))
    render(<App />)
    expect(window.location.pathname).toBe('/collection')
    expect(document.querySelector('[data-index-museum]')).toBeNull()
    window.history.replaceState(null, '', '/')
  })

  it('arrow keys move through the lines, Home and End jump', () => {
    renderIndex('timeline')
    const items = [...list().querySelectorAll('[data-ix-nav]')]
    items[0].focus()
    fireEvent.keyDown(items[0], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[1])
    fireEvent.keyDown(items[1], { key: 'End' })
    expect(document.activeElement).toBe(items.at(-1))
    fireEvent.keyDown(items.at(-1), { key: 'Home' })
    expect(document.activeElement).toBe(items[0])
  })

  it('a level (side layout): intro, then objectives and hint, then discovery, under the inverted room line', () => {
    setIndexLevelLayout('side')
    act(() => setMuseumStyle('index'))
    const navigate = vi.fn()
    const { rerender } = render(
      <FadeNavCtx.Provider value={navigate}>
        <IndexMuseum view="level1" navigate={navigate} continueAction={null} hudReady={false} />
        <FakeLevel />
      </FadeNavCtx.Provider>,
    )
    expect(list().getAttribute('data-hud')).toBe('side')
    expect(list().querySelector('[aria-current="page"]').textContent).toContain('The Desktop')
    expect(list().textContent).toContain("It's 1984.")
    fireEvent.click(screen.getByText('Begin excavation').closest('button'))
    expect(list().textContent).not.toContain("It's 1984.")
    // booting: nothing under the room yet; ready: the objectives and hint
    expect(list().textContent).not.toContain('Open a thing')
    const cont = vi.fn()
    rerender(
      <FadeNavCtx.Provider value={navigate}>
        <IndexMuseum view="level1" navigate={navigate} continueAction={cont} hudReady />
        <FakeLevel />
      </FadeNavCtx.Provider>,
    )
    expect(list().textContent).toContain('[ ]Open a thing')
    expect(list().textContent).toContain('[?]Try the menus')
    fireEvent.click(screen.getByText('do one'))
    expect(list().textContent).toContain('[x]Open a thing')
    fireEvent.click(screen.getByText('Continue').closest('button'))
    expect(cont).toHaveBeenCalled()
    fireEvent.click(screen.getByText('finish'))
    expect(list().textContent).toContain('Artifact Discovered')
    expect(list().textContent).toContain('Pictures you point at.')
    fireEvent.click(screen.getByText('Continue').closest('button'))
    expect(navigate).toHaveBeenCalledWith('/level/2')
  })

  it('flipping the museum mid-level keeps the level where it was', () => {
    setIndexLevelLayout('side')
    act(() => setMuseumStyle('index'))
    const navigate = vi.fn()
    render(
      <FadeNavCtx.Provider value={navigate}>
        <IndexMuseum view="level1" navigate={navigate} continueAction={null} hudReady />
        <FakeLevel />
      </FadeNavCtx.Provider>,
    )
    fireEvent.click(screen.getByText('Begin excavation').closest('button'))
    fireEvent.click(screen.getByText('do one'))
    // to Classic: the tracker card shows the same tick, no intro card
    act(() => setMuseumStyle('classic'))
    expect(screen.queryByText('Begin excavation')).toBeNull()
    expect(document.querySelectorAll('svg path').length).toBe(1)   // one drawn tick
    // and back: the same state in the list
    act(() => setMuseumStyle('index'))
    expect(list().textContent).toContain('[x]Open a thing')
    expect(list().textContent).toContain('[ ]Close a thing')
  })

  it('Dark mode: on by default, a toggle on every view, remembered and mirrored on <html>', () => {
    act(() => setIndexTheme('dark'))
    renderIndex('title')
    const dark = () => screen.getByText('Dark mode').closest('button')
    expect(dark()).toHaveAttribute('aria-pressed', 'true')
    expect(dark().textContent).toContain('[x]')
    expect(document.documentElement.getAttribute('data-index-theme')).toBe('dark')
    expect(localStorage.getItem('ux-archaeologist:index-theme')).toBeNull()
    fireEvent.click(dark())
    expect(dark()).toHaveAttribute('aria-pressed', 'false')
    expect(dark().textContent).toContain('[ ]')
    expect(document.documentElement.getAttribute('data-index-theme')).toBe('light')
    expect(localStorage.getItem('ux-archaeologist:index-theme')).toBe('light')
    cleanup()
    for (const view of ['timeline', 'level2']) {
      renderIndex(view)
      // in a level it's in the full list (≡), not the corners
      if (view === 'level2') fireEvent.click(document.querySelector('[data-corner="tl"] [aria-expanded]'))
      expect(dark()).toHaveAttribute('aria-pressed', 'false')
      cleanup()
    }
    renderIndex('timeline')
    fireEvent.click(dark())
    expect(document.documentElement.getAttribute('data-index-theme')).toBe('dark')
    expect(localStorage.getItem('ux-archaeologist:index-theme')).toBeNull()
  })

  it('Pictures: every room has a dot, a stamp and a fossil picture', () => {
    const want = {
      dots: (pic, l) => expect(pic.style.getPropertyValue('--art')).toMatch(new RegExp(`dots-${l}`)),
      stamps: (pic, l) => expect(pic.getAttribute('src')).toMatch(new RegExp(`stamps/stamp-${l}`)),
      fossils: (pic, l) => expect(pic.style.getPropertyValue('--art')).toMatch(new RegExp(`fossils/fossil-${l}`)),
    }
    const kind = { dots: 'dots', stamps: 'stamp', fossils: 'fossil' }
    for (const style of ['dots', 'stamps', 'fossils']) {
      act(() => setPictureStyle(style))
      for (const level of [0, 1, 2, 3, 4, 5]) {
        const { container } = render(<DotPicture level={level} />)
        expect(container.firstChild.getAttribute('data-picture')).toBe(kind[style])
        want[style](container.firstChild, level)
        cleanup()
      }
    }
  })

  it('Pictures: a resting picture beside the list until a room is pointed at: the arrowhead with stamps, the tablet with fossils', () => {
    const picture = () => document.querySelector('[data-index-museum] [data-peek] [data-picture]')
    act(() => setPictureStyle('stamps'))
    renderIndex('title')
    expect(picture().getAttribute('data-picture')).toBe('stamp-default')
    act(() => setPeek(2))
    expect(picture().getAttribute('src')).toMatch(/stamp-2/)
    act(() => clearPeek(2))
    expect(picture().getAttribute('data-picture')).toBe('stamp-default')
    act(() => setPictureStyle('fossils'))
    expect(picture().getAttribute('data-picture')).toBe('fossil-tablet')
    expect(picture().style.getPropertyValue('--art')).toMatch(/fossil-tablet\.webp/)
    act(() => setPeek(4))
    expect(picture().style.getPropertyValue('--art')).toMatch(/fossil-4/)
    act(() => clearPeek(4))
    // with the dots, nothing rests there
    act(() => setPictureStyle('dots'))
    expect(document.querySelector('[data-index-museum] [data-peek]')).toBeNull()
  })

  it('Pictures: no switching outside the dev server', () => {
    vi.stubEnv('DEV', false)
    try {
      act(() => setPictureStyle('fossils'))
      expect(pictureStyle()).toBe('dots')
      renderIndex('title')
      expect(document.querySelector('[data-picture="fossil-tablet"]')).toBeNull()
    } finally { vi.unstubAllEnvs() }
  })

  it('progress is the same in both museums', () => {
    completeLevel(3)
    act(() => setMuseumStyle('index'))
    renderIndex('timeline')
    expect(lines().find(t => t.includes('The Touchscreen'))).toContain('Multi-Touch')
    cleanup()
    act(() => setMuseumStyle('classic'))
    expect(isLevelComplete(3)).toBe(true)
  })

  it('useArtifactFit: beside a side column, centred in the space left', () => {
    const col = document.createElement('div')
    col.setAttribute('data-hud', 'side')
    Object.defineProperties(col, {
      offsetLeft: { value: 0 }, offsetTop: { value: 0 },
      offsetWidth: { value: 400 }, offsetHeight: { value: 900 },
    })
    document.body.appendChild(col)
    Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true })
    const fit = computeFit(780, 755)
    // free region: x 440 (400 + 40) to 1416, y 24 to 876
    expect(fit.scale).toBeCloseTo(Math.min(976 / 780, 852 / 755), 5)
    expect(fit.left + (780 * fit.scale) / 2).toBeCloseTo(440 + 976 / 2, 5)
    col.remove()
  })
})
