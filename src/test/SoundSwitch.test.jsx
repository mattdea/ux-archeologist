// src/test/SoundSwitch.test.jsx
//
// The museum's sound switch (backlog, "Fixes: leaving during a boot, a
// sound switch, the record over the discovery text", item 2): one setting,
// remembered per browser, on by default, read by every sound.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

const KEY = 'ux-archaeologist:sound'

// Node's built-in localStorage shadows jsdom's and doesn't store anything
function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}
beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
afterEach(() => vi.unstubAllGlobals())

// A stand-in AudioContext that counts the oscillators started on it
function fakeAudioContext() {
  const started = []
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} })
  const node = () => ({ connect(n) { return n ?? this }, disconnect() {}, gain: param(), frequency: param(), Q: param() })
  class AC {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = node(); this.sampleRate = 44100 }
    resume() { return Promise.resolve() }
    createGain() { return node() }
    createBiquadFilter() { return node() }
    createOscillator() { const o = { ...node(), start: () => started.push(o), stop() {} }; return o }
    createBuffer() { return { getChannelData: () => new Float32Array(1) } }
    createBufferSource() { const b = { ...node(), start: () => started.push(b), stop() {} }; return b }
  }
  return { AC, started }
}

function fakeAudio() {
  const made = []
  const Real = window.Audio
  window.Audio = vi.fn(function Audio(src) {
    const a = { src, volume: 1, play: vi.fn(() => Promise.resolve()), pause: vi.fn() }
    made.push(a)
    return a
  })
  made.restore = () => { window.Audio = Real }
  return made
}

// A fresh copy of the modules, as after a reload
async function load() {
  vi.resetModules()
  const sound = await import('../audio/sound')
  const sfx = await import('../audio/sfx')
  return { sound, sfx }
}

describe('the sound setting', () => {

  it('is on by default and survives a reload', async () => {
    let { sound } = await load()
    expect(sound.soundOn()).toBe(true)
    sound.setSoundOn(false)
    ;({ sound } = await load())
    expect(sound.soundOn()).toBe(false)
    sound.setSoundOn(true)
    ;({ sound } = await load())
    expect(sound.soundOn()).toBe(true)
  })

  it('with sound off, nothing plays: synthesised, recorded or the dial-up', async () => {
    const { AC, started } = fakeAudioContext()
    vi.stubGlobal('AudioContext', AC)
    const made = fakeAudio()
    try {
      const { sound, sfx } = await load()
      sfx.bell()
      expect(started.length).toBeGreaterThan(0)   // the stand-in works
      started.length = 0
      sound.setSoundOn(false)
      sfx.key(); sfx.bell(); sfx.startupBeep(); sfx.beep(); sfx.pop(); sfx.send(); sfx.receive()
      sfx.dialup(); sfx.file('unlock.mp3')
      expect(started.length).toBe(0)
      expect(made.filter(a => a.play.mock.calls.length).length).toBe(0)
    } finally { made.restore() }
  })

  it('turning it off stops what is already playing', async () => {
    const made = fakeAudio()
    try {
      const { sound, sfx } = await load()
      sfx.dialup()
      sfx.file('lock.mp3')
      sound.setSoundOn(false)
      expect(made.length).toBe(2)
      made.forEach(a => expect(a.pause).toHaveBeenCalled())
    } finally { made.restore() }
  })

  it('with sound off the Mac stays silent but does not flash its menu bar', async () => {
    const { AC } = fakeAudioContext()
    vi.stubGlobal('AudioContext', AC)
    const { sound, sfx } = await load()
    const flash = vi.fn()
    window.addEventListener('mac-flash-menubar', flash)
    sound.setSoundOn(false)
    sfx.setMacVolume(3)
    sfx.beep()
    expect(flash).not.toHaveBeenCalled()
    window.removeEventListener('mac-flash-menubar', flash)
  })
})

describe('the switch', () => {
  afterEach(async () => {
    cleanup()
    const { setMuseumStyle } = await import('../shared/museumStyle')
    act(() => setMuseumStyle('classic'))
  })

  it('Index: a Sound line under Dark mode, a toggle with aria-pressed', async () => {
    vi.resetModules()
    const { setMuseumStyle } = await import('../shared/museumStyle')
    const { soundOn } = await import('../audio/sound')
    const { default: App } = await import('../App')
    act(() => setMuseumStyle('index'))
    render(<App />)
    const btn = () => screen.getByRole('button', { name: 'Sound' })
    expect(btn()).toHaveAttribute('aria-pressed', 'true')
    expect(btn().textContent).toContain('[x]')
    // It sits right after Dark mode
    const lines = [...document.querySelectorAll('[data-ix-nav]')]
    expect(lines.indexOf(btn())).toBe(lines.indexOf(screen.getByRole('button', { name: 'Dark mode' })) + 1)
    fireEvent.click(btn())
    expect(btn()).toHaveAttribute('aria-pressed', 'false')
    expect(btn().textContent).toContain('[ ]')
    expect(soundOn()).toBe(false)
  })

  it('Classic: "Sound on" / "Sound off" beside Back to timeline and on the timeline page', async () => {
    vi.resetModules()
    const { setMuseumStyle } = await import('../shared/museumStyle')
    const { soundOn } = await import('../audio/sound')
    const { default: Timeline } = await import('../pages/Timeline')
    const { default: SharedLayout } = await import('../shared/SharedLayout')
    act(() => setMuseumStyle('classic'))
    render(<SharedLayout><Timeline /></SharedLayout>)
    const btn = () => screen.getByRole('button', { name: 'Sound' })
    expect(btn()).toHaveAttribute('aria-pressed', 'true')
    expect(btn()).toHaveTextContent('Sound on')
    fireEvent.click(btn())
    expect(btn()).toHaveTextContent('Sound off')
    expect(btn()).toHaveAttribute('aria-pressed', 'false')
    expect(soundOn()).toBe(false)
  })

  it('Classic: in a level, the switch sits beside Back to timeline', async () => {
    vi.resetModules()
    const { setMuseumStyle } = await import('../shared/museumStyle')
    const layout = await import('../shared/SharedLayout')
    act(() => setMuseumStyle('classic'))
    let go
    function Probe() { go = layout.useFadeNavigate(); return <span data-testid="probe" /> }
    render(<layout.default><Probe /></layout.default>)
    act(() => { go('/level/0') })
    const ev = new Event('transitionend', { bubbles: true })
    Object.defineProperty(ev, 'propertyName', { value: 'opacity' })
    act(() => { screen.getByTestId('probe').parentElement.dispatchEvent(ev) })
    await act(async () => { await new Promise(r => setTimeout(r, 700)) })
    const back = screen.getByText('← Back to timeline')
    const btn = screen.getByRole('button', { name: 'Sound' })
    expect(btn.parentElement).toBe(back.parentElement)
    expect(btn).toHaveTextContent('Sound on')
  })
})
