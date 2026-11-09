// src/test/Scrapbook.test.jsx
import { render, fireEvent } from '@testing-library/react'
import Scrapbook from '../components/da/Scrapbook'

const page = (c) => Number(c.querySelector('[data-page]').dataset.page)

test('the arrows turn the pages, and stop at the first and the last', () => {
  const { container, getByLabelText } = render(<Scrapbook />)
  expect(page(container)).toBe(1)
  fireEvent.mouseDown(getByLabelText('Previous page'), { button: 0 })
  fireEvent.mouseUp(document)
  expect(page(container)).toBe(1)
  for (let i = 0; i < 6; i++) {
    fireEvent.mouseDown(getByLabelText('Next page'), { button: 0 })
    fireEvent.mouseUp(document)
  }
  expect(page(container)).toBe(5)
})
