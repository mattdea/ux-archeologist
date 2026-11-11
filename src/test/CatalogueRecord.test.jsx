// src/test/CatalogueRecord.test.jsx
//
// The catalogue record on Level 1 (backlog, "Levels: the catalogue record
// around the device"; experiment, dev setting): off changes nothing; on,
// the full record shows in the intro and the discovery and only the
// catalogue number while playing; labels go beside the device only when
// there is room; the setting is absent from production; the stipple
// reveal it replaces is gone.
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import Level1 from '../levels/Level1'
import CatalogueRecord, { MAC_RECORD, placeRecord } from '../shared/catalogue/CatalogueRecord'
import { HudCtx, ContinueCtx } from '../shared/SharedLayout'
import { catalogueRecordOn, setCatalogueRecord } from '../shared/devLooks'
import { completeLevel, resetAll } from '../state/state'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

let continueFn = null
// Level 1 loads the record lazily (dev only); wait for it to mount
async function renderLevel() {
  continueFn = null
  const r = render(
    <HudCtx.Provider value={() => {}}>
      <ContinueCtx.Provider value={(f) => { continueFn = typeof f === 'function' ? f() : f }}>
        <Level1 />
      </ContinueCtx.Provider>
    </HudCtx.Provider>
  )
  await act(async () => { await import('../shared/catalogue/CatalogueRecord'); await Promise.resolve() })
  return r
}
const record = () => document.querySelector('[data-catalogue-record]')
const part = (name) => document.querySelector(`[data-catalogue="${name}"]`)

describe('Catalogue record (Level 1, experiment)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('Audio', class { play() { return Promise.resolve() } })
    vi.useFakeTimers()
    sessionStorage.clear()
    resetAll()
  })
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

  it('the setting is off by default and remembered under its own key', () => {
    expect(catalogueRecordOn()).toBe(false)
    setCatalogueRecord(true)
    expect(localStorage.getItem('ux-archaeologist:catalogue-record')).toBe('1')
    expect(catalogueRecordOn()).toBe(true)
    setCatalogueRecord(false)
    expect(localStorage.getItem('ux-archaeologist:catalogue-record')).toBeNull()
  })

  it('off: no record in the intro, while playing or in the discovery', async () => {
    completeLevel(1)
    await renderLevel()
    expect(record()).toBeNull()
    act(() => { vi.advanceTimersByTime(20000) })
    expect(record()).toBeNull()
    act(() => continueFn())
    expect(record()).toBeNull()
  })

  it('on: the full record in the intro, only the number while playing, the full record in the discovery', async () => {
    // a window with room beside the device
    vi.stubGlobal('innerWidth', 1440); vi.stubGlobal('innerHeight', 900)
    setCatalogueRecord(true)
    await renderLevel()
    expect(record().getAttribute('data-show')).toBe('full')
    expect(part('number').textContent).toBe('IA.1984.02')
    expect(screen.getByText('Apple Macintosh (128K), 1984')).toBeInTheDocument()
    expect(screen.getByText('$2,495')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Begin excavation/i }))
    expect(record().getAttribute('data-show')).toBe('number')
    act(() => { vi.advanceTimersByTime(20000) })   // the boot plays through
    expect(record().getAttribute('data-show')).toBe('number')
    expect(part('number').className).toMatch(/numberSmall/)
    expect(part('object').parentElement.className).not.toMatch(/\bon\b|_on_/)
    act(() => completeLevel(1))
    {
      cleanup()
      await renderLevel()
      act(() => { vi.advanceTimersByTime(20000) })
      act(() => continueFn())
      expect(record().getAttribute('data-show')).toBe('full')
      expect(part('object').parentElement.className).toMatch(/_on_|\bon\b/)
    }
  })

  it('never takes clicks and is hidden from screen readers', () => {
    render(<CatalogueRecord show="full" fit={{ scale: 1, left: 300, top: 80 }} width={780} height={755} screen="intro" />)
    expect(record().className).toMatch(/record/)
    expect(record().getAttribute('aria-hidden')).toBe('true')
  })

  describe('placement', () => {
    const base = { record: MAC_RECORD, width: 780, height: 755, cw: 7.8, huds: [] }
    it('labels beside the device when a column fits, with dots on the screen and the floppy slot', () => {
      const fit = { scale: 0.97, left: 342, top: 84 }
      const l = placeRecord({ ...base, fit, viewport: { w: 1440, h: 900 } })
      expect(l.mode).toBe('side')
      const [scr, flop] = l.labels
      const nat = (d) => [(d.dotX - fit.left) / fit.scale, (d.dotY - fit.top) / fit.scale]
      const [sx, sy] = nat(scr); expect(sx).toBeGreaterThan(80); expect(sx).toBeLessThan(700); expect(sy).toBeGreaterThan(149); expect(sy).toBeLessThan(564)
      const [fx, fy] = nat(flop); expect(fx).toBeGreaterThan(411); expect(fx).toBeLessThan(607); expect(fy).toBeGreaterThan(674); expect(fy).toBeLessThan(686)
    })
    it('never over a HUD block: a HUD beside the device pushes the labels to the other side', () => {
      const fit = { scale: 0.97, left: 342, top: 84 }
      const l = placeRecord({ ...base, fit, viewport: { w: 1440, h: 900 }, huds: [{ x: 1110, y: 0, w: 330, h: 900 }] })
      expect(l.mode).toBe('side')
      expect(l.side).toBe('left')
    })
    it('no room beside it: no labels, the object line and data under the device if they fit', () => {
      const under = placeRecord({ ...base, fit: { scale: 0.42, left: 24, top: 60 }, viewport: { w: 375, h: 812 } })
      expect(under.mode).toBe('under')
      expect(under.labels).toEqual([])
      const none = placeRecord({ ...base, fit: { scale: 0.42, left: 24, top: 452 }, viewport: { w: 375, h: 812 } })
      expect(none.mode).toBe('number')
    })
  })

  it('is absent from the production build: no setting, no record', async () => {
    vi.stubEnv('DEV', false)
    try {
      localStorage.setItem('ux-archaeologist:catalogue-record', '1')
      expect(catalogueRecordOn()).toBe(false)
    } finally { vi.unstubAllEnvs() }
  })

  it('the stipple reveal is gone; its frames stay in docs/reveal', () => {
    const root = resolve(__dirname, '../..')
    for (const p of ['src/shared/reveal', 'scripts/reveal-drawing.mjs', 'scripts/reveal-shots.mjs', 'assets/reveal']) {
      expect(existsSync(resolve(root, p))).toBe(false)
    }
    expect(existsSync(resolve(root, 'docs/reveal'))).toBe(true)
  })
})
