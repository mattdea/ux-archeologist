// src/components/ProjectsWindowContent.jsx
import styles from './DraggableWindow.module.css'
import iconStyles from './DesktopIcon.module.css'
import { NotesIcon } from './DesktopIcon'

const FILES = ['Budget', 'Letter', 'Sketch']

export default function ProjectsWindowContent() {
  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{FILES.length} items</span>
      </div>
      <div className={styles.trashBody}>
        {FILES.map(name => (
          <div
            key={name}
            className={iconStyles.icon}
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <NotesIcon />
            <span className={iconStyles.label}>{name}</span>
          </div>
        ))}
      </div>
    </>
  )
}
