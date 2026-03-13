// src/components/MenuBar.jsx
import { useState, useEffect, useRef } from 'react'
import styles from './MenuBar.module.css'

export default function MenuBar({ onMenuItemClick, canOpen = false, canClose = false, onOpen, onClose }) {
  const [openMenu, setOpenMenu] = useState(null)
  const menuBarRef = useRef(null)

  const MENUS = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New Folder' },
        { label: 'Open',  action: 'open',  disabled: !canOpen },
        { label: 'Close', action: 'close', disabled: !canClose },
        { separator: true },
        { label: 'About This System' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { separator: true },
        { label: 'Cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', shortcut: '⌘V', disabled: true },
        { label: 'Clear', disabled: true },
        { label: 'Select All', shortcut: '⌘A', disabled: true },
        { separator: true },
        { label: 'Show Clipboard', disabled: true },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'by Icon', checked: true },
        { label: 'by Name' },
        { label: 'by Date' },
        { label: 'by Size' },
        { label: 'by Kind' },
      ],
    },
    {
      id: 'special',
      label: 'Special',
      items: [
        { label: 'Clean Up' },
        { separator: true },
        { label: 'Empty Trash' },
        { separator: true },
        { label: 'Erase Disk' },
        { separator: true },
        { label: 'Restart' },
        { label: 'Shut Down' },
      ],
    },
  ]

  useEffect(() => {
    if (!openMenu) return
    const handleMouseDown = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openMenu])

  useEffect(() => {
    if (!openMenu) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openMenu])

  const handleItemClick = (item) => {
    if (item.disabled) return
    setOpenMenu(null)
    if (item.action === 'open') { onOpen?.(); return }
    if (item.action === 'close') { onClose?.(); return }
    onMenuItemClick()
  }

  return (
    <div className={styles.menuBar} ref={menuBarRef}>
      <span className={styles.apple}>⌘</span>
      {MENUS.map(menu => (
        <div key={menu.id} className={styles.menuItem}>
          <button
            className={`${styles.menuLabel} ${openMenu === menu.id ? styles.menuLabelActive : ''}`}
            onClick={() => setOpenMenu(o => o === menu.id ? null : menu.id)}
          >
            {menu.label}
          </button>
          {openMenu === menu.id && (
            <ul className={styles.dropdown}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <li key={i} className={styles.dropdownSeparator} />
                ) : (
                  <li key={item.label}>
                    <button
                      className={`${styles.dropdownItem} ${item.disabled ? styles.dropdownItemDisabled : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className={styles.checkCol}>
                        {item.checked ? '✓' : ''}
                      </span>
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.shortcut && (
                        <span className={styles.shortcut}>{item.shortcut}</span>
                      )}
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
