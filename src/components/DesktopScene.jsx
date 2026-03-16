// src/components/DesktopScene.jsx
import { useState, useRef, useEffect } from 'react'
import styles from './DesktopScene.module.css'
import MenuBar from './MenuBar'
import DesktopIcon from './DesktopIcon'
import DraggableWindow from './DraggableWindow'
export default function DesktopScene({ completeObjective, active }) {
  // windows: [{ id: string, type: 'projects'|'notes'|'trash', pos: {x,y}, z: number }]
  const [windows, setWindows] = useState([])
  const [trashContents, setTrashContents] = useState([])  // [] | ['projects'] | ['notes'] | ['projects','notes']
  const [iconPositions, setIconPositions] = useState({
    projects: { x: 496, y: 40 },
    notes:    { x: 496, y: 160 },
    trash:    { x: 496, y: 300 },
  })
  const [nextZ, setNextZ] = useState(20)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [trashHighlighted, setTrashHighlighted] = useState(false)

  // Derived
  const projectsOnDesktop = !trashContents.includes('projects')
  const notesOnDesktop    = !trashContents.includes('notes')

  // Clear selection when an icon is trashed
  useEffect(() => {
    if (!projectsOnDesktop && selectedIcon === 'projects') setSelectedIcon(null)
  }, [projectsOnDesktop])

  useEffect(() => {
    if (!notesOnDesktop && selectedIcon === 'notes') setSelectedIcon(null)
  }, [notesOnDesktop])

  const openWindow = (type, defaultPos) => {
    const z = nextZ
    setNextZ(n => n + 1)
    setWindows(prev => {
      if (prev.find(w => w.type === type)) {
        return prev.map(w => w.type === type ? { ...w, z } : w)
      }
      return [...prev, { id: type, type, pos: defaultPos, z }]
    })
  }

  const closeTopWindow = () => {
    setWindows(prev => {
      if (!prev.length) return prev
      const top = prev.reduce((a, b) => a.z > b.z ? a : b)
      return prev.filter(w => w.id !== top.id)
    })
  }

  const desktopRef  = useRef(null)
  const trashRef    = useRef(null)
  const projectsRef = useRef(null)
  const notesRef    = useRef(null)
  const touchDragging = useRef(false)
  const touchGhost    = useRef(null)

  // Drag outline (System 1 stutter effect)
  const dragOutline   = useRef(null)
  const dragMousePos  = useRef({ x: 0, y: 0 })
  const dragInterval  = useRef(null)
  const dragResult    = useRef(null)   // set to 'trashed' in drop handler
  const draggingIcon  = useRef(null)   // which icon is being dragged
  const trackMouseRef = useRef(null)

  const startDragOutline = (x, y) => {
    const outline = document.createElement('div')
    outline.style.cssText = `
      position: fixed;
      width: 48px;
      height: 52px;
      border: 1px dashed #000;
      pointer-events: none;
      z-index: 9999;
      left: ${x - 24}px;
      top: ${y - 26}px;
      box-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff;
    `
    document.body.appendChild(outline)
    dragOutline.current = outline
    dragMousePos.current = { x, y }

    // Stutter: update position at ~10fps (every 100ms) like the 8MHz 68000
    dragInterval.current = setInterval(() => {
      if (!dragOutline.current) return
      const { x: mx, y: my } = dragMousePos.current
      dragOutline.current.style.left = `${mx - 24}px`
      dragOutline.current.style.top = `${my - 26}px`
    }, 100)

    const trackMouse = (e) => {
      dragMousePos.current = { x: e.clientX, y: e.clientY }
    }
    trackMouseRef.current = trackMouse
    // dragover fires during HTML5 drag; pointermove is suppressed by the browser
    document.addEventListener('dragover', trackMouse)
  }

  const stopDragOutline = () => {
    if (dragInterval.current) {
      clearInterval(dragInterval.current)
      dragInterval.current = null
    }
    if (trackMouseRef.current) {
      document.removeEventListener('dragover', trackMouseRef.current)
      trackMouseRef.current = null
    }
    if (dragOutline.current) {
      document.body.removeChild(dragOutline.current)
      dragOutline.current = null
    }
  }

  // Non-passive touchmove on projects icon to allow e.preventDefault()
  useEffect(() => {
    const el = projectsRef.current
    if (!el) return
    const handler = (e) => {
      if (touchDragging.current) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [projectsOnDesktop])

  // Non-passive touchmove on notes icon to allow e.preventDefault()
  useEffect(() => {
    const el = notesRef.current
    if (!el) return
    const handler = (e) => {
      if (touchDragging.current) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [notesOnDesktop])

  // HTML5 DnD — mouse drag (generic, works for all icons)
  const handleIconDragStart = (iconName, e) => {
    draggingIcon.current = iconName
    dragResult.current = null
    e.dataTransfer.setData('text/plain', iconName)
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
    startDragOutline(e.clientX, e.clientY)
  }

  const handleIconDragEnd = (iconName, e) => {
    stopDragOutline()
    if (dragResult.current === 'trashed') return  // position handled by trash drop
    const rect = desktopRef.current?.getBoundingClientRect()
    if (!rect) return
    const mouseX = dragMousePos.current?.x ?? e.clientX
    const mouseY = dragMousePos.current?.y ?? e.clientY
    const x = Math.max(4, Math.min(rect.width - 56, mouseX - rect.left - 24))
    const y = Math.max(34, Math.min(rect.height - 70, mouseY - rect.top - 26))
    setIconPositions(prev => ({ ...prev, [iconName]: { x, y } }))
  }

  const handleTrashDragOver = (e) => {
    e.preventDefault()
    if (draggingIcon.current === 'trash') return  // don't highlight when repositioning trash itself
    setTrashHighlighted(true)
  }

  const handleTrashDragLeave = () => {
    setTrashHighlighted(false)
  }

  const handleTrashDrop = (e) => {
    e.preventDefault()
    setTrashHighlighted(false)
    const item = e.dataTransfer.getData('text/plain')
    if (item === 'trash') return  // self-drop — dragend handles repositioning
    if (item === 'projects') {
      dragResult.current = 'trashed'
      stopDragOutline()
      setTrashContents(prev => prev.includes('projects') ? prev : [...prev, 'projects'])
      completeObjective('trashFile')
    } else if (item === 'notes') {
      dragResult.current = 'trashed'
      stopDragOutline()
      setTrashContents(prev => prev.includes('notes') ? prev : [...prev, 'notes'])
      // Notes trashed: no objective completed
    } else {
      stopDragOutline()
    }
  }

  // ── Touch drag — Projects ───────────────────────────────────────────
  const handleProjectsTouchStart = (e) => {
    const touch = e.touches[0]
    touchDragging.current = true

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

  const handleProjectsTouchEnd = (e) => {
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
      setTrashContents(prev => prev.includes('projects') ? prev : [...prev, 'projects'])
      setTrashHighlighted(false)
      completeObjective('trashFile')
    } else {
      setTrashHighlighted(false)
    }
  }

  // Ghost movement + trash highlight for projects touch drag
  useEffect(() => {
    const moveGhost = (e) => {
      if (!touchDragging.current || !touchGhost.current) return
      const touch = e.touches[0]
      touchGhost.current.style.left = `${touch.clientX - 20}px`
      touchGhost.current.style.top = `${touch.clientY - 22}px`

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

    const el = projectsRef.current
    if (!el) return
    el.addEventListener('touchmove', moveGhost, { passive: false })
    return () => el.removeEventListener('touchmove', moveGhost)
  }, [projectsOnDesktop])

  // ── Touch drag — Notes ──────────────────────────────────────────────
  const handleNotesTouchStart = (e) => {
    const touch = e.touches[0]
    touchDragging.current = true

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
      setTrashContents(prev => prev.includes('notes') ? prev : [...prev, 'notes'])
      setTrashHighlighted(false)
      // Notes trashed: no objective completed
    } else {
      setTrashHighlighted(false)
    }
  }

  // Ghost movement + trash highlight for notes touch drag
  useEffect(() => {
    const moveGhost = (e) => {
      if (!touchDragging.current || !touchGhost.current) return
      const touch = e.touches[0]
      touchGhost.current.style.left = `${touch.clientX - 20}px`
      touchGhost.current.style.top = `${touch.clientY - 22}px`

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
  }, [notesOnDesktop])

  // Cleanup drag outline on unmount to prevent ghost divs or listener leaks
  useEffect(() => {
    return () => stopDragOutline()
  }, [])

  const handleFolderDoubleClick = () => {
    openWindow('projects', { x: 80, y: 50 })
  }

  const handleNotesDoubleClick = () => {
    openWindow('notes', { x: 60, y: 55 })
    completeObjective('openFolder')
  }

  const handleTrashDoubleClick = () => {
    openWindow('trash', { x: 90, y: 60 })
  }

  const handleDesktopClick = (e) => {
    if (e.target === e.currentTarget) setSelectedIcon(null)
  }

  const handleMenuItemClick = () => {
    completeObjective('useMenu')
  }

  const handleMenuOpen = () => {
    if (!selectedIcon) return
    completeObjective('useMenu')
    if (selectedIcon === 'notes') {
      openWindow('notes', { x: 60, y: 55 })
      completeObjective('openFolder')
    } else if (selectedIcon === 'projects') {
      openWindow('projects', { x: 80, y: 50 })
    } else if (selectedIcon === 'trash') {
      openWindow('trash', { x: 90, y: 60 })
    }
  }

  const handleMenuClose = () => {
    closeTopWindow()
    completeObjective('useMenu')
  }

  const handleDesktopDrop = (e) => {
    e.preventDefault()
    const item = e.dataTransfer.getData('text/plain')
    if (item === 'projects-restore') {
      stopDragOutline()
      setTrashContents(prev => prev.filter(x => x !== 'projects'))
      const rect = desktopRef.current.getBoundingClientRect()
      const x = Math.max(4, Math.min(rect.width - 56, e.clientX - rect.left - 24))
      const y = Math.max(34, Math.min(rect.height - 70, e.clientY - rect.top - 26))
      setIconPositions(prev => ({ ...prev, projects: { x, y } }))
    } else if (item === 'notes-restore') {
      stopDragOutline()
      setTrashContents(prev => prev.filter(x => x !== 'notes'))
      const rect = desktopRef.current.getBoundingClientRect()
      const x = Math.max(4, Math.min(rect.width - 56, e.clientX - rect.left - 24))
      const y = Math.max(34, Math.min(rect.height - 70, e.clientY - rect.top - 26))
      setIconPositions(prev => ({ ...prev, notes: { x, y } }))
    }
  }

  const handleRestoreProjects = () => {
    setTrashContents(prev => prev.filter(x => x !== 'projects'))
  }

  return (
    <div
      ref={desktopRef}
      className={`${styles.desktop} ${!active ? styles.inactive : ''}`}
      onClick={handleDesktopClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDesktopDrop}
    >
      <MenuBar
        onMenuItemClick={handleMenuItemClick}
        canOpen={selectedIcon !== null && !windows.some(w => w.type === selectedIcon)}
        canClose={windows.length > 0}
        onOpen={handleMenuOpen}
        onClose={handleMenuClose}
      />

      {notesOnDesktop && (
        <DesktopIcon
          ref={notesRef}
          label="Notes"
          icon="notes"
          style={{ position: 'absolute', left: iconPositions.notes.x, top: iconPositions.notes.y }}
          draggable={true}
          isSelected={selectedIcon === 'notes'}
          onClick={() => setSelectedIcon('notes')}
          onDoubleClick={handleNotesDoubleClick}
          onDragStart={(e) => handleIconDragStart('notes', e)}
          onDragEnd={(e) => handleIconDragEnd('notes', e)}
          onTouchStart={handleNotesTouchStart}
          onTouchEnd={handleNotesTouchEnd}
        />
      )}

      {projectsOnDesktop && (
        <DesktopIcon
          ref={projectsRef}
          label="Projects"
          icon="folder"
          style={{ position: 'absolute', left: iconPositions.projects.x, top: iconPositions.projects.y }}
          draggable={true}
          isSelected={selectedIcon === 'projects'}
          onClick={() => setSelectedIcon('projects')}
          onDoubleClick={handleFolderDoubleClick}
          onDragStart={(e) => handleIconDragStart('projects', e)}
          onDragEnd={(e) => handleIconDragEnd('projects', e)}
          onTouchStart={handleProjectsTouchStart}
          onTouchEnd={handleProjectsTouchEnd}
        />
      )}

      <DesktopIcon
        ref={trashRef}
        label="Trash"
        icon="trash"
        isFull={trashContents.length > 0}
        style={{ position: 'absolute', left: iconPositions.trash.x, top: iconPositions.trash.y }}
        isHighlighted={trashHighlighted}
        isSelected={selectedIcon === 'trash'}
        onClick={() => setSelectedIcon('trash')}
        onDoubleClick={handleTrashDoubleClick}
        draggable={true}
        onDragStart={(e) => handleIconDragStart('trash', e)}
        onDragEnd={(e) => handleIconDragEnd('trash', e)}
        onDragOver={handleTrashDragOver}
        onDragLeave={handleTrashDragLeave}
        onDrop={handleTrashDrop}
      />

      {windows.map(win => (
        <DraggableWindow
          key={win.id}
          type={win.type}
          title={win.type === 'projects' ? 'Projects' : win.type === 'notes' ? 'Notes' : 'Trash'}
          initialPos={win.pos}
          zIndex={win.z}
          onClose={() => setWindows(prev => prev.filter(w => w.id !== win.id))}
          trashContents={win.type === 'trash' ? trashContents : undefined}
          onRestoreNotes={win.type === 'trash' ? handleRestoreProjects : undefined}
          onItemDragStart={win.type === 'trash' ? startDragOutline : undefined}
          onItemDragEnd={win.type === 'trash' ? stopDragOutline : undefined}
          onFocus={() => {
            const z = nextZ
            setNextZ(n => n + 1)
            setWindows(prev => prev.map(w => w.id === win.id ? { ...w, z } : w))
          }}
        />
      ))}

    </div>
  )
}
