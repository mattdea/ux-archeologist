// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'

const FILES = [
  { name: 'Budget.txt', icon: '▤' },
  { name: 'Letter.doc', icon: '▤' },
  { name: 'Sketch.bmp', icon: '▣' },
]

export default function DraggableWindow({ title, onClose }) {
  const [pos, setPos] = useState({ x: 120, y: 60 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const titleBarRef = useRef(null)
  // Keep a stable ref to pos for use inside imperative event handler
  const posRef = useRef(pos)
  posRef.current = pos

  const clampPos = (x, y) => ({
    x: Math.max(0, Math.min(window.innerWidth - 280, x)),
    y: Math.max(20, Math.min(window.innerHeight - 120, y)),
  })

  // Mouse drag
  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return // don't drag from close button
    e.preventDefault()
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    const handleMouseMove = (e) => {
      if (!dragging.current) return
      setPos(clampPos(
        e.clientX - dragOffset.current.x,
        e.clientY - dragOffset.current.y
      ))
    }
    const handleMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Touch drag — imperative non-passive listener required for e.preventDefault()
  // React synthetic onTouchMove is passive by default and cannot call preventDefault
  const handleTitleTouchStart = (e) => {
    if (e.target.closest('button')) return
    const touch = e.touches[0]
    dragging.current = true
    dragOffset.current = { x: touch.clientX - posRef.current.x, y: touch.clientY - posRef.current.y }
  }

  const handleTitleTouchEnd = () => {
    dragging.current = false
  }

  useEffect(() => {
    const el = titleBarRef.current
    if (!el) return
    const handleTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault() // must be non-passive to work on iOS/Chrome
      const touch = e.touches[0]
      setPos(clampPos(
        touch.clientX - dragOffset.current.x,
        touch.clientY - dragOffset.current.y
      ))
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  return (
    <div className={styles.window} style={{ left: pos.x, top: pos.y }}>
      <div
        ref={titleBarRef}
        className={styles.titleBar}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onTouchEnd={handleTitleTouchEnd}
      >
        <button className={styles.closeBtn} onClick={onClose} title="Close">
          ×
        </button>
        <span className={styles.titleText}>{title}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.fileListHeader}>
          <span>{FILES.length} items</span>
        </div>
        <ul className={styles.fileList}>
          {FILES.map(file => (
            <li key={file.name} className={styles.fileItem}>
              <span className={styles.fileIcon}>{file.icon}</span>
              <span>{file.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
