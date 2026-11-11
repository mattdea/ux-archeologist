// src/test/StippleReveal.test.jsx
//
// The stipple reveal on Level 1 (backlog, "Levels: the device as a drawing
// when you arrive and leave"; experiment, dev setting): off changes
// nothing; on, the Mac is a drawing in the intro and the discovery and not
// while playing; the boot waits for the drawing to dissolve; a revisit
// starts from the drawing; the setting and the drawing are absent from the
// production build. (jsdom loads no images, so the drawing never paints
// here and the fallback timer ends the dissolve.)
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import Level1 from '../levels/Level1'
import StippleReveal, { REVEAL_MS } from '../shared/reveal/StippleReveal'
import { HudCtx, ContinueCtx } from '../shared/SharedLayout'
import { stippleRevealOn, setStippleReveal } from '../shared/devLooks'
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
// Level 1 loads the reveal lazily (dev only); wait for it to mount
async function renderLevel() {
  continueFn = null
  const r = render(
    <HudCtx.Provider value={() => {}}>
      <ContinueCtx.Provider value={(f) => { continueFn = typeof f === 'function' ? f() : f }}>
        <Level1 />
      </ContinueCtx.Provider>
    </HudCtx.Provider>
  )
  await act(async () => { await import('../shared/reveal/StippleReveal'); await Promise.resolve() })
  return r
}
const drawing = () => document.querySelector('canvas[data-reveal-state]')
const revealState = () => drawing()?.getAttribute('data-reveal-state')
const booting = () => !!document.querySelector('[class*="boot"]')
const begin = () => fireEvent.click(screen.getByRole('button', { name: /Begin excavation/i }))

describe('Stipple reveal (Level 1, experiment)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('Audio', class { play() { return Promise.resolve() } })
    vi.useFakeTimers()
    sessionStorage.clear()
    resetAll()
  })
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

  it('the setting is off by default and remembered under its own key', () => {
    expect(stippleRevealOn()).toBe(false)
    setStippleReveal(true)
    expect(localStorage.getItem('ux-archaeologist:stipple-reveal')).toBe('1')
    expect(stippleRevealOn()).toBe(true)
    setStippleReveal(false)
    expect(localStorage.getItem('ux-archaeologist:stipple-reveal')).toBeNull()
  })

  it('off: no drawing, and Begin excavation boots straight away as before', async () => {
    await renderLevel()
    expect(drawing()).toBeNull()
    begin()
    expect(drawing()).toBeNull()
    expect(booting()).toBe(true)
  })

  it('on: a drawing in the intro, dissolving before the boot, gone while playing', async () => {
    setStippleReveal(true)
    await renderLevel()
    expect(revealState()).toBe('drawn')
    begin()
    expect(revealState()).toBe('reveal')
    expect(booting()).toBe(false)                 // the boot waits for the drawing
    act(() => { vi.advanceTimersByTime(REVEAL_MS + 1600) })
    expect(revealState()).toBe('clear')
    expect(booting()).toBe(true)
  })

  it('on: a revisit starts from the drawing, and Continue settles it back for the discovery', async () => {
    setStippleReveal(true)
    completeLevel(1)
    await renderLevel()
    expect(revealState()).toBe('reveal')
    expect(booting()).toBe(false)
    act(() => { vi.advanceTimersByTime(REVEAL_MS + 1600) })
    expect(revealState()).toBe('clear')
    act(() => { vi.advanceTimersByTime(20000) })   // the boot plays through
    expect(continueFn).toBeTypeOf('function')
    act(() => continueFn())
    expect(revealState()).toBe('settle')
    expect(screen.getByText(/Artifact Discovered/i)).toBeInTheDocument()
  })

  it('never takes clicks', async () => {
    setStippleReveal(true)
    await renderLevel()
    expect(drawing().className).toMatch(/reveal/)
    expect(drawing().getAttribute('aria-hidden')).toBe('true')
  })

  it('is absent from the production build: no setting, no drawing', () => {
    vi.stubEnv('DEV', false)
    try {
      localStorage.setItem('ux-archaeologist:stipple-reveal', '1')
      expect(stippleRevealOn()).toBe(false)
      const { container } = render(<StippleReveal level={1} width={780} height={755} state="drawn" />)
      expect(container.innerHTML).toBe('')
    } finally { vi.unstubAllEnvs() }
  })
})
