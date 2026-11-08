// src/components/TrashWindowContent.jsx
import styles from './DraggableWindow.module.css'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon } from './DesktopIcon'

// An item in the Trash: click selects it (File ▸ Put Back returns it),
// drag takes it back out.
function TrashItem({ id, label, Icon, selected, onSelect, onDragStart, onDragEnd }) {
  return (
    <div
      className={`${iconStyles.icon} ${selected ? iconStyles.selected : ''}`}
      data-trash-item={id}
      draggable={true}
      onMouseDown={(e) => { e.stopPropagation(); onSelect?.(id) }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Icon selected={selected} />
      <span className={iconStyles.label}>{label}</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], selected, onSelect, onRestoreNotes, onItemDragStart, onItemDragEnd }) {
  const count = contents.length
  const hasProjects = contents.includes('projects')
  const hasNotes    = contents.includes('notes')

  const handleProjectsDragStart = (e) => {
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
      </div>
      <div className={styles.trashBody}>
        {hasProjects && (
          <TrashItem id="projects" label="Projects" Icon={FolderIcon} selected={selected === 'projects'} onSelect={onSelect}
            onDragStart={handleProjectsDragStart} onDragEnd={handleProjectsDragEnd} />
        )}
        {hasNotes && (
          <TrashItem id="notes" label="Notes" Icon={NotesIcon} selected={selected === 'notes'} onSelect={onSelect}
            onDragStart={handleNotesDragStart} onDragEnd={handleNotesDragEnd} />
        )}
      </div>
    </>
  )
}
