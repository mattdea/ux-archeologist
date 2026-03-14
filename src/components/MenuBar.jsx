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
      <span className={styles.apple} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="16" height="16" shapeRendering="crispEdges">
          <g fill="#000000">
            <rect x="32" y="8" width="2" height="2"/><rect x="34" y="8" width="2" height="2"/><rect x="36" y="8" width="2" height="2"/><rect x="38" y="8" width="2" height="2"/><rect x="32" y="10" width="2" height="2"/><rect x="34" y="10" width="2" height="2"/><rect x="36" y="10" width="2" height="2"/><rect x="38" y="10" width="2" height="2"/><rect x="28" y="12" width="2" height="2"/><rect x="30" y="12" width="2" height="2"/><rect x="32" y="12" width="2" height="2"/><rect x="34" y="12" width="2" height="2"/><rect x="28" y="14" width="2" height="2"/><rect x="30" y="14" width="2" height="2"/><rect x="32" y="14" width="2" height="2"/><rect x="34" y="14" width="2" height="2"/><rect x="28" y="16" width="2" height="2"/><rect x="30" y="16" width="2" height="2"/><rect x="28" y="18" width="2" height="2"/><rect x="30" y="18" width="2" height="2"/><rect x="16" y="20" width="2" height="2"/><rect x="18" y="20" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/><rect x="22" y="20" width="2" height="2"/><rect x="24" y="20" width="2" height="2"/><rect x="26" y="20" width="2" height="2"/><rect x="32" y="20" width="2" height="2"/><rect x="34" y="20" width="2" height="2"/><rect x="36" y="20" width="2" height="2"/><rect x="38" y="20" width="2" height="2"/><rect x="40" y="20" width="2" height="2"/><rect x="42" y="20" width="2" height="2"/><rect x="16" y="22" width="2" height="2"/><rect x="18" y="22" width="2" height="2"/><rect x="20" y="22" width="2" height="2"/><rect x="22" y="22" width="2" height="2"/><rect x="24" y="22" width="2" height="2"/><rect x="26" y="22" width="2" height="2"/><rect x="32" y="22" width="2" height="2"/><rect x="34" y="22" width="2" height="2"/><rect x="36" y="22" width="2" height="2"/><rect x="38" y="22" width="2" height="2"/><rect x="40" y="22" width="2" height="2"/><rect x="42" y="22" width="2" height="2"/><rect x="12" y="24" width="2" height="2"/><rect x="14" y="24" width="2" height="2"/><rect x="16" y="24" width="2" height="2"/><rect x="18" y="24" width="2" height="2"/><rect x="20" y="24" width="2" height="2"/><rect x="22" y="24" width="2" height="2"/><rect x="24" y="24" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><rect x="28" y="24" width="2" height="2"/><rect x="30" y="24" width="2" height="2"/><rect x="32" y="24" width="2" height="2"/><rect x="34" y="24" width="2" height="2"/><rect x="36" y="24" width="2" height="2"/><rect x="38" y="24" width="2" height="2"/><rect x="40" y="24" width="2" height="2"/><rect x="42" y="24" width="2" height="2"/><rect x="44" y="24" width="2" height="2"/><rect x="46" y="24" width="2" height="2"/><rect x="12" y="26" width="2" height="2"/><rect x="14" y="26" width="2" height="2"/><rect x="16" y="26" width="2" height="2"/><rect x="18" y="26" width="2" height="2"/><rect x="20" y="26" width="2" height="2"/><rect x="22" y="26" width="2" height="2"/><rect x="24" y="26" width="2" height="2"/><rect x="26" y="26" width="2" height="2"/><rect x="28" y="26" width="2" height="2"/><rect x="30" y="26" width="2" height="2"/><rect x="32" y="26" width="2" height="2"/><rect x="34" y="26" width="2" height="2"/><rect x="36" y="26" width="2" height="2"/><rect x="38" y="26" width="2" height="2"/><rect x="40" y="26" width="2" height="2"/><rect x="42" y="26" width="2" height="2"/><rect x="44" y="26" width="2" height="2"/><rect x="46" y="26" width="2" height="2"/><rect x="12" y="28" width="2" height="2"/><rect x="14" y="28" width="2" height="2"/><rect x="16" y="28" width="2" height="2"/><rect x="18" y="28" width="2" height="2"/><rect x="20" y="28" width="2" height="2"/><rect x="22" y="28" width="2" height="2"/><rect x="24" y="28" width="2" height="2"/><rect x="26" y="28" width="2" height="2"/><rect x="28" y="28" width="2" height="2"/><rect x="30" y="28" width="2" height="2"/><rect x="32" y="28" width="2" height="2"/><rect x="34" y="28" width="2" height="2"/><rect x="36" y="28" width="2" height="2"/><rect x="38" y="28" width="2" height="2"/><rect x="12" y="30" width="2" height="2"/><rect x="14" y="30" width="2" height="2"/><rect x="16" y="30" width="2" height="2"/><rect x="18" y="30" width="2" height="2"/><rect x="20" y="30" width="2" height="2"/><rect x="22" y="30" width="2" height="2"/><rect x="24" y="30" width="2" height="2"/><rect x="26" y="30" width="2" height="2"/><rect x="28" y="30" width="2" height="2"/><rect x="30" y="30" width="2" height="2"/><rect x="32" y="30" width="2" height="2"/><rect x="34" y="30" width="2" height="2"/><rect x="36" y="30" width="2" height="2"/><rect x="38" y="30" width="2" height="2"/><rect x="12" y="32" width="2" height="2"/><rect x="14" y="32" width="2" height="2"/><rect x="16" y="32" width="2" height="2"/><rect x="18" y="32" width="2" height="2"/><rect x="20" y="32" width="2" height="2"/><rect x="22" y="32" width="2" height="2"/><rect x="24" y="32" width="2" height="2"/><rect x="26" y="32" width="2" height="2"/><rect x="28" y="32" width="2" height="2"/><rect x="30" y="32" width="2" height="2"/><rect x="32" y="32" width="2" height="2"/><rect x="34" y="32" width="2" height="2"/><rect x="36" y="32" width="2" height="2"/><rect x="38" y="32" width="2" height="2"/><rect x="12" y="34" width="2" height="2"/><rect x="14" y="34" width="2" height="2"/><rect x="16" y="34" width="2" height="2"/><rect x="18" y="34" width="2" height="2"/><rect x="20" y="34" width="2" height="2"/><rect x="22" y="34" width="2" height="2"/><rect x="24" y="34" width="2" height="2"/><rect x="26" y="34" width="2" height="2"/><rect x="28" y="34" width="2" height="2"/><rect x="30" y="34" width="2" height="2"/><rect x="32" y="34" width="2" height="2"/><rect x="34" y="34" width="2" height="2"/><rect x="36" y="34" width="2" height="2"/><rect x="38" y="34" width="2" height="2"/><rect x="12" y="36" width="2" height="2"/><rect x="14" y="36" width="2" height="2"/><rect x="16" y="36" width="2" height="2"/><rect x="18" y="36" width="2" height="2"/><rect x="20" y="36" width="2" height="2"/><rect x="22" y="36" width="2" height="2"/><rect x="24" y="36" width="2" height="2"/><rect x="26" y="36" width="2" height="2"/><rect x="28" y="36" width="2" height="2"/><rect x="30" y="36" width="2" height="2"/><rect x="32" y="36" width="2" height="2"/><rect x="34" y="36" width="2" height="2"/><rect x="36" y="36" width="2" height="2"/><rect x="38" y="36" width="2" height="2"/><rect x="40" y="36" width="2" height="2"/><rect x="42" y="36" width="2" height="2"/><rect x="44" y="36" width="2" height="2"/><rect x="46" y="36" width="2" height="2"/><rect x="12" y="38" width="2" height="2"/><rect x="14" y="38" width="2" height="2"/><rect x="16" y="38" width="2" height="2"/><rect x="18" y="38" width="2" height="2"/><rect x="20" y="38" width="2" height="2"/><rect x="22" y="38" width="2" height="2"/><rect x="24" y="38" width="2" height="2"/><rect x="26" y="38" width="2" height="2"/><rect x="28" y="38" width="2" height="2"/><rect x="30" y="38" width="2" height="2"/><rect x="32" y="38" width="2" height="2"/><rect x="34" y="38" width="2" height="2"/><rect x="36" y="38" width="2" height="2"/><rect x="38" y="38" width="2" height="2"/><rect x="40" y="38" width="2" height="2"/><rect x="42" y="38" width="2" height="2"/><rect x="44" y="38" width="2" height="2"/><rect x="46" y="38" width="2" height="2"/><rect x="12" y="40" width="2" height="2"/><rect x="14" y="40" width="2" height="2"/><rect x="16" y="40" width="2" height="2"/><rect x="18" y="40" width="2" height="2"/><rect x="20" y="40" width="2" height="2"/><rect x="22" y="40" width="2" height="2"/><rect x="24" y="40" width="2" height="2"/><rect x="26" y="40" width="2" height="2"/><rect x="28" y="40" width="2" height="2"/><rect x="30" y="40" width="2" height="2"/><rect x="32" y="40" width="2" height="2"/><rect x="34" y="40" width="2" height="2"/><rect x="36" y="40" width="2" height="2"/><rect x="38" y="40" width="2" height="2"/><rect x="40" y="40" width="2" height="2"/><rect x="42" y="40" width="2" height="2"/><rect x="44" y="40" width="2" height="2"/><rect x="46" y="40" width="2" height="2"/><rect x="12" y="42" width="2" height="2"/><rect x="14" y="42" width="2" height="2"/><rect x="16" y="42" width="2" height="2"/><rect x="18" y="42" width="2" height="2"/><rect x="20" y="42" width="2" height="2"/><rect x="22" y="42" width="2" height="2"/><rect x="24" y="42" width="2" height="2"/><rect x="26" y="42" width="2" height="2"/><rect x="28" y="42" width="2" height="2"/><rect x="30" y="42" width="2" height="2"/><rect x="32" y="42" width="2" height="2"/><rect x="34" y="42" width="2" height="2"/><rect x="36" y="42" width="2" height="2"/><rect x="38" y="42" width="2" height="2"/><rect x="40" y="42" width="2" height="2"/><rect x="42" y="42" width="2" height="2"/><rect x="44" y="42" width="2" height="2"/><rect x="46" y="42" width="2" height="2"/><rect x="16" y="44" width="2" height="2"/><rect x="18" y="44" width="2" height="2"/><rect x="20" y="44" width="2" height="2"/><rect x="22" y="44" width="2" height="2"/><rect x="24" y="44" width="2" height="2"/><rect x="26" y="44" width="2" height="2"/><rect x="28" y="44" width="2" height="2"/><rect x="30" y="44" width="2" height="2"/><rect x="32" y="44" width="2" height="2"/><rect x="34" y="44" width="2" height="2"/><rect x="36" y="44" width="2" height="2"/><rect x="38" y="44" width="2" height="2"/><rect x="40" y="44" width="2" height="2"/><rect x="42" y="44" width="2" height="2"/><rect x="16" y="46" width="2" height="2"/><rect x="18" y="46" width="2" height="2"/><rect x="20" y="46" width="2" height="2"/><rect x="22" y="46" width="2" height="2"/><rect x="24" y="46" width="2" height="2"/><rect x="26" y="46" width="2" height="2"/><rect x="28" y="46" width="2" height="2"/><rect x="30" y="46" width="2" height="2"/><rect x="32" y="46" width="2" height="2"/><rect x="34" y="46" width="2" height="2"/><rect x="36" y="46" width="2" height="2"/><rect x="38" y="46" width="2" height="2"/><rect x="40" y="46" width="2" height="2"/><rect x="42" y="46" width="2" height="2"/><rect x="20" y="48" width="2" height="2"/><rect x="22" y="48" width="2" height="2"/><rect x="24" y="48" width="2" height="2"/><rect x="26" y="48" width="2" height="2"/><rect x="32" y="48" width="2" height="2"/><rect x="34" y="48" width="2" height="2"/><rect x="36" y="48" width="2" height="2"/><rect x="38" y="48" width="2" height="2"/><rect x="20" y="50" width="2" height="2"/><rect x="22" y="50" width="2" height="2"/><rect x="24" y="50" width="2" height="2"/><rect x="26" y="50" width="2" height="2"/><rect x="32" y="50" width="2" height="2"/><rect x="34" y="50" width="2" height="2"/><rect x="36" y="50" width="2" height="2"/><rect x="38" y="50" width="2" height="2"/>
          </g>
        </svg>
      </span>
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
