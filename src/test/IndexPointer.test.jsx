// src/test/IndexPointer.test.jsx
//
// The index museum's pointer (backlog, "Index museum: a flint arrowhead as
// the museum's pointer"): the arrowhead by default, the fossil stick by the
// dev panel's switch, remembered and mirrored on <html>; the drawings' tip
// is their top-left pixel and the hotspot; every file is drawn; the styles
// apply only in the Index, never inside a device, and keep no hand on links;
// and every level marks its device.
import { render, screen, fireEvent, act, cleanup, within } from '@testing-library/react'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import DevPanel from '../shared/dev/DevPanel'
import { FadeNavCtx } from '../shared/SharedLayout'
import { setMuseumStyle } from '../shared/museumStyle'
import { museumPointer, setMuseumPointer } from '../shared/index-museum/pointer'
import { DRAWINGS, render as draw } from '../../scripts/index-pointers.mjs'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const here = (p) => resolve(__dirname, p)
const pngSize = (file) => { const b = readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)] }

describe('Index museum pointer', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()) })
  afterEach(() => { cleanup(); act(() => { setMuseumPointer('arrowhead'); setMuseumStyle('classic') }); vi.unstubAllGlobals() })

  it('is the arrowhead by default; the dev panel switches to the stick and back, remembered and on <html>', () => {
    expect(museumPointer()).toBe('arrowhead')
    expect(document.documentElement.getAttribute('data-ix-pointer')).toBe('arrowhead')
    act(() => setMuseumStyle('index'))
    render(<FadeNavCtx.Provider value={vi.fn()}><DevPanel navigate={vi.fn()} /></FadeNavCtx.Provider>)
    fireEvent.click(screen.getByRole('button', { name: /Dev panel/ }))
    const group = within(screen.getByRole('dialog', { name: 'Dev panel' })).getByRole('group', { name: 'pointer' })
    fireEvent.click(within(group).getByRole('button', { name: 'stick' }))
    expect(museumPointer()).toBe('stick')
    expect(localStorage.getItem('ux-archaeologist:index-pointer')).toBe('stick')
    expect(document.documentElement.getAttribute('data-ix-pointer')).toBe('stick')
    fireEvent.click(within(group).getByRole('button', { name: 'arrowhead' }))
    expect(localStorage.getItem('ux-archaeologist:index-pointer')).toBeNull()
    expect(document.documentElement.getAttribute('data-ix-pointer')).toBe('arrowhead')
  })

  it('the pointer line is only there in the Index', () => {
    render(<FadeNavCtx.Provider value={vi.fn()}><DevPanel navigate={vi.fn()} /></FadeNavCtx.Provider>)
    fireEvent.click(screen.getByRole('button', { name: /Dev panel/ }))
    expect(within(screen.getByRole('dialog', { name: 'Dev panel' })).queryByRole('group', { name: 'pointer' })).toBeNull()
  })

  it('drawings: the tip is the top-left pixel, nothing above or left of it; arrowhead 20px tall, stick about 28px long', () => {
    for (const [name, rows] of Object.entries(DRAWINGS)) {
      expect(rows[0][0], name).toBe('#')
      expect(rows[0].trim(), name).toBe('#')                       // the tip row is the tip alone
      // the rim puts the tip at (1, 1): the hotspot in pointers.css
      const g = draw(rows, 1)
      expect(g[1][1], name).toBe(1)
      expect(g[0].every((c) => c !== 1) && g.every((r) => r[0] !== 1), name).toBe(true)
    }
    expect(DRAWINGS.arrowhead.length).toBe(20)
    const s = DRAWINGS.stick
    const end = s.length - 1, endX = s[end].search(/\S/) + 1
    expect(Math.hypot(endX, end)).toBeGreaterThan(26)
    expect(Math.hypot(endX, end)).toBeLessThan(31)
  })

  it('every pointer file is there, the 2x exactly twice the 1x', () => {
    const dir = here('../../assets/pointers')
    const files = readdirSync(dir)
    for (const name of Object.keys(DRAWINGS)) for (const theme of ['light', 'dark']) {
      expect(files).toContain(`${name}-${theme}.png`)
      expect(files).toContain(`${name}-${theme}@2x.png`)
      const [w, h] = pngSize(resolve(dir, `${name}-${theme}.png`))
      const g = draw(DRAWINGS[name], 1)
      expect([w, h]).toEqual([g[0].length, g.length])
      expect(pngSize(resolve(dir, `${name}-${theme}@2x.png`))).toEqual([w * 2, h * 2])
    }
  })

  it('styles: Index only, hotspot at the tip, a 1x fallback and auto, no hand on links, the device left alone', () => {
    const css = readFileSync(here('../shared/index-museum/pointers.css'), 'utf8')
    const stick = readFileSync(here('../shared/index-museum/pointers-stick.css'), 'utf8')
    const rules = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').split('}').filter((r) => r.includes('{'))
    for (const r of [...rules(css), ...rules(stick)]) expect(r.split('{')[0]).toContain('html[data-museum="index"]')
    for (const text of [css, stick]) {
      const values = text.match(/cursor: [^;]+;/g).filter((v) => v.includes('url('))
      expect(values.length % 3).toBe(0)
      values.forEach((v) => expect(v).toMatch(/\) 1 1, auto;$/))
    }
    expect(css).toMatch(/:is\(button, a[^)]*\):not\(\[data-artifact\] \*\)[\s\S]*?cursor: inherit/)
    expect(css).toMatch(/:where\(html\[data-museum="index"\] \[data-artifact\]\) \{\s*cursor: auto;/)
    // the index museum's own CSS has no hand left
    expect(readFileSync(here('../shared/index-museum/IndexMuseum.module.css'), 'utf8')).not.toMatch(/cursor: pointer/)
  })

  it('every level marks the box its device occupies', () => {
    for (let n = 0; n <= 5; n++) {
      expect(readFileSync(here(`../levels/Level${n}.jsx`), 'utf8'), `Level${n}`).toMatch(/^\s+data-artifact$/m)
    }
  })
})
