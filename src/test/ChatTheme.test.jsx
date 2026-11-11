// src/test/ChatTheme.test.jsx
//
// Level 5's chat in light mode (backlog, "Level 5: a light version in light
// mode"): light only in the Index museum's light mode, dark as designed in
// Classic and in the Index's dark mode, and it follows the switches live.
import { render, act, cleanup } from '@testing-library/react'
import Level5 from '../levels/Level5'
import { HudCtx, ContinueCtx } from '../shared/SharedLayout'
import { setMuseumStyle } from '../shared/museumStyle'
import { setIndexTheme } from '../shared/index-museum/theme'

function memoryStorage() {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  }
}

const theme = () => document.querySelector('[data-chat-theme]')?.getAttribute('data-chat-theme')

describe('Level 5 chat theme', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()) })
  afterEach(() => { cleanup(); act(() => { setMuseumStyle('classic'); setIndexTheme('dark') }); vi.unstubAllGlobals() })

  it('is light only in the Index museum in light mode', () => {
    render(
      <HudCtx.Provider value={() => {}}>
        <ContinueCtx.Provider value={() => {}}>
          <Level5 />
        </ContinueCtx.Provider>
      </HudCtx.Provider>
    )
    expect(theme()).toBe('dark')                 // Classic
    act(() => setIndexTheme('light'))
    expect(theme()).toBe('dark')                 // Classic ignores the Index's theme
    act(() => setMuseumStyle('index'))
    expect(theme()).toBe('light')                // Index, light
    act(() => setIndexTheme('dark'))
    expect(theme()).toBe('dark')                 // Index, dark
  })
})
