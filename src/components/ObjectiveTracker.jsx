// src/components/ObjectiveTracker.jsx
import styles from './ObjectiveTracker.module.css'

const OBJECTIVE_LABELS = [
  { key: 'openFolder', label: 'Open Projects folder' },
  { key: 'trashFile', label: 'Drag Notes to Trash' },
  { key: 'useMenu', label: 'Use the File menu' },
]

export default function ObjectiveTracker({ objectives }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>Objectives</div>
      <ul className={styles.list}>
        {OBJECTIVE_LABELS.map(({ key, label }) => (
          <li key={key} className={styles.item}>
            <span className={`${styles.indicator} ${objectives[key] ? styles.complete : ''}`}>
              {objectives[key] ? '✓' : '○'}
            </span>
            <span className={`${styles.label} ${objectives[key] ? styles.labelComplete : ''}`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
