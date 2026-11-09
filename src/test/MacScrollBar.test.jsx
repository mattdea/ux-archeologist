// src/test/MacScrollBar.test.jsx
import { render, fireEvent, act } from '@testing-library/react'
import MacScrollBar from '../components/MacScrollBar'
import MacScrollPane from '../components/MacScrollPane'

// jsdom has no layout: give every element a 16×100 box at the origin, so
// the track is 100px long and screen px equal local px.
const box = { offsetHeight: 100, offsetWidth: 16 }
let saved
beforeEach(() => {
  saved = {}
  for (const [k, v] of Object.entries(box)) {
    saved[k] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, k)
    Object.defineProperty(HTMLElement.prototype, k, { configurable: true, get: () => v })
  }
  saved.rect = HTMLElement.prototype.getBoundingClientRect
  HTMLElement.prototype.getBoundingClientRect = () => ({ left: 0, top: 0, right: 16, bottom: 100, width: 16, height: 100 })
  vi.useFakeTimers()
})
afterEach(() => {
  for (const k of Object.keys(box)) Object.defineProperty(HTMLElement.prototype, k, saved[k])
  HTMLElement.prototype.getBoundingClientRect = saved.rect
  vi.useRealTimers()
})

const setup = (props = {}) => {
  const onChange = vi.fn()
  const utils = render(<MacScrollBar value={0} max={200} line={10} page={50} onChange={onChange} {...props} />)
  return { onChange, ...utils }
}

describe('MacScrollBar', () => {
  it('scrolls a line per arrow press and repeats while held', () => {
    const { container, onChange } = setup()
    fireEvent.mouseDown(container.querySelector('[data-arrow="inc"]'), { button: 0 })
    expect(onChange).toHaveBeenLastCalledWith(10)
    act(() => { vi.advanceTimersByTime(250 + 50 * 2) })
    expect(onChange).toHaveBeenLastCalledWith(40)
    fireEvent.mouseUp(document)
    const calls = onChange.mock.calls.length
    act(() => { vi.advanceTimersByTime(500) })
    expect(onChange.mock.calls.length).toBe(calls)
  })

  it('pages when the track below the thumb is pressed', () => {
    const { container, onChange } = setup()
    fireEvent.mouseDown(container.querySelector('[data-track]'), { button: 0, clientX: 4, clientY: 90 })
    expect(onChange).toHaveBeenLastCalledWith(50)
    fireEvent.mouseUp(document)
  })

  it('drags an outline of the thumb and scrolls only on release', () => {
    const { container, onChange } = setup()
    fireEvent.mouseDown(container.querySelector('[data-thumb]'), { button: 0, clientX: 4, clientY: 4 })
    fireEvent.mouseMove(document, { clientX: 4, clientY: 60 })
    expect(onChange).not.toHaveBeenCalled()
    expect(container.querySelector('[class*="ghost"]')).not.toBeNull()
    fireEvent.mouseUp(document, { clientX: 4, clientY: 60 })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toBeGreaterThan(0)
    expect(container.querySelector('[class*="ghost"]')).toBeNull()
  })

  it('draws no thumb and ignores presses with nothing to scroll', () => {
    const { container, onChange } = setup({ max: 0 })
    expect(container.querySelector('[data-thumb]')).toBeNull()
    fireEvent.mouseDown(container.querySelector('[data-arrow="inc"]'), { button: 0 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('is blank when inactive', () => {
    const { container } = setup({ active: false })
    expect(container.querySelector('[data-arrow]')).toBeNull()
    expect(container.querySelector('[data-thumb]')).toBeNull()
  })
})

describe('MacScrollPane', () => {
  it('does not scroll with the mouse wheel', () => {
    const { container } = render(<MacScrollPane><div style={{ height: 500 }}>text</div></MacScrollPane>)
    const content = container.querySelector('[style*="translate"]')
    const before = content.style.transform
    fireEvent.wheel(content, { deltaY: 300 })
    expect(content.style.transform).toBe(before)
  })
})
