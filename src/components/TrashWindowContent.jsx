// src/components/TrashWindowContent.jsx
import styles from './DraggableWindow.module.css'
import notesStyles from './DesktopIcon.module.css'

function NotesIconSmall({ onDragStart, onDragEnd }) {
  return (
    <div
      className={notesStyles.icon}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className={notesStyles.notesWrap}>
        <div className={notesStyles.notesPage}>
          <div className={notesStyles.notesLine} />
          <div className={notesStyles.notesLine} />
          <div className={notesStyles.notesLine} />
        </div>
      </div>
      <span className={notesStyles.label}>Notes</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], onRestoreNotes }) {
  const count = contents.length
  const hasNotes = contents.includes('notes')

  const handleNotesDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'notes-restore')
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleNotesDragEnd = () => {
    // restore is handled by the desktop drop handler
  }

  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`}</span>
      </div>
      <div className={styles.trashBody}>
        {hasNotes && (
          <NotesIconSmall
            onDragStart={handleNotesDragStart}
            onDragEnd={handleNotesDragEnd}
          />
        )}
        {!hasNotes && (
          <span className={styles.emptyMsg}>Trash is empty.</span>
        )}
      </div>
    </>
  )
}
