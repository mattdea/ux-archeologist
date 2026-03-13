// src/test/MenuBar.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MenuBar from '../components/MenuBar'

describe('MenuBar', () => {
  it('renders File, Edit, View, Special labels', () => {
    render(<MenuBar onMenuItemClick={() => {}} />)
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()
    expect(screen.getByText('Special')).toBeInTheDocument()
  })

  it('dropdown is hidden initially', () => {
    render(<MenuBar onMenuItemClick={() => {}} />)
    expect(screen.queryByText('New Folder')).not.toBeInTheDocument()
  })

  it('opens dropdown on File click', async () => {
    const user = userEvent.setup()
    render(<MenuBar onMenuItemClick={() => {}} />)
    await user.click(screen.getByText('File'))
    expect(screen.getByText('New Folder')).toBeInTheDocument()
  })

  it('closes dropdown and calls onMenuItemClick when item clicked', async () => {
    const user = userEvent.setup()
    const onMenuItemClick = vi.fn()
    render(<MenuBar onMenuItemClick={onMenuItemClick} />)
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('New Folder'))
    expect(onMenuItemClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('New Folder')).not.toBeInTheDocument()
  })

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup()
    render(<MenuBar onMenuItemClick={() => {}} />)
    await user.click(screen.getByText('File'))
    expect(screen.getByText('New Folder')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByText('New Folder')).not.toBeInTheDocument()
  })

  it('closes dropdown on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <MenuBar onMenuItemClick={() => {}} />
        <div data-testid="outside">Outside</div>
      </div>
    )
    await user.click(screen.getByText('File'))
    expect(screen.getByText('New Folder')).toBeInTheDocument()
    await user.click(screen.getByTestId('outside'))
    expect(screen.queryByText('New Folder')).not.toBeInTheDocument()
  })

  it('File > Open is disabled when canOpen is false', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<MenuBar onMenuItemClick={() => {}} canOpen={false} onOpen={onOpen} canClose={false} onClose={() => {}} />)
    await user.click(screen.getByText('File'))
    const openBtn = screen.getByText('Open').closest('button')
    expect(openBtn).toHaveClass('dropdownItemDisabled')
  })

  it('File > Open calls onOpen when canOpen is true', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<MenuBar onMenuItemClick={() => {}} canOpen={true} onOpen={onOpen} canClose={false} onClose={() => {}} />)
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('Open'))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('File > Close calls onClose when canClose is true', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<MenuBar onMenuItemClick={() => {}} canOpen={false} onOpen={() => {}} canClose={true} onClose={onClose} />)
    await user.click(screen.getByText('File'))
    await user.click(screen.getByText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
