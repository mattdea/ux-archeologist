// src/test/TeachText.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopScene from '../components/DesktopScene'

const objectives = { openFolder: false, trashFile: false, useMenu: false }

// Choose a menu item (the menu blinks it first). Text queries: role queries
// are slow over the bitmap icons' many rects.
async function choose(user, menu, item) {
  await user.click(screen.getByText(menu))
  await user.click(screen.getByText(item))
}
const finderMenus = () => screen.queryByText('Special')

describe('TeachText', () => {
  it('opens Notes, locked, under TeachText’s own menus', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('Notes'))
    const doc = await screen.findByLabelText('Document')
    expect(doc.value).toMatch(/Jan 25, 1984/)
    expect(doc.readOnly).toBe(true)
    await waitFor(() => expect(finderMenus()).toBeNull(), { timeout: 3000 })
    expect(screen.getByText('File')).toBeInTheDocument()
  })

  it('closing the document goes back to the desktop', { timeout: 15000 }, async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('Notes'))
    await screen.findByLabelText('Document')
    await waitFor(() => expect(finderMenus()).toBeNull(), { timeout: 3000 })
    await choose(user, 'File', 'Close')
    await waitFor(() => expect(finderMenus()).not.toBeNull(), { timeout: 3000 })
    expect(screen.queryByLabelText('Document')).toBeNull()
  })

  it('saves a new document to the disk, where the Finder shows it after Quit', { timeout: 15000 }, async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    await user.dblClick(await screen.findByText('Utilities'))
    await user.dblClick(await screen.findByText('TeachText'))
    const doc = await screen.findByLabelText('Document')
    await user.type(doc, 'Hello')
    await waitFor(() => expect(finderMenus()).toBeNull(), { timeout: 3000 })
    await choose(user, 'File', 'Save')
    const name = await screen.findByLabelText('Document name')
    await user.clear(name)
    await user.type(name, 'Letter{Enter}')
    await waitFor(() => expect(screen.queryByLabelText('Document name')).toBeNull(), { timeout: 3000 })
    await choose(user, 'File', 'Quit')
    expect(await screen.findByText('Letter', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('4 items')).toBeInTheDocument()
  })

  it('asks before quitting with unsaved changes', { timeout: 15000 }, async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={objectives} completeObjective={() => {}} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    // Each step opens a window (zoom rectangles, drive light), which can
    // outlast findBy's 1s default when the suite runs in parallel.
    const wait = { timeout: 3000 }
    await user.dblClick(await screen.findByText('Utilities', {}, wait))
    await user.dblClick(await screen.findByText('TeachText', {}, wait))
    await user.type(await screen.findByLabelText('Document', {}, wait), 'x')
    await waitFor(() => expect(finderMenus()).toBeNull(), { timeout: 3000 })
    await choose(user, 'File', 'Quit')
    await user.click(await screen.findByText('No', {}, wait))
    await waitFor(() => expect(finderMenus()).not.toBeNull(), { timeout: 3000 })
  })
})
