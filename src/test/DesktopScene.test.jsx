// src/test/DesktopScene.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopScene from '../components/DesktopScene'

const defaultObjectives = { openFolder: false, trashFile: false, useMenu: false }
const noop = () => {}

describe('DesktopScene', () => {
  it('renders System Disk, Projects, Notes, Trash icons and MenuBar', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    expect(screen.getByText('System Disk')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Trash')).toBeInTheDocument()
    expect(screen.getByText('File')).toBeInTheDocument()
  })

  it('opens Notes window on double-click and calls completeObjective openFolder', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    await user.dblClick(screen.getByText('Notes'))
    expect(completeObjective).toHaveBeenCalledWith('openFolder')
    // Notes label still visible (icon label remains)
    expect(screen.getAllByText('Notes').length).toBeGreaterThanOrEqual(1)
  })

  it('does not show window initially', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    // "3 items" file list header only appears when window is open
    expect(screen.queryByText('3 items')).not.toBeInTheDocument()
  })

  it('double-clicking the disk opens the System Disk window with its folders', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    expect(await screen.findByText('System Folder')).toBeInTheDocument()
    expect(screen.getByText('Empty Folder')).toBeInTheDocument()
  })

  it('Get Info opens an "Information about" window with a Locked box', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.click(screen.getByText('Notes'))
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('Get Info'))
    expect(await screen.findByText('Information about Notes')).toBeInTheDocument()
    expect(screen.getByLabelText('Locked')).toBeChecked()
  })

  it('Apple menu opens the Calculator desk accessory', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.click(screen.getByLabelText('Apple menu'))
    await user.click(screen.getByText('Calculator'))
    // the menu item blinks first, then the window appears
    expect(await screen.findByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByText('Calculator')).toBeInTheDocument()
  })

  it('calls completeObjective useMenu when MenuBar item clicked', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    await user.click(screen.getByText('View'))
    await user.click(screen.getByText('by Name'))
    await waitFor(() => expect(completeObjective).toHaveBeenCalledWith('useMenu'))
  })

  it('Notes icon is present when notesVisible is true (initial)', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  // Drag an icon (by its label) onto the Trash with HTML5 drag events
  const dropOnTrash = (label, item) => {
    const el = screen.getByText(label).closest('[draggable="true"]')
    const trashEl = screen.getByText('Trash').closest('[draggable="true"]')
    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(() => item),
      setDragImage: vi.fn(),
      effectAllowed: '',
      dropEffect: '',
    }
    fireEvent.dragStart(el, { dataTransfer })
    fireEvent.dragOver(trashEl, { dataTransfer })
    fireEvent.drop(trashEl, { dataTransfer })
    fireEvent.dragEnd(el, { dataTransfer })
  }

  it('drag-drop: Projects dropped on Trash completes the trashFile objective', () => {
    const completeObjective = vi.fn()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    dropOnTrash('Projects', 'projects')
    expect(completeObjective).toHaveBeenCalledWith('trashFile')
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
  })

  it('drag-drop: Notes dropped on Trash is trashed but completes no objective', () => {
    const completeObjective = vi.fn()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    dropOnTrash('Notes', 'notes')
    expect(completeObjective).not.toHaveBeenCalledWith('trashFile')
    expect(screen.queryByText('Notes')).not.toBeInTheDocument()
  })

  it('double-clicking Notes icon opens a notes window', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.dblClick(screen.getByText('Notes'))
    expect(screen.getByText(/1984/)).toBeInTheDocument()
  })

  it('double-clicking Trash opens a trash window', async () => {
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.dblClick(screen.getByText('Trash'))
    expect(screen.getByText(/0 items/)).toBeInTheDocument()
  })

  it('trash window shows Notes when notes has been trashed', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)

    // Drag notes to trash
    const notesLabel = screen.getByText('Notes')
    const notesEl = notesLabel.closest('[draggable="true"]') || notesLabel.closest('div')
    const trashLabel = screen.getByText('Trash')
    const trashEl = trashLabel.closest('div')
    const dt = { setData: vi.fn(), getData: vi.fn(() => 'notes'), setDragImage: vi.fn() }
    fireEvent.dragStart(notesEl, { dataTransfer: dt })
    fireEvent.dragOver(trashEl, { preventDefault: vi.fn(), dataTransfer: dt })
    fireEvent.drop(trashEl, { preventDefault: vi.fn(), dataTransfer: dt })

    // Open trash
    await user.dblClick(screen.getByText('Trash'))
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })

  // ── Moving items between folders, windows and the desktop ──────────
  const dt = (id) => ({ setData: vi.fn(), getData: vi.fn(() => id), setDragImage: vi.fn() })
  const drag = (fromEl, toEl, id) => {
    const t = dt(id)
    fireEvent.dragStart(fromEl, { dataTransfer: t })
    fireEvent.dragOver(toEl, { dataTransfer: t })
    fireEvent.drop(toEl, { dataTransfer: t })
    fireEvent.dragEnd(fromEl, { dataTransfer: t })
  }
  const desktopIcon = (label) => screen.getByText(label).closest('[data-icon]')

  it('a document dropped on a folder moves into it and leaves the desktop', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    drag(desktopIcon('Notes'), desktopIcon('Projects'), 'notes')
    expect(container.querySelector('[data-icon="notes"]')).toBeNull()
    await user.dblClick(screen.getByText('Projects'))
    const win = await waitFor(() => { const w = container.querySelector('[data-container="projects"]'); expect(w).not.toBeNull(); return w })
    expect(win.querySelector('[data-item="notes"]')).not.toBeNull()
    expect(screen.getByText('4 items')).toBeInTheDocument()
    expect(screen.getByText('8K in folder')).toBeInTheDocument()
  })

  it('opening Notes completes the objective wherever Notes is', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    drag(desktopIcon('Notes'), desktopIcon('Projects'), 'notes')
    await user.dblClick(screen.getByText('Projects'))
    const item = await waitFor(() => { const el = container.querySelector('[data-container="projects"] [data-item="notes"]'); expect(el).not.toBeNull(); return el })
    await user.dblClick(item)
    expect(completeObjective).toHaveBeenCalledWith('openFolder')
  })

  it('System refuses to leave the System Folder', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    await user.dblClick(await screen.findByText('System Folder'))
    const system = await waitFor(() => { const el = container.querySelector('[data-container="sysfolder"] [data-item="system"]'); expect(el).not.toBeNull(); return el })
    drag(system, desktopIcon('Trash').parentElement, 'system')                       // onto the desktop
    drag(system, container.querySelector('[data-container="disk"]'), 'system')        // into the disk window
    expect(container.querySelector('[data-container="sysfolder"] [data-item="system"]')).not.toBeNull()
    expect(container.querySelector('[data-icon="system"]')).toBeNull()
    expect(container.querySelector('[data-container="disk"] [data-item="system"]')).toBeNull()
  })

  it('a folder dropped into a folder inside itself snaps back', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.dblClick(screen.getByText('System Disk'))
    const empty = await waitFor(() => { const el = container.querySelector('[data-container="disk"] [data-item="emptyfolder"]'); expect(el).not.toBeNull(); return el })
    drag(desktopIcon('Projects'), empty, 'projects')                          // Projects into Empty Folder
    await user.dblClick(empty)
    const projects = await waitFor(() => { const el = container.querySelector('[data-container="emptyfolder"] [data-item="projects"]'); expect(el).not.toBeNull(); return el })
    drag(empty, projects, 'emptyfolder')                                       // Empty Folder into Projects: refused
    expect(container.querySelector('[data-container="disk"] [data-item="emptyfolder"]')).not.toBeNull()
  })

  it('File ▸ Put Back sends a desktop item back to the folder it belongs to', async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    await user.click(screen.getByText('Notes'))
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('Put Back'))
    await waitFor(() => expect(container.querySelector('[data-icon="notes"]')).toBeNull())
    await user.dblClick(screen.getByText('System Disk'))
    await waitFor(() => expect(container.querySelector('[data-container="disk"] [data-item="notes"]')).not.toBeNull())
    expect(screen.getByText('4 items')).toBeInTheDocument()
  })

  it("Get Info's Where line follows a moved item", async () => {
    const user = userEvent.setup()
    const { container } = render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    drag(desktopIcon('Notes'), desktopIcon('Projects'), 'notes')
    await user.dblClick(screen.getByText('Projects'))
    const item = await waitFor(() => { const el = container.querySelector('[data-container="projects"] [data-item="notes"]'); expect(el).not.toBeNull(); return el })
    fireEvent.mouseDown(item)
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('Get Info'))
    expect(await screen.findByText('Projects, System Disk')).toBeInTheDocument()
  })
})
