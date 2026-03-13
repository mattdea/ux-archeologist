// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'
import ProjectsWindowContent from './ProjectsWindowContent'
import NotesWindowContent from './NotesWindowContent'
import TrashWindowContent from './TrashWindowContent'

export default function DraggableWindow({
  title, type, initialPos, zIndex, onClose, onFocus,
  trashContents, onRestoreNotes,
}) {
  const [pos, setPos] = useState(initialPos ?? { x: 120, y: 60 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const titleBarRef = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos
  const mouseCleanupRef = useRef(null)

  const clampPos = (x, y) => ({
    x: Math.max(0, Math.min(window.innerWidth - 340, x)),
    y: Math.max(20, Math.min(window.innerHeight - 120, y)),
  })

  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return
    e.preventDefault()
    onFocus?.()
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    const handleMouseMove = (e) => {
      if (!dragging.current) return
      setPos(clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
    }
    const handleMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      mouseCleanupRef.current = null
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    mouseCleanupRef.current = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }

  const handleTitleTouchStart = (e) => {
    if (e.target.closest('button')) return
    const touch = e.touches[0]
    onFocus?.()
    dragging.current = true
    dragOffset.current = {
      x: touch.clientX - posRef.current.x,
      y: touch.clientY - posRef.current.y,
    }
  }
  const handleTitleTouchEnd = () => { dragging.current = false }

  useEffect(() => {
    const el = titleBarRef.current
    if (!el) return
    const handleTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      setPos(clampPos(touch.clientX - dragOffset.current.x, touch.clientY - dragOffset.current.y))
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  useEffect(() => {
    return () => { mouseCleanupRef.current?.() }
  }, [])

  return (
    <div
      className={styles.window}
      style={{ left: pos.x, top: pos.y, zIndex }}
    >
      <div
        ref={titleBarRef}
        className={styles.titleBar}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onTouchEnd={handleTitleTouchEnd}
      >
        <button className={styles.closeBtn} onClick={onClose} title="Close">×</button>
        <span className={styles.titleText}>{title}</span>
      </div>

      <div className={type === 'notes' ? styles.scrollBody : styles.body}>
        {type === 'projects' && <ProjectsWindowContent />}
        {type === 'notes'    && <NotesWindowContent />}
        {type === 'trash'    && (
          <TrashWindowContent
            contents={trashContents}
            onRestoreNotes={onRestoreNotes}
          />
        )}
      </div>
    </div>
  )
}
