// src/components/TrashWindowContent.jsx
import styles from './DraggableWindow.module.css'
import notesStyles from './DesktopIcon.module.css'

function ProjectsIconSmall({ onDragStart, onDragEnd }) {
  return (
    <div
      className={notesStyles.icon}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className={notesStyles.folderWrap}>
        <div className={notesStyles.folderTab} />
        <div className={notesStyles.folderBody} />
      </div>
      <span className={notesStyles.label}>Projects</span>
    </div>
  )
}

export default function TrashWindowContent({ contents = [], onRestoreNotes }) {
  const count = contents.length
  const hasProjects = contents.includes('projects')

  const handleProjectsDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'projects-restore')
    const ghost = document.createElement('div')
    ghost.style.cssText = 'width:1px;height:1px;position:fixed;top:-100px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleProjectsDragEnd = () => {
    // restore is handled by the desktop drop handler
  }

  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{count === 0 ? '0 items' : `${count} item${count > 1 ? 's' : ''}`}</span>
      </div>
      <div className={styles.trashBody}>
        {hasProjects && (
          <ProjectsIconSmall
            onDragStart={handleProjectsDragStart}
            onDragEnd={handleProjectsDragEnd}
          />
        )}
        {!hasProjects && (
          <span className={styles.emptyMsg}>Trash is empty.</span>
        )}
      </div>
    </>
  )
}
