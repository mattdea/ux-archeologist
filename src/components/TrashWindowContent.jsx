// src/components/TrashWindowContent.jsx
import { useRef } from 'react'
import styles from './DraggableWindow.module.css'
import { toLocal } from './desktopDrag'
import WindowScrollArea from './WindowScrollArea'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon } from './DesktopIcon'

const MAC_PX = 620 / 512
const mp = (n) => `calc(var(--mac-px) * ${n})`
const LEFT = 12, TOP = 12, PITCH = 64   // as in the Finder's other windows
const ICON_BOX = 100                    // CSS px: DesktopIcon.module.css .icon width

// An item in the Trash: click selects it (File ▸ Put Back returns it),
// drag takes it back out; let go inside the Trash window, it moves there.
function TrashItem({ id, label, Icon, selected, onSelect, onDragStart, onDragEnd, at }) {
  return (
    <div
      className={`${iconStyles.icon} ${selected ? iconStyles.selected : ''}`}
      data-trash-item={id}
      draggable={true}
      onMouseDown={(e) => { e.stopPropagation(); onSelect?.(id) }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ position: 'absolute', left: `calc(${mp(at.x)} - ${ICON_BOX / 2}px + ${mp(16)})`, top: mp(at.y) }}
    >
      <Icon selected={selected} />
      <span className={iconStyles.label}>{label}</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], selected, onSelect, onRestoreNotes, onItemDragStart, onItemDragEnd, positions = {}, onMove }) {
  const bodyRef = useRef(null)
  const grab = useRef({ x: 0, y: 0 })   // pointer within the dragged icon, Mac px
  const order = ['projects', 'notes'].filter(id => contents.includes(id))
  const at = (id) => positions[id] ?? { x: LEFT + PITCH * order.indexOf(id), y: TOP }
  const noteGrab = (id, e) => {
    if (!bodyRef.current) return
    const p = toLocal(bodyRef.current, e.clientX, e.clientY), a = at(id)
    grab.current = { x: p.x / MAC_PX - a.x, y: p.y / MAC_PX - a.y }
  }
  // A drop inside the window moves the item, and doesn't reach the desktop
  // (which would take it out of the Trash)
  const handleDrop = (e) => {
    const m = e.dataTransfer.getData('text/plain').match(/^(projects|notes)-restore$/)
    if (!m || !bodyRef.current) return
    e.preventDefault()
    e.stopPropagation()
    onItemDragEnd?.()
    const p = toLocal(bodyRef.current, e.clientX, e.clientY)
    onMove?.(m[1], { x: Math.max(0, Math.round(p.x / MAC_PX - grab.current.x)), y: Math.max(0, Math.round(p.y / MAC_PX - grab.current.y)) })
  }

  const count = contents.length
  const hasProjects = contents.includes('projects')
  const hasNotes    = contents.includes('notes')

  const handleProjectsDragStart = (e) => {
    noteGrab('projects', e)
    e.dataTransfer.setData('text/plain', 'projects-restore')
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
    onItemDragStart?.(e.clientX, e.clientY)
  }

  const handleProjectsDragEnd = () => {
    onItemDragEnd?.()
  }

  const handleNotesDragStart = (e) => {
    noteGrab('notes', e)
    e.dataTransfer.setData('text/plain', 'notes-restore')
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
    onItemDragStart?.(e.clientX, e.clientY)
  }

  const handleNotesDragEnd = () => {
    onItemDragEnd?.()
  }

  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`}</span>
        {count === 0 && <span className={styles.fileInfoText}>Trash is empty</span>}
        {count === 0 && <span />}
      </div>
      <WindowScrollArea>
        <div ref={bodyRef} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
          style={{ position: 'relative', width: mp(Math.max(LEFT, ...order.map(id => at(id).x + PITCH))), height: mp(Math.max(TOP + 52, ...order.map(id => at(id).y + 52))) }}>
          {hasProjects && (
            <TrashItem id="projects" label="Projects" Icon={FolderIcon} selected={selected === 'projects'} onSelect={onSelect} at={at('projects')}
              onDragStart={handleProjectsDragStart} onDragEnd={handleProjectsDragEnd} />
          )}
          {hasNotes && (
            <TrashItem id="notes" label="Notes" Icon={NotesIcon} selected={selected === 'notes'} onSelect={onSelect} at={at('notes')}
              onDragStart={handleNotesDragStart} onDragEnd={handleNotesDragEnd} />
          )}
        </div>
      </WindowScrollArea>
    </>
  )
}
