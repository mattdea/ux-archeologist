// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'
import ProjectsWindowContent from './ProjectsWindowContent'
import NotesWindowContent from './NotesWindowContent'
import TrashWindowContent from './TrashWindowContent'
import { toLocal, createOutline, moveOutline, removeOutline } from './desktopDrag'

// `id` is written to data-win so the desktop can measure the window for the
// zoom rectangles; `hidden` keeps it mounted but invisible while they draw.
// `width` overrides the 340px document width (desk accessories are smaller);
// `children` replaces the built-in content for the given `type`.
// `variant`: 'doc' (striped title bar, the Finder's windows and Note Pad),
// 'rdoc' (Inside Macintosh's rDocProc: rounded corners, a black title bar
// with the name in white, used by desk accessories), 'plain' (rDocProc with
// an empty title bar that `titleContent` fills: the Alarm Clock's one line).
export default function DraggableWindow({
  id, title, type, initialPos, zIndex, onClose, onFocus, hidden = false, width,
  variant = 'doc', titleContent,
  trashContents, onRestoreNotes, onItemDragStart, onItemDragEnd, trashSelected, onTrashSelect, children,
}) {
  const [pos, setPos] = useState(initialPos ?? { x: 120, y: 60 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const titleBarRef = useRef(null)
  const windowRef = useRef(null)
  const posRef = useRef(pos)
  posRef.current = pos
  const mouseCleanupRef = useRef(null)

  // Outline drag (stutter effect). Everything is in desktop coordinates:
  // the Mac is scaled by useArtifactFit, so screen px are converted with
  // toLocal() and the outline lives inside the desktop, not on <body>.
  const outlineEl = useRef(null)
  const outlineInterval = useRef(null)
  const outlineMouse = useRef({ x: 0, y: 0 })   // latest pointer, screen px
  const desktopEl = useRef(null)                 // window's offsetParent
  const containerSize = useRef({ width: 620, height: 415 })
  const windowSize = useRef({ w: 340, h: 246 })

  const MENU_BAR = 30  // px — matches --menu-bar-height in theme.css

  // Clamp desktop-relative pos to the screen, below the menu bar
  const clampPos = (x, y) => {
    const { width: cw, height: ch } = containerSize.current
    const { w, h } = windowSize.current
    return {
      x: Math.max(0, Math.min(cw - w, x)),
      y: Math.max(MENU_BAR, Math.min(ch - h, y)),
    }
  }

  // Where the window would sit for a pointer at (clientX, clientY)
  const posForPointer = (clientX, clientY) => {
    const p = toLocal(desktopEl.current, clientX, clientY)
    return clampPos(p.x - dragOffset.current.x, p.y - dragOffset.current.y)
  }

  // Begin a drag: record the grab point and show a dashed outline exactly
  // the window's size, where the window is. Returns false if not mounted.
  const beginDrag = (clientX, clientY) => {
    const win = windowRef.current
    const desktop = win?.offsetParent
    if (!win || !desktop) return false
    desktopEl.current = desktop
    containerSize.current = { width: desktop.offsetWidth, height: desktop.offsetHeight }
    windowSize.current = { w: win.offsetWidth, h: win.offsetHeight }
    const p = toLocal(desktop, clientX, clientY)
    dragOffset.current = { x: p.x - posRef.current.x, y: p.y - posRef.current.y }

    outlineEl.current = createOutline(desktop, {
      x: posRef.current.x, y: posRef.current.y,
      w: windowSize.current.w, h: windowSize.current.h,
    })
    outlineMouse.current = { x: clientX, y: clientY }

    // Update outline at ~10fps, like the 8MHz 68000 redrawing it
    outlineInterval.current = setInterval(() => {
      if (!outlineEl.current) return
      const { x, y } = posForPointer(outlineMouse.current.x, outlineMouse.current.y)
      moveOutline(outlineEl.current, x, y)
    }, 100)

    win.style.visibility = 'hidden'   // window hides; the outline is dragged
    return true
  }

  const stopOutline = () => {
    if (outlineInterval.current) {
      clearInterval(outlineInterval.current)
      outlineInterval.current = null
    }
    removeOutline(outlineEl.current)
    outlineEl.current = null
  }

  // Drop: window snaps to the true final pointer position
  const endDrag = (clientX, clientY) => {
    dragging.current = false
    stopOutline()
    if (desktopEl.current) setPos(posForPointer(clientX, clientY))
    if (windowRef.current) windowRef.current.style.visibility = 'visible'
  }

  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return
    e.preventDefault()
    if (!beginDrag(e.clientX, e.clientY)) return
    dragging.current = true

    const handleMouseMove = (e) => {
      if (!dragging.current) return
      outlineMouse.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseUp = (e) => {
      endDrag(e.clientX, e.clientY)
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
    if (!beginDrag(touch.clientX, touch.clientY)) return
    dragging.current = true
  }

  const handleTitleTouchEnd = (e) => {
    if (!dragging.current) return
    const touch = e.changedTouches[0]
    endDrag(touch.clientX, touch.clientY)
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
      data-win={id}
      className={`${styles.window} ${variant === 'rdoc' ? styles.rdoc : ''} ${variant === 'plain' ? styles.plain : ''}`}
      style={{ left: pos.x, top: pos.y, zIndex, width, visibility: hidden ? 'hidden' : undefined }}
      onMouseDown={() => onFocus?.()}
    >
      <div
        ref={titleBarRef}
        className={styles.titleBar}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onTouchEnd={handleTitleTouchEnd}
      >
        <button className={styles.closeBtn} onClick={onClose} title="Close" />
        {variant === 'plain' ? titleContent : <span className={styles.titleText}>{title}</span>}
      </div>

      <div className={type === 'notes' ? styles.scrollBody : (children || type === 'projects' || type === 'trash') ? styles.custom : styles.body}>
        {children}
        {type === 'projects' && <ProjectsWindowContent />}
        {type === 'notes'    && <NotesWindowContent />}
        {type === 'trash'    && (
          <TrashWindowContent
            contents={trashContents}
            selected={trashSelected}
            onSelect={onTrashSelect}
            onRestoreNotes={onRestoreNotes}
            onItemDragStart={onItemDragStart}
            onItemDragEnd={onItemDragEnd}
          />
        )}
      </div>
    </div>
  )
}
