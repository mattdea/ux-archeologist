// src/test/SmallScreenNotice.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import SmallScreenNotice from '../shared/museum-ui/SmallScreenNotice'

// A controllable matchMedia: `small` decides whether the width query matches
let small, listeners
beforeEach(() => {
  small = true
  listeners = []
  window.sessionStorage.clear()
  window.matchMedia = vi.fn(() => ({
    get matches() { return small },
    addEventListener: (_, fn) => listeners.push(fn),
    removeEventListener: (_, fn) => { listeners = listeners.filter(l => l !== fn) },
  }))
})
const resize = (toSmall) => act(() => { small = toSmall; listeners.forEach(fn => fn()) })

describe('SmallScreenNotice', () => {
  it('shows under 600px and not at 600px or wider', () => {
    const { unmount } = render(<SmallScreenNotice />)
    expect(screen.getByText('Made for larger screens')).toBeInTheDocument()
    unmount()
    small = false
    render(<SmallScreenNotice />)
    expect(screen.queryByText('Made for larger screens')).toBeNull()
  })

  it('"Continue anyway" dismisses it for the rest of the visit', () => {
    const { unmount } = render(<SmallScreenNotice />)
    fireEvent.click(screen.getByText('Continue anyway'))
    expect(screen.queryByText('Made for larger screens')).toBeNull()
    unmount()
    render(<SmallScreenNotice />)   // a later page in the same visit
    expect(screen.queryByText('Made for larger screens')).toBeNull()
  })

  it('closes when the window widens past 600px', () => {
    render(<SmallScreenNotice />)
    resize(false)
    expect(screen.queryByText('Made for larger screens')).toBeNull()
  })

  it('still closes when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<SmallScreenNotice />)
    fireEvent.click(screen.getByText('Continue anyway'))
    expect(screen.queryByText('Made for larger screens')).toBeNull()
    spy.mockRestore()
  })
})
