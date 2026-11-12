// src/test/IndexCorners.test.jsx
//
// The index museum's corners layout in a level (backlog, "Index museum: the
// device centred, the list in the corners"): each corner shows the right
// thing in each state; ≡ opens the whole list and Escape closes it; the
// years move with the arrow keys; Tab goes through the corners in reading
// order; useArtifactFit centres the device and clears the corners whatever
// they show; the dev setting brings back the side layout, and production
// always has corners.
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { useState } from 'react'
import IndexMuseum from '../shared/index-museum/IndexMuseum'
import { _resetIndexSlots } from '../shared/index-museum/store'
import { setMuseumStyle } from '../shared/museumStyle'
import IntroModal from '../shared/museum/IntroModal'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import HintPill from '../shared/museum/HintPill'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import { FadeNavCtx } from '../shared/SharedLayout'
import { resetAll } from '../state/state'
import useArtifactFit, { computeFit } from '../hooks/useArtifactFit'
import { indexLevelLayout, setIndexLevelLayout } from '../shared/devLooks'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const OBJ = ['Open a thing', 'Close a thing', 'Look around']
function FakeLevel() {
  const [screen, setScreen] = useState('intro')
  const [done, setDone] = useState([])
  return (
    <>
      {screen === 'intro' && <IntroModal era="1984" title="The Desktop" description="It's 1984." objectives={OBJ} onBegin={() => setScreen('playing')} />}
      {screen === 'discovery' && <DiscoveryCard era="1984" artifactName="Direct Manipulation" description="Pictures you point at." nextUrl="/level/2" />}
      <HintPill docked text={screen === 'playing' ? 'Try the menus' : null} />
      <div data-artifact />
      <div data-hud><ObjectiveTracker objectives={OBJ} completedIndices={done} /></div>
      <button type="button" onClick={() => setDone(d => [...d, d.length])}>do one</button>
      <button type="button" onClick={() => setScreen('discovery')}>finish</button>
    </>
  )
}

const corner = (c) => document.querySelector(`[data-corner="${c}"]`)
function renderLevel(props = {}) {
  const navigate = vi.fn()
  const view = (p) => (
    <FadeNavCtx.Provider value={navigate}>
      <IndexMuseum view="level1" navigate={navigate} continueAction={null} hudReady={false} {...p} />
      <FakeLevel />
    </FadeNavCtx.Provider>
  )
  const r = render(view(props))
  return { navigate, rerender: (p) => r.rerender(view(p)) }
}

describe('Index museum: the corners in a level', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); resetAll(); _resetIndexSlots(); act(() => setMuseumStyle('index')) })
  afterEach(() => { cleanup(); act(() => setMuseumStyle('classic')); resetAll(); vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('corners by default; the dev setting brings back the side layout; production always has corners', () => {
    expect(indexLevelLayout()).toBe('corners')
    setIndexLevelLayout('side')
    expect(indexLevelLayout()).toBe('side')
    expect(localStorage.getItem('ux-archaeologist:index-level-layout')).toBe('side')
    vi.stubEnv('DEV', false)
    expect(indexLevelLayout()).toBe('corners')
    vi.unstubAllEnvs()
    setIndexLevelLayout('corners')
    expect(localStorage.getItem('ux-archaeologist:index-level-layout')).toBeNull()
  })

  it('four corner blocks, each data-hud="corner", in reading order', () => {
    renderLevel()
    const order = [...document.querySelectorAll('[data-corner]')].map(e => e.dataset.corner)
    expect(order).toEqual(['tl', 'tr', 'bl', 'br'])
    order.forEach(c => expect(corner(c).getAttribute('data-hud')).toBe('corner'))
    // top left: the museum and the room, inverted; top right: the years, the current one inverted
    expect(corner('tl').textContent).toContain('Interface Artifacts')
    expect(corner('tl').querySelector('[aria-current="page"]').textContent).toContain('The Desktop')
    expect([...corner('tr').querySelectorAll('[data-ix-years] button')].map(b => b.textContent)).toEqual(['1979', '1984', '1995', '2007', '2016', '2023'])
    expect(corner('tr').querySelector('[aria-current="page"]').textContent).toBe('1984')
    // Dark mode is in the full list only, not the top right
    expect(corner('tr').textContent).not.toContain('Dark mode')
    // Tab follows the DOM: every control in top left comes before top right's, and so on
    const tabbable = [...document.querySelectorAll('[data-corner] button')]
    const cornerOf = (el) => el.closest('[data-corner]').dataset.corner
    const seen = tabbable.map(cornerOf)
    expect(seen).toEqual([...seen].sort((a, b) => order.indexOf(a) - order.indexOf(b)))
  })

  it('each corner shows the right thing in intro, booting, playing and discovery', () => {
    const { navigate, rerender } = renderLevel()
    // intro: the intro text bottom left, Begin one row under it in the same
    // corner (focused); the bottom right is empty
    expect(corner('bl').textContent).toContain("It's 1984.")
    const begin = screen.getByText('Begin excavation').closest('button')
    expect(corner('bl').contains(begin)).toBe(true)
    expect(corner('bl').querySelector('p').compareDocumentPosition(begin) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(document.activeElement).toBe(begin)
    expect(corner('br').textContent).toBe('')
    fireEvent.click(screen.getByText('Begin excavation').closest('button'))
    // booting: nothing to read or do yet
    expect(corner('bl').textContent).toBe('')
    expect(corner('br').textContent).toBe('')
    // playing: the objectives and the hint, the count; Continue once all are done
    const cont = vi.fn()
    rerender({ continueAction: null, hudReady: true })
    expect(corner('bl').textContent).toContain('[ ]Open a thing')
    expect(corner('bl').textContent).toContain('[?]Try the menus')
    expect(corner('br').textContent).toBe('0 of 3')
    fireEvent.click(screen.getByText('do one'))
    expect(corner('bl').textContent).toContain('[x]Open a thing')
    expect(corner('br').textContent).toBe('1 of 3')
    rerender({ continueAction: cont, hudReady: true })
    fireEvent.click(screen.getByText('Continue').closest('button'))
    expect(cont).toHaveBeenCalled()
    // the room's picture comes only with the discovery
    expect(document.querySelector('[data-ix-find]')).toBeNull()
    // discovery: the discovery text and the room's picture in the band along
    // the bottom, Continue to the next room (jsdom lays nothing out: give the
    // text a height, which the picture takes)
    const h = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () { return this.hasAttribute('data-ix-band-text') ? 120 : 0 })
    fireEvent.click(screen.getByText('finish'))
    const band = corner('bl').querySelector('[data-ix-band]')
    expect(band).not.toBeNull()
    expect(band.hasAttribute('data-hud')).toBe(false)               // never moves the device
    const pic = band.querySelector('[data-ix-find]')
    expect(pic.querySelector('[data-picture]')).not.toBeNull()
    expect(pic.style.height).toBe('120px')                          // as tall as the text
    expect(pic.style.width).toBe(`${Math.round(120 * 400 / 340)}px`)
    expect(pic.compareDocumentPosition(band.querySelector('[data-ix-band-text]')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()  // the picture at the band's left
    h.mockRestore()
    expect(band.textContent).toContain('Artifact Discovered')
    expect(band.textContent).toContain('Pictures you point at.')
    expect(corner('br').textContent).toContain('1995 The Hyperlink')
    // one link: on hover the whole line lights, its right side underlined too
    expect(screen.getByText('Continue').closest('button').className).toMatch(/whole/)
    const css = readFileSync(resolve(__dirname, '../shared/index-museum/IndexMuseum.module.css'), 'utf8')
    expect(css).toMatch(/\.whole:hover \.meta \{ color: inherit; text-decoration: underline;/)
    expect(css).toMatch(/\.whole:hover \.leader \{ border-bottom-color: currentColor; \}/)
    fireEvent.click(screen.getByText('Continue').closest('button'))
    expect(navigate).toHaveBeenCalledWith('/level/2')
  })

  it('≡ opens the whole list over the page; Escape closes it and focus goes back', () => {
    const { navigate } = renderLevel()
    const menu = corner('tl').querySelector('[aria-expanded]')
    expect(menu.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(menu)
    const panel = document.querySelector('[data-ix-panel]')
    expect(panel).not.toBeNull()
    expect(panel.getAttribute('data-hud')).toBeNull()            // over the page, never moves the device
    expect(panel.textContent).toContain('1979The Command Line')
    expect(panel.textContent).toContain('Back to timeline')
    expect(panel.textContent).toContain('Dark mode')
    expect(panel.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(document.querySelector('[data-ix-panel]')).toBeNull()
    expect(document.activeElement).toBe(menu)
    // and a pointer down outside closes it too
    fireEvent.click(menu)
    fireEvent.pointerDown(document.body)
    expect(document.querySelector('[data-ix-panel]')).toBeNull()
    // a room from the list goes there
    fireEvent.click(menu)
    fireEvent.click([...document.querySelectorAll('[data-ix-panel] [data-ix-nav]')].find(b => b.textContent.includes('The Feed')))
    expect(navigate).toHaveBeenCalledWith('/level/4')
  })

  it('the years row: left and right move between rooms; a year goes to its room', () => {
    const { navigate } = renderLevel()
    const years = [...corner('tr').querySelectorAll('[data-ix-years] button')]
    years[1].focus()
    fireEvent.keyDown(years[1], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(years[2])
    fireEvent.keyDown(years[2], { key: 'ArrowLeft' })
    fireEvent.keyDown(years[1], { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(years[0])
    fireEvent.click(years[3])
    expect(navigate).toHaveBeenCalledWith('/level/3')
  })

  describe('useArtifactFit with corners', () => {
    const boxes = []
    const box = (left, top, w, h) => {
      const el = document.createElement('div')
      el.setAttribute('data-hud', 'corner')
      Object.defineProperties(el, { offsetLeft: { value: left }, offsetTop: { value: top }, offsetWidth: { value: w }, offsetHeight: { value: h } })
      document.body.appendChild(el); boxes.push(el)
    }
    const size = (W, H) => {
      Object.defineProperty(window, 'innerWidth', { value: W, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: H, configurable: true })
    }
    afterEach(() => { boxes.splice(0).forEach(b => b.remove()) })
    const hit = (f, w, h, [l, t, bw, bh]) => f.left < l + bw && f.left + w * f.scale > l && f.top < t + bh && f.top + h * f.scale > t

    it.each([[1920, 1080], [1440, 900], [1280, 800], [1024, 768]])('centred and clear of the corners at %i × %i', (W, H) => {
      size(W, H)
      const corners = [[24, 20, 266, 40], [W - 290, 20, 266, 40], [24, H - 290, 329, 260], [W - 290, H - 290, 266, 260]]
      corners.forEach(c => box(...c))
      const f = computeFit(780, 755)
      expect(f.left + (780 * f.scale) / 2).toBeCloseTo(W / 2, 5)
      expect(f.top + (755 * f.scale) / 2).toBeCloseTo(H / 2, 5)
      expect(f.scale).toBeGreaterThan(0.3)
      corners.forEach(c => expect(hit(f, 780, 755, c)).toBe(false))
    })
  })

  it('the full list over the page is only as tall as its contents, with no border, rule or shadow', () => {
    const css = readFileSync(resolve(__dirname, '../shared/index-museum/IndexMuseum.module.css'), 'utf8')
    const panel = css.match(/\n\.panel \{([^}]*)\}/)[1]
    expect(panel).not.toMatch(/bottom:/)
    expect(panel).not.toMatch(/border(?!-box)|box-shadow|outline/)
    expect(panel).toMatch(/background: var\(--ix-paper\)/)
  })

  describe('the discovery band', () => {
    // jsdom lays nothing out: put each corner where it is at 1440 × 900
    const W = 1440, H = 900
    const CORNERS = { tl: [24, 20, 266, 40], tr: [W - 290, 20, 266, 20], bl: [24, H - 290, 266, 260], br: [W - 290, H - 290, 266, 260] }
    // the band: wide, low, and taller than the corner's text
    const BAND = [24, H - 300, 1000, 270]
    const at = (el, i) => { const c = el.getAttribute?.('data-corner'); return c ? CORNERS[c][i] : el.hasAttribute?.('data-ix-band') ? BAND[i] : 0 }
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: W, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: H, configurable: true })
      ;['offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight'].forEach((k, i) => vi.spyOn(HTMLElement.prototype, k, 'get').mockImplementation(function () { return at(this, i) }))
    })
    afterEach(() => vi.restoreAllMocks())

    function Device() {
      useArtifactFit(780, 755)
      return null
    }
    const deviceBox = () => ['left', 'top', 'width', 'height'].map(k => document.documentElement.style.getPropertyValue(`--artifact-${k}`))

    it("the device's box is the same in playing and discovery", () => {
      const navigate = vi.fn()
      const view = (p) => (
        <FadeNavCtx.Provider value={navigate}>
          <IndexMuseum view="level1" navigate={navigate} continueAction={null} hudReady {...p} />
          <FakeLevel />
          <Device />
        </FadeNavCtx.Provider>
      )
      render(view())
      fireEvent.click(screen.getByText('Begin excavation').closest('button'))
      act(() => { window.dispatchEvent(new Event('resize')) })
      const playing = deviceBox()
      expect(Number.parseFloat(playing[2])).toBeGreaterThan(300)
      fireEvent.click(screen.getByText('finish'))
      expect(corner('bl').querySelector('[data-ix-band]')).not.toBeNull()
      act(() => { window.dispatchEvent(new Event('resize')) })
      expect(deviceBox()).toEqual(playing)
    })

    it('the device is under a fade in intro and discovery, and not while booting or playing', () => {
      const root = document.documentElement.style
      Object.entries({ left: 375, top: 134, width: 690, height: 632 }).forEach(([k, v]) => root.setProperty(`--artifact-${k}`, `${v}px`))
      const { rerender } = renderLevel()
      const fade = () => document.querySelector('[data-ix-fade]')
      expect(fade().getAttribute('data-ix-fade')).toBe('on')          // intro
      fireEvent.click(screen.getByText('Begin excavation').closest('button'))
      expect(fade()?.getAttribute('data-ix-fade') ?? 'off').toBe('off')  // booting: lifts as the boot starts
      rerender({ continueAction: null, hudReady: true })
      expect(fade()?.getAttribute('data-ix-fade') ?? 'off').toBe('off')  // playing
      fireEvent.click(screen.getByText('finish'))
      expect(fade().getAttribute('data-ix-fade')).toBe('on')
      expect(fade().parentElement.hasAttribute('data-artifact')).toBe(true)   // in the level's stacking context, under the catalogue record
      expect(fade().hasAttribute('data-hud')).toBe(false)          // never moves the device
      expect(fade().style.left).toBe('calc(var(--artifact-left, 375px) - var(--ix-fade-bleed))')  // the device's box, read live, and past it
      expect(fade().style.width).toBe('calc(var(--artifact-width, 690px) + 2 * var(--ix-fade-bleed))')
      expect(corner('bl').querySelector('[data-ix-band]')).not.toBeNull()   // the band stays a band
      ;['left', 'top', 'width', 'height'].forEach(k => root.removeProperty(`--artifact-${k}`))
    })

    it('the fade: the page colour, partly see-through, a light blur, between the device and the record; at once under reduced motion', () => {
      const css = readFileSync(resolve(__dirname, '../shared/index-museum/IndexMuseum.module.css'), 'utf8')
      const fade = css.match(/\n\.fade \{([^}]*)\}/)[1]
      expect(fade).toMatch(/color-mix\(in srgb, var\(--ix-room[^)]*\) var\(--ix-fade-strength\), transparent\)/)
      expect(fade).toMatch(/backdrop-filter: blur\(var\(--ix-fade-blur\)\)/)
      // far enough past the device that its edge blurs out instead of stopping at a line
      expect(fade).toMatch(/--ix-fade-bleed: calc\(var\(--ix-fade-blur\) \* 4\)/)
      expect(fade).toMatch(/z-index: 2;/)
      expect(fade).toMatch(/transition: opacity 400ms/)
      const record = readFileSync(resolve(__dirname, '../shared/catalogue/CatalogueRecord.module.css'), 'utf8')
      expect(Number(record.match(/\.record \{[^}]*z-index: (\d+)/)[1])).toBeGreaterThan(2)
      expect(css).toMatch(/prefers-reduced-motion[^}]*\}\s*\.fade, \.fadeOn \{ transition: none; \}/)
      expect(css).not.toMatch(/tray/i)
    })
  })
})
