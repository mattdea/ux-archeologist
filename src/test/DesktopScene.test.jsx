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
    // the menu item blinks first, then the window appears. This takes ~1s on
    // its own (blink + traced window render), right at findBy's 1s default,
    // so allow 3s or it fails whenever the suite runs in parallel.
    expect(await screen.findByRole('button', { name: '7' }, { timeout: 3000 })).toBeInTheDocument()
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
})
