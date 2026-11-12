// src/test/LeaveDuringBoot.test.jsx
//
// Leaving a level while it boots (backlog, "Fixes: leaving during a boot,
// a sound switch, the record over the discovery text", item 1). The old
// level keeps running for the 300ms fade-out: its sounds must stop as the
// fade starts, and anything it reports in that window (artifact ready, a
// Continue) belongs to the room being left, not the next one.
import { act, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import SharedLayout, { useArtifactReady, useFadeNavigate, useSetContinue } from '../shared/SharedLayout'
import * as sfx from '../audio/sfx'

let api
function Probe() {
  api = { navigate: useFadeNavigate(), ready: useArtifactReady(), setContinue: useSetContinue() }
  return <span data-testid="probe" />
}

// The content div's opacity transition ending, which swaps the view
function finishFade() {
  const el = screen.getByTestId('probe').parentElement
  const ev = new Event('transitionend', { bubbles: true })
  Object.defineProperty(ev, 'propertyName', { value: 'opacity' })
  act(() => { el.dispatchEvent(ev) })
}

describe('leaving a level during its boot', () => {
  it('ignores the old level’s Continue and ready calls during the fade-out', async () => {
    render(<SharedLayout><Probe /></SharedLayout>)
    // In a level, then on to another one
    act(() => { api.navigate('/level/0') })
    finishFade()
    await act(async () => { await new Promise(r => setTimeout(r, 700)) })
    act(() => { api.navigate('/level/2') })
    // The level being left finishes its boot inside the fade-out
    act(() => { api.ready(); api.setContinue(() => () => {}) })
    finishFade()
    await act(async () => { await new Promise(r => setTimeout(r, 700)) })
    // Level 2's room starts without a Continue and with its HUD hidden
    const cont = screen.getByText('Continue', { selector: 'button' })
    expect(cont).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('← Back to timeline').parentElement.style.opacity).toBe('0')
  })

  it('stops the dial-up as the fade-out starts', () => {
    const made = fakeAudio()
    try {
      render(<SharedLayout><Probe /></SharedLayout>)
      sfx.dialup()
      act(() => { api.navigate('/level/1') })
      expect(made[0].pause).toHaveBeenCalled()
    } finally { made.restore() }
  })
})

// Swaps window.Audio for a stub that records each element made
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

describe('sfx.stopAll', () => {
  it('pauses the dial-up and any file sound that is playing', () => {
    const made = fakeAudio()
    try {
      sfx.dialup()
      sfx.file('unlock.mp3')
      sfx.stopAll()
      expect(made.length).toBe(2)
      made.forEach(a => expect(a.pause).toHaveBeenCalled())
    } finally { made.restore() }
  })
})
