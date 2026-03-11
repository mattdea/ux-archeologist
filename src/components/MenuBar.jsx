// src/components/MenuBar.jsx
import { useState, useEffect, useRef } from 'react'
import styles from './MenuBar.module.css'

const FILE_MENU_ITEMS = ['New Folder', 'Open', 'Close', 'About This System']

export default function MenuBar({ onMenuItemClick }) {
  const [fileOpen, setFileOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!fileOpen) return
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setFileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [fileOpen])

  useEffect(() => {
    if (!fileOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setFileOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [fileOpen])

  const handleItemClick = () => {
    setFileOpen(false)
    onMenuItemClick()
  }

  return (
    <div className={styles.menuBar}>
      <span className={styles.apple}>⌘</span>
      <div className={styles.menuItem} ref={menuRef}>
        <button
          className={`${styles.menuLabel} ${fileOpen ? styles.menuLabelActive : ''}`}
          onClick={() => setFileOpen(o => !o)}
        >
          File
        </button>
        {fileOpen && (
          <ul className={styles.dropdown}>
            {FILE_MENU_ITEMS.map(item => (
              <li key={item}>
                <button className={styles.dropdownItem} onClick={handleItemClick}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {['Edit', 'View', 'Special'].map(label => (
        <span key={label} className={styles.menuLabelInert}>{label}</span>
      ))}
    </div>
  )
}
