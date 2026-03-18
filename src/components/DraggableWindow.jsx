// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'
import ProjectsWindowContent from './ProjectsWindowContent'
import NotesWindowContent from './NotesWindowContent'
import TrashWindowContent from './TrashWindowContent'

export default function DraggableWindow({
  title, type, initialPos, zIndex, onClose, onFocus,
  trashContents, onRestoreNotes, onItemDragStart, onItemDragEnd,
}) {
  const [pos, setPos] = useState(initialPos ?? { x: 120, y: 60 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const titleBarRef = useRef(null)
  const windowRef = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos
  const mouseCleanupRef = useRef(null)

  // Outline drag refs (stutter effect)
  const outlineEl = useRef(null)
  const outlineInterval = useRef(null)
  const outlineMouse = useRef({ x: 0, y: 0 })
  // Full container rect captured at drag start — used for clamping to screen bounds
  const containerRect = useRef({ left: 0, top: 0, width: 620, height: 415 })
  const windowSize = useRef({ w: 340, h: 246 })

  const MENU_BAR = 30  // px — matches --menu-bar-height in theme.css

  // Clamp desktop-relative pos to container bounds
  const clampPos = (x, y) => {
    const { width: cw, height: ch } = containerRect.current
    const { w, h } = windowSize.current
    return {
      x: Math.max(0, Math.min(cw - w, x)),
      y: Math.max(MENU_BAR, Math.min(ch - h, y)),
    }
  }

  // Clamp outline viewport position to container viewport bounds
  const clampOutline = (left, top) => {
    const { left: cl, top: ct, width: cw, height: ch } = containerRect.current
    const { w, h } = windowSize.current
    return {
      left: Math.max(cl, Math.min(cl + cw - w, left)),
      top:  Math.max(ct + MENU_BAR, Math.min(ct + ch - h, top)),
    }
  }

  // Spawn a dashed outline matching the window's rendered size, at its current position
  const startOutline = (clientX, clientY) => {
    const win = windowRef.current
    if (!win) return

    // Capture parent rect — width/height used for clamping, left/top for coord conversion
    const parentRect = win.offsetParent?.getBoundingClientRect()
      ?? { left: 0, top: 0, width: 620, height: 415 }
    containerRect.current = {
      left: parentRect.left, top: parentRect.top,
      width: parentRect.width, height: parentRect.height,
    }
    windowSize.current = { w: win.offsetWidth, h: win.offsetHeight }

    const outline = document.createElement('div')
    outline.style.cssText = `
      position: fixed;
      width: ${win.offsetWidth}px;
      height: ${win.offsetHeight}px;
      border: 1px dashed #000;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff;
      left: ${parentRect.left + posRef.current.x}px;
      top: ${parentRect.top + posRef.current.y}px;
    `
    document.body.appendChild(outline)
    outlineEl.current = outline
    outlineMouse.current = { x: clientX, y: clientY }

    // Update outline at ~10fps, clamped to the desktop screen bounds
    outlineInterval.current = setInterval(() => {
      if (!outlineEl.current) return
      const { x, y } = outlineMouse.current
      const rawLeft = containerRect.current.left + x - dragOffset.current.x
      const rawTop  = containerRect.current.top  + y - dragOffset.current.y
      const { left, top } = clampOutline(rawLeft, rawTop)
      outlineEl.current.style.left = `${left}px`
      outlineEl.current.style.top  = `${top}px`
    }, 100)
  }

  const stopOutline = () => {
    if (outlineInterval.current) {
      clearInterval(outlineInterval.current)
      outlineInterval.current = null
    }
    if (outlineEl.current) {
      document.body.removeChild(outlineEl.current)
      outlineEl.current = null
    }
  }

  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return
    e.preventDefault()
    onFocus?.()
    dragging.current = true
    dragOffset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y }

    // Hide window; show laggy outline instead
    if (windowRef.current) windowRef.current.style.visibility = 'hidden'
    startOutline(e.clientX, e.clientY)

    const handleMouseMove = (e) => {
      if (!dragging.current) return
      outlineMouse.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseUp = (e) => {
      dragging.current = false
      stopOutline()
      // Snap window to the true final cursor position
      setPos(clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
      if (windowRef.current) windowRef.current.style.visibility = 'visible'
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
    if (windowRef.current) windowRef.current.style.visibility = 'hidden'
    startOutline(touch.clientX, touch.clientY)
  }

  const handleTitleTouchEnd = (e) => {
    dragging.current = false
    stopOutline()
    const touch = e.changedTouches[0]
    setPos(clampPos(touch.clientX - dragOffset.current.x, touch.clientY - dragOffset.current.y))
    if (windowRef.current) windowRef.current.style.visibility = 'visible'
  }

  useEffect(() => {
    const el = titleBarRef.current
    if (!el) return
    const handleTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      // Update tracked position; interval handles the lagged outline update
      outlineMouse.current = { x: touch.clientX, y: touch.clientY }
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  useEffect(() => {
    return () => {
      mouseCleanupRef.current?.()
      stopOutline()
    }
  }, [])

  return (
    <div
      ref={windowRef}
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
        <button className={styles.closeBtn} onClick={onClose} title="Close" />
        <span className={styles.titleText}>{title}</span>
      </div>

      <div className={type === 'notes' ? styles.scrollBody : styles.body}>
        {type === 'projects' && <ProjectsWindowContent />}
        {type === 'notes'    && <NotesWindowContent />}
        {type === 'trash'    && (
          <TrashWindowContent
            contents={trashContents}
            onRestoreNotes={onRestoreNotes}
            onItemDragStart={onItemDragStart}
            onItemDragEnd={onItemDragEnd}
          />
        )}
      </div>
    </div>
  )
}
