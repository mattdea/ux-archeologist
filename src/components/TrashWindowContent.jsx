// src/components/TrashWindowContent.jsx
import styles from './DraggableWindow.module.css'
import iconStyles from './DesktopIcon.module.css'
import { FolderIcon, NotesIcon } from './DesktopIcon'

function ProjectsIconSmall({ onDragStart, onDragEnd }) {
  return (
    <div
      className={iconStyles.icon}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <FolderIcon />
      <span className={iconStyles.label}>Projects</span>
    </div>
  )
}

function NotesIconSmall({ onDragStart, onDragEnd }) {
  return (
    <div
      className={iconStyles.icon}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <NotesIcon />
      <span className={iconStyles.label}>Notes</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], onRestoreNotes, onItemDragStart, onItemDragEnd }) {
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
          <ProjectsIconSmall
            onDragStart={handleProjectsDragStart}
            onDragEnd={handleProjectsDragEnd}
          />
        )}
        {hasNotes && (
          <NotesIconSmall
            onDragStart={handleNotesDragStart}
            onDragEnd={handleNotesDragEnd}
          />
        )}
      </div>
    </>
  )
}
