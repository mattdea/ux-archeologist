// src/components/DraggableWindow.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DraggableWindow.module.css'
import ProjectsWindowContent from './ProjectsWindowContent'
import NotesWindowContent from './NotesWindowContent'
import TrashWindowContent from './TrashWindowContent'
import { toLocal, createOutline, moveOutline, resizeOutline, removeOutline } from './desktopDrag'
import { WindowFrameContext } from './windowFrame'

// Smallest a window can be grown down to (reconstructed: no source gives it)
const MIN_W = 120
const MIN_H = 80
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// The close box while it's pressed: a starburst inside the box, 9×9 pixels
// with a 1px margin, read from docs/reference/mac system 1/ (Screenshot
// 2026-11-08 at 10.54.51 PM). The cursor hides part of the lower half
// there; it is completed by symmetry.
const STARBURST = [
  '....#....',
  '.#..#..#.',
  '..#.#.#..',
  '.........',
  '###...###',
  '.........',
  '..#.#.#..',
  '.#..#..#.',
  '....#....',
]
function Starburst() {
  return (
    <svg viewBox="0 0 11 11" width="11" height="11" shapeRendering="crispEdges" aria-hidden="true" style={{ display: 'block' }}>
      {STARBURST.flatMap((row, y) => [...row].map((c, x) => c === '#'
        ? <rect key={`${x}-${y}`} x={x + 1} y={y + 1} width="1" height="1" fill="#000" />
        : null))}
    </svg>
  )
}

// `id` is written to data-win so the desktop can measure the window for the
// zoom rectangles; `hidden` keeps it mounted but invisible while they draw.
// `width` overrides the 340px document width (desk accessories are smaller);
// `children` replaces the built-in content for the given `type`.
// `size` ({ w, h }) gives the window a fixed size (the Finder's windows);
// with `resizable` its grow box drags an outline of the new size, and the
// window takes it on release. `active` is false for windows behind the
// front one.
// `variant`: 'doc' (striped title bar, the Finder's windows and Note Pad),
// 'rdoc' (Inside Macintosh's rDocProc: rounded corners, a black title bar
// with the name in white, used by desk accessories), 'plain' (rDocProc with
// an empty title bar that `titleContent` fills: the Alarm Clock's one line).
export default function DraggableWindow({
  id, title, type, initialPos, zIndex, onClose, onFocus, hidden = false, width,
  variant = 'doc', titleContent, size: initialSize, resizable = false, active = true,
  trashContents, onRestoreNotes, onItemDragStart, onItemDragEnd, trashSelected, onTrashSelect, children,
}) {
  const [pos, setPos] = useState(initialPos ?? { x: 120, y: 60 })
  const [size, setSize] = useState(initialSize ?? null)
  const [closePressed, setClosePressed] = useState(false)
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

  // Close box (Window Manager, TrackGoAway): pressing it draws the starburst;
  // it lights only while the pointer is over the box, and the window closes
  // if the button comes up there. Released elsewhere, nothing happens.
  const handleCloseMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const box = e.currentTarget
    const inside = (ev) => {
      const r = box.getBoundingClientRect()
      return ev.clientX >= r.left && ev.clientX < r.right && ev.clientY >= r.top && ev.clientY < r.bottom
    }
    setClosePressed(true)
    const move = (ev) => setClosePressed(inside(ev))
    const up = (ev) => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      mouseCleanupRef.current = null
      setClosePressed(false)
      if (inside(ev)) onClose?.()
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    mouseCleanupRef.current = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
  }

  // Grow box: an outline of the new size follows the pointer at ~10fps from
  // the window's top-left corner; the window itself stays put until release.
  const handleGrowMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    onFocus?.()
    const win = windowRef.current
    const desktop = win?.offsetParent
    if (!win || !desktop) return
    const start = { w: win.offsetWidth, h: win.offsetHeight }
    const p0 = toLocal(desktop, e.clientX, e.clientY)
    const { x, y } = posRef.current
    const sizeFor = (cx, cy) => {
      const p = toLocal(desktop, cx, cy)
      return {
        w: Math.round(clamp(start.w + p.x - p0.x, MIN_W, desktop.offsetWidth - x)),
        h: Math.round(clamp(start.h + p.y - p0.y, MIN_H, desktop.offsetHeight - y)),
      }
    }
    outlineEl.current = createOutline(desktop, { x, y, ...start })
    let mouse = { x: e.clientX, y: e.clientY }
    outlineInterval.current = setInterval(() => {
      const s = sizeFor(mouse.x, mouse.y)
      if (outlineEl.current) resizeOutline(outlineEl.current, s.w, s.h)
    }, 100)
    const move = (ev) => { mouse = { x: ev.clientX, y: ev.clientY } }
    const up = (ev) => {
      stopOutline()
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      mouseCleanupRef.current = null
      setSize(sizeFor(ev.clientX, ev.clientY))
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    mouseCleanupRef.current = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
  }

  return (
    <div
      ref={windowRef}
      data-win={id}
      className={`${styles.window} ${variant === 'rdoc' ? styles.rdoc : ''} ${variant === 'plain' ? styles.plain : ''} ${size ? styles.sized : ''} ${!active && variant === 'doc' ? styles.inactive : ''}`}
      style={{
        left: pos.x, top: pos.y, zIndex,
        width: size ? size.w : width, height: size ? size.h : undefined,
        visibility: hidden ? 'hidden' : undefined,
      }}
      onMouseDown={() => onFocus?.()}
    >
      <WindowFrameContext.Provider value={{ active, resizable, onGrowMouseDown: resizable ? handleGrowMouseDown : undefined }}>
      <div
        ref={titleBarRef}
        className={styles.titleBar}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onTouchEnd={handleTitleTouchEnd}
      >
        {/* An inactive window has no close box (Window Manager: only the
            active window's title bar is highlighted) */}
        <button
          className={styles.closeBtn}
          onMouseDown={handleCloseMouseDown}
          // The mouse closes on release (above); Enter or Space still close.
          onClick={(e) => { if (e.detail === 0) onClose?.() }}
          title="Close"
          tabIndex={active ? 0 : -1}
        >
          {closePressed && <Starburst />}
        </button>
        {variant === 'plain' ? titleContent : <span className={styles.titleText}>{title}</span>}
      </div>

      <div className={type === 'notes' ? styles.scrollBody : size ? styles.fill : (children || type === 'projects' || type === 'trash') ? styles.custom : styles.body}>
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
      </WindowFrameContext.Provider>
    </div>
  )
}
