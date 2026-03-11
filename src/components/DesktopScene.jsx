// src/components/DesktopScene.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DesktopScene.module.css'
import MenuBar from './MenuBar'
import DesktopIcon from './DesktopIcon'
import DraggableWindow from './DraggableWindow'
import ObjectiveTracker from './ObjectiveTracker'

export default function DesktopScene({ objectives, completeObjective, active }) {
  const [windowOpen, setWindowOpen] = useState(false)
  const [notesVisible, setNotesVisible] = useState(true)
  const [trashHighlighted, setTrashHighlighted] = useState(false)

  const trashRef = useRef(null)
  const notesRef = useRef(null)
  const touchDragging = useRef(false)
  const touchGhost = useRef(null)

  // Non-passive touchmove on notes icon to allow e.preventDefault()
  useEffect(() => {
    const el = notesRef.current
    if (!el) return
    const handler = (e) => {
      if (touchDragging.current) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [notesVisible])

  // HTML5 DnD — mouse drag
  const handleNotesDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'notes')
    // Hide default ghost — use invisible image
    const ghost = document.createElement('div')
    ghost.style.width = '1px'
    ghost.style.height = '1px'
    ghost.style.position = 'fixed'
    ghost.style.top = '-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleTrashDragOver = (e) => {
    e.preventDefault()
    setTrashHighlighted(true)
  }

  const handleTrashDragLeave = () => {
    setTrashHighlighted(false)
  }

  const handleTrashDrop = (e) => {
    e.preventDefault()
    setTrashHighlighted(false)
    if (e.dataTransfer.getData('text/plain') === 'notes') {
      setNotesVisible(false)
      completeObjective('trashFile')
    }
  }

  // Touch drag — hit-test against trash bounding rect
  const handleNotesTouchStart = (e) => {
    const touch = e.touches[0]
    touchDragging.current = true

    // Create visual ghost
    const ghost = document.createElement('div')
    ghost.style.cssText = `
      position: fixed;
      width: 40px;
      height: 44px;
      background: rgba(255,255,255,0.8);
      border: 1px solid #000;
      pointer-events: none;
      z-index: 9999;
      left: ${touch.clientX - 20}px;
      top: ${touch.clientY - 22}px;
    `
    document.body.appendChild(ghost)
    touchGhost.current = ghost
  }

  const handleNotesTouchEnd = (e) => {
    touchDragging.current = false
    if (touchGhost.current) {
      document.body.removeChild(touchGhost.current)
      touchGhost.current = null
    }

    const touch = e.changedTouches[0]
    const trashRect = trashRef.current?.getBoundingClientRect()
    if (
      trashRect &&
      touch.clientX >= trashRect.left &&
      touch.clientX <= trashRect.right &&
      touch.clientY >= trashRect.top &&
      touch.clientY <= trashRect.bottom
    ) {
      setNotesVisible(false)
      setTrashHighlighted(false)
      completeObjective('trashFile')
    } else {
      setTrashHighlighted(false)
    }
  }

  // The touchmove for ghost movement is attached imperatively in useEffect (non-passive)
  // We also need to move the ghost — attach via document since we can't use passive React handler
  useEffect(() => {
    const moveGhost = (e) => {
      if (!touchDragging.current || !touchGhost.current) return
      const touch = e.touches[0]
      touchGhost.current.style.left = `${touch.clientX - 20}px`
      touchGhost.current.style.top = `${touch.clientY - 22}px`

      // Hit-test for trash highlight
      const trashRect = trashRef.current?.getBoundingClientRect()
      if (
        trashRect &&
        touch.clientX >= trashRect.left &&
        touch.clientX <= trashRect.right &&
        touch.clientY >= trashRect.top &&
        touch.clientY <= trashRect.bottom
      ) {
        setTrashHighlighted(true)
      } else {
        setTrashHighlighted(false)
      }
    }

    const el = notesRef.current
    if (!el) return
    el.addEventListener('touchmove', moveGhost, { passive: false })
    return () => el.removeEventListener('touchmove', moveGhost)
  }, [notesVisible])

  const handleFolderDoubleClick = () => {
    setWindowOpen(true)
    completeObjective('openFolder')
  }

  const handleMenuItemClick = () => {
    completeObjective('useMenu')
  }

  return (
    <div className={`${styles.desktop} ${!active ? styles.inactive : ''}`}>
      <MenuBar onMenuItemClick={handleMenuItemClick} />

      {notesVisible && (
        <DesktopIcon
          ref={notesRef}
          label="Notes"
          icon="notes"
          className={styles.iconNotes}
          draggable={true}
          onDragStart={handleNotesDragStart}
          onTouchStart={handleNotesTouchStart}
          onTouchEnd={handleNotesTouchEnd}
        />
      )}

      <DesktopIcon
        label="Projects"
        icon="folder"
        className={styles.iconProjects}
        onDoubleClick={handleFolderDoubleClick}
      />

      <DesktopIcon
        ref={trashRef}
        label="Trash"
        icon="trash"
        className={styles.iconTrash}
        isHighlighted={trashHighlighted}
        onDragOver={handleTrashDragOver}
        onDragLeave={handleTrashDragLeave}
        onDrop={handleTrashDrop}
      />

      {windowOpen && (
        <DraggableWindow
          title="Projects"
          onClose={() => setWindowOpen(false)}
        />
      )}

      <ObjectiveTracker objectives={objectives} />
    </div>
  )
}
