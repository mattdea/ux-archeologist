// src/test/CatalogueRecord.test.jsx
//
// The catalogue record (backlog, "Levels: the catalogue record around the
// device", then "level screen fixes": every level, a toggle; experiment,
// dev setting, on by default): off changes nothing; on, the full record
// shows in the intro and the discovery and only the catalogue number while
// playing; the toggle shows and hides it in any state, holds for the visit
// and resets on the next; labels go beside the device only when there is
// room; every level has its record; the setting is absent from production;
// the stipple reveal it replaced is gone.
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import Level1 from '../levels/Level1'
import CatalogueRecord from '../shared/catalogue/CatalogueRecord'
import { placeRecord, locateParts } from '../shared/catalogue/place'
import { RECORDS } from '../shared/catalogue/records'
import { ARTIFACTS } from '../data/artifacts'
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
const MAC_RECORD = RECORDS[1]
const record = () => document.querySelector('[data-catalogue-record]')
const toggle = () => screen.getByRole('button', { name: /catalogue record/ })
const part = (name) => document.querySelector(`[data-catalogue="${name}"]`)

describe('Catalogue record (experiment)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('Audio', class { play() { return Promise.resolve() } })
    vi.useFakeTimers()
    sessionStorage.clear()
    resetAll()
  })
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

  it('the setting is on by default; off is remembered under its own key', () => {
    expect(catalogueRecordOn()).toBe(true)
    setCatalogueRecord(false)
    expect(localStorage.getItem('ux-archaeologist:catalogue-record')).toBe('0')
    expect(catalogueRecordOn()).toBe(false)
    setCatalogueRecord(true)
    expect(localStorage.getItem('ux-archaeologist:catalogue-record')).toBeNull()
  })

  it('off: no record in the intro, while playing or in the discovery', async () => {
    setCatalogueRecord(false)
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
    await renderLevel()
    expect(record().getAttribute('data-show')).toBe('full')
    expect(part('number').textContent).toBe('IA.1984.02[−]')
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

  it('the toggle beside the number: [−] hides the record, [+] shows it, a real button', () => {
    vi.stubGlobal('innerWidth', 1440); vi.stubGlobal('innerHeight', 900)
    render(<CatalogueRecord level={1} show="full" fit={{ scale: 1, left: 300, top: 80 }} width={780} height={755} screen="intro" />)
    expect(part('number').textContent).toBe('IA.1984.02[−]')
    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    expect(toggle().getAttribute('aria-label')).toBe('Hide catalogue record')
    fireEvent.click(toggle())
    expect(record().getAttribute('data-show')).toBe('number')
    expect(part('number').textContent).toBe('IA.1984.02[+]')
    expect(toggle().getAttribute('aria-label')).toBe('Show catalogue record')
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle())
    expect(record().getAttribute('data-show')).toBe('full')
  })

  it('the toggle works in every state, holds for the visit through every state, and resets on the next visit', async () => {
    vi.stubGlobal('innerWidth', 1440); vi.stubGlobal('innerHeight', 900)
    completeLevel(1)
    await renderLevel()                               // a revisit: booting, the number only
    expect(record().getAttribute('data-show')).toBe('number')
    fireEvent.click(toggle())                         // shown while booting
    expect(record().getAttribute('data-show')).toBe('full')
    act(() => { vi.advanceTimersByTime(20000) })      // playing: the choice holds
    expect(record().getAttribute('data-show')).toBe('full')
    fireEvent.click(toggle())                         // hidden while playing
    expect(record().getAttribute('data-show')).toBe('number')
    act(() => continueFn())                           // discovery: still hidden
    expect(record().getAttribute('data-show')).toBe('number')
    fireEvent.click(toggle())
    expect(record().getAttribute('data-show')).toBe('full')
    // the next visit starts from the state's default again
    cleanup()
    await renderLevel()
    expect(record().getAttribute('data-show')).toBe('number')
    act(() => { vi.advanceTimersByTime(20000) })
    act(() => continueFn())
    expect(record().getAttribute('data-show')).toBe('full')
    fireEvent.click(toggle())
    expect(record().getAttribute('data-show')).toBe('number')
  })

  it('no toggle when the number is all that fits', () => {
    vi.stubGlobal('innerWidth', 375); vi.stubGlobal('innerHeight', 812)
    render(<CatalogueRecord level={1} show="full" fit={{ scale: 0.42, left: 24, top: 452 }} width={780} height={755} screen="intro" />)
    expect(record().getAttribute('data-catalogue-record')).toBe('number')
    expect(screen.queryByRole('button', { name: /catalogue record/ })).toBeNull()
    expect(part('number').textContent).toBe('IA.1984.02')
  })

  it('every level has its record, numbered by year and room as on the cards', () => {
    ARTIFACTS.forEach((a) => {
      const r = RECORDS[a.level]
      expect(r, `level ${a.level}`).toBeTruthy()
      expect(r.number).toBe(`IA.${a.year}.0${a.level + 1}`)
      expect(r.object.length).toBeGreaterThan(0)
      expect(r.data.length).toBeGreaterThan(0)
      expect(r.parts.length).toBeGreaterThan(0)
      r.parts.forEach((p) => expect(p.find || (Number.isFinite(p.y) && Number.isFinite(p.left) && Number.isFinite(p.right))).toBeTruthy())
      // every line fits the 28-character column
      ;[...r.object, ...r.data, ...r.parts.flatMap((p) => p.lines)].forEach((l) => expect(l.length, l).toBeLessThanOrEqual(28))
    })
  })

  it('a part found by a selector lands on that element\'s edges, in device coordinates; one off the device has no label', () => {
    const scope = document.createElement('div')
    const on = document.createElement('span'); on.className = 'here'
    const off = document.createElement('span'); off.className = 'gone'
    scope.append(on, off); document.body.append(scope)
    const rect = (l, t, w, h) => () => ({ left: l, top: t, right: l + w, bottom: t + h, width: w, height: h })
    on.getBoundingClientRect = rect(400, 300, 200, 40)
    off.getBoundingClientRect = rect(3000, 300, 200, 40)
    const fit = { scale: 2, left: 100, top: 100 }
    const parts = locateParts([{ id: 'a', lines: ['A'], find: '.here' }, { id: 'b', lines: ['B'], find: '.gone' }, { id: 'c', lines: ['C'], y: 5, left: 1, right: 2 }], { scope, fit, width: 400, height: 300 })
    expect(parts.map((p) => p.id)).toEqual(['a', 'c'])
    expect(parts[0].y).toBe(110)                     // (320 - 100) / 2
    expect(parts[0].left).toBe(150); expect(parts[0].right).toBe(250)   // its edges: (400 - 100) / 2, (600 - 100) / 2
    scope.remove()
  })

  it('Level 5: the message box dot sits on the input bar\'s right edge, the leader runs outwards, and the object and data end a row above the first label', () => {
    // the chat column as Level 5 fits it at 1440 × 900 (680 wide, full height)
    const width = 680, height = 820, fit = { scale: 1, left: 380, top: 40 }
    const scope = document.createElement('div')
    const bar = document.createElement('div'); bar.className = '_inputBar_ks6ub_4'
    const input = document.createElement('input'); input.placeholder = 'How can I help you today?'
    bar.append(input); scope.append(bar); document.body.append(scope)
    const rect = (l, t, w, h) => () => ({ left: l, top: t, right: l + w, bottom: t + h, width: w, height: h })
    bar.getBoundingClientRect = rect(404, 720, 632, 96)
    input.getBoundingClientRect = rect(420, 736, 560, 24)
    const parts = locateParts(RECORDS[5].parts, { scope, fit, width, height })
    expect(parts.map((p) => p.id)).toEqual(['input'])       // no reply yet
    const l = placeRecord({ record: { ...RECORDS[5], parts }, width, height, fit, viewport: { w: 1440, h: 900 }, huds: [], cw: 7.8 })
    expect(l.mode).toBe('side'); expect(l.side).toBe('right')
    const [box] = l.labels
    expect(box.dotX).toBe(1036)                              // the bar's right edge
    expect(box.dotY).toBe(768)                               // halfway down the bar
    expect(box.x).toBeGreaterThan(box.dotX)                  // the leader runs away from the bar
    expect(l.data.y + l.data.h).toBe(box.y - 20)             // one row above the label
    expect(l.object.y).toBeGreaterThan(fit.top + height / 2) // beside the input bar, not at the top
    scope.remove()
  })

  it('Netscape: the Location leader goes round the N beside it: dot on the field\'s bottom edge, an L below the N, the N\'s label above', () => {
    // Level 2 at 1440 × 900 in the Index, in viewport px (scale 1)
    const fit = { scale: 1, left: 393, top: 179 }, width = 654, height = 542
    const scope = document.createElement('div')
    const field = document.createElement('span'); field.className = '_addressInput_x1y2z_9'
    const logo = document.createElement('img'); logo.className = '_netscapeLogo_x1y2z_9'
    scope.append(field, logo); document.body.append(scope)
    const rect = (l, t, r, b) => () => ({ left: l, top: t, right: r, bottom: b, width: r - l, height: b - t })
    field.getBoundingClientRect = rect(447, 266, 1000, 283)
    logo.getBoundingClientRect = rect(1004, 263, 1043, 302)
    const parts = locateParts(RECORDS[2].parts, { scope, fit, width, height })
    const l = placeRecord({ record: { ...RECORDS[2], parts }, width, height, fit, viewport: { w: 1440, h: 900 }, huds: [], cw: 7.8 })
    expect(l.side).toBe('right')
    const loc = l.labels.find((x) => x.id === 'location'), n = l.labels.find((x) => x.id === 'throbber')
    expect(loc.drop).toBe(true)
    expect(loc.dotY).toBe(283)                             // the field's bottom edge
    expect(loc.dotX).toBeLessThan(1004)                    // short of the N
    expect(loc.dotX).toBeGreaterThan(447)
    expect(loc.y + 10).toBeGreaterThan(302)                // runs out below the N
    expect(n.drop).toBeUndefined()
    expect(n.dotX).toBe(1043)                              // the N's own leader is straight out of its edge
    expect(n.y + n.h).toBeLessThanOrEqual(loc.y - 10)      // its label moved up, clear of Location's
    scope.remove()
  })

  it('the object and data fall back to the old order when there is no room above the first label', () => {
    // a single part near the device's top: nothing fits above its label,
    // and the device's top would overlap it, so the block goes under it
    const record = { ...MAC_RECORD, parts: [{ id: 'top', lines: ['Top', 'part'], y: 20, left: 100, right: 680 }] }
    const fit = { scale: 1, left: 300, top: 40 }
    const l = placeRecord({ record, width: 780, height: 755, cw: 7.8, huds: [], fit, viewport: { w: 1440, h: 900 } })
    const [label] = l.labels
    expect(l.object.y).toBe(label.y + label.h + 20)
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
    it('the number sits above the device, or just inside it when a HUD is there', () => {
      const fit = { scale: 1, left: 300, top: 80 }
      expect(placeRecord({ ...base, fit, viewport: { w: 1440, h: 900 } }).number.y).toBeLessThan(80)
      const l = placeRecord({ ...base, fit, viewport: { w: 1440, h: 900 }, huds: [{ x: 280, y: 40, w: 300, h: 36 }] })
      expect(l.number.y).toBeGreaterThan(80)
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
