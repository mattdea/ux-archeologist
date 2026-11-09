// src/test/WindowChrome.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopScene from '../components/DesktopScene'

const objectives = { openFolder: false, trashFile: false, useMenu: false }

describe('Finder window chrome', () => {
  it('draws the window behind the front one inactive: no close box, blank scroll bars', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    await screen.findByText('System Folder')
    const disk = container.querySelector('[data-win="disk"]')
    expect(disk.className).not.toMatch(/inactive/)
    expect(disk.querySelectorAll('[data-arrow]').length).toBe(4)   // both bars active
    expect(disk.querySelector('[data-growbox] svg')).not.toBeNull()

    await user.dblClick(screen.getAllByText('Notes')[0])
    await waitFor(() => expect(container.querySelector('[data-win="notes"]')).not.toBeNull())
    await waitFor(() => expect(disk.className).toMatch(/inactive/))
    expect(disk.querySelectorAll('[data-arrow]').length).toBe(0)
    expect(disk.querySelector('[data-growbox] svg')).toBeNull()
    expect(container.querySelector('[data-win="notes"]').className).not.toMatch(/inactive/)
  })

  it('draws the starburst while the close box is pressed; released off it, the window stays', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    await screen.findByText('System Folder')
    const close = container.querySelector('[data-win="disk"] button[title="Close"]')
    expect(close.querySelector('svg')).toBeNull()
    fireEvent.mouseDown(close, { button: 0, clientX: 5, clientY: 5 })
    expect(close.querySelectorAll('rect').length).toBe(20)
    fireEvent.mouseUp(document, { clientX: 500, clientY: 500 })
    expect(close.querySelector('svg')).toBeNull()
    expect(container.querySelector('[data-win="disk"]')).not.toBeNull()
  })

  it('shades an icon while its window is open', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    const diskIcon = container.querySelector('[data-icon="disk"]')
    expect(diskIcon.querySelector('[data-opened]')).toBeNull()
    await user.dblClick(screen.getByText('System Disk'))
    await screen.findByText('System Folder')
    expect(diskIcon.querySelector('[data-opened]')).not.toBeNull()
    expect(container.querySelector('[data-icon="projects"] [data-opened]')).toBeNull()
  })
})
