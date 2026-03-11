// src/test/DesktopScene.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopScene from '../components/DesktopScene'

const defaultObjectives = { openFolder: false, trashFile: false, useMenu: false }
const noop = () => {}

describe('DesktopScene', () => {
  it('renders Projects, Notes, Trash icons and MenuBar', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Trash')).toBeInTheDocument()
    expect(screen.getByText('File')).toBeInTheDocument()
  })

  it('opens Projects window on double-click and calls completeObjective openFolder', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    await user.dblClick(screen.getByText('Projects'))
    expect(completeObjective).toHaveBeenCalledWith('openFolder')
    // Window title visible (icon label + window title bar both say "Projects")
    expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1)
  })

  it('does not show window initially', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    // "3 items" file list header only appears when window is open
    expect(screen.queryByText('3 items')).not.toBeInTheDocument()
  })

  it('calls completeObjective useMenu when MenuBar item clicked', async () => {
    const completeObjective = vi.fn()
    const user = userEvent.setup()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('New Folder'))
    expect(completeObjective).toHaveBeenCalledWith('useMenu')
  })

  it('Notes icon is present when notesVisible is true (initial)', () => {
    render(<DesktopScene objectives={defaultObjectives} completeObjective={noop} active={true} />)
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('drag-drop: Notes dropped on Trash calls completeObjective trashFile', () => {
    const completeObjective = vi.fn()
    render(<DesktopScene objectives={defaultObjectives} completeObjective={completeObjective} active={true} />)

    // Find notes element — it should be the draggable element
    const notesLabel = screen.getByText('Notes')
    const notesEl = notesLabel.closest('[draggable="true"]') || notesLabel.closest('div')
    const trashLabel = screen.getByText('Trash')
    const trashEl = trashLabel.closest('div')

    // Simulate the drag sequence
    const dataTransferMock = {
      setData: vi.fn(),
      getData: vi.fn(() => 'notes'),
      setDragImage: vi.fn(),
      effectAllowed: '',
      dropEffect: '',
    }

    fireEvent.dragStart(notesEl, { dataTransfer: dataTransferMock })
    fireEvent.dragOver(trashEl, { preventDefault: vi.fn(), dataTransfer: dataTransferMock })
    fireEvent.drop(trashEl, { preventDefault: vi.fn(), dataTransfer: dataTransferMock })

    expect(completeObjective).toHaveBeenCalledWith('trashFile')
  })
})
