// src/components/ProjectsWindowContent.jsx
import styles from './DraggableWindow.module.css'

const FILES = [
  { name: 'Budget.txt', icon: '▤' },
  { name: 'Letter.doc', icon: '▤' },
  { name: 'Sketch.bmp', icon: '▣' },
]

export default function ProjectsWindowContent() {
  return (
    <>
      <div className={styles.fileListHeader}>
        <span>{FILES.length} items</span>
      </div>
      <ul className={styles.fileList}>
        {FILES.map(file => (
          <li key={file.name} className={styles.fileItem}>
            <span className={styles.fileIcon}>{file.icon}</span>
            <span>{file.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
