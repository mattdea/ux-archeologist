// src/components/ObjectiveTracker.jsx
import styles from './ObjectiveTracker.module.css'

const OBJECTIVE_LABELS = [
  { key: 'openFolder', label: 'Open the Notes file' },
  { key: 'trashFile', label: 'Drag Projects to Trash' },
  { key: 'useMenu', label: 'Use the File menu' },
]

export default function ObjectiveTracker({ objectives, onContinue }) {
  const allComplete = Object.values(objectives).every(Boolean)
  return (
    <div className={styles.panel}>
      <div className={styles.header}>Objectives</div>
      <ul className={styles.list}>
        {OBJECTIVE_LABELS.map(({ key, label }) => (
          <li key={key} className={styles.item}>
            <span className={`${styles.indicator} ${objectives[key] ? styles.complete : ''}`}>
              {objectives[key] ? '☑' : '☐'}
            </span>
            <span className={`${styles.label} ${objectives[key] ? styles.labelComplete : ''}`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
      <button className={styles.continueBtn} disabled={!allComplete} onClick={onContinue}>
        Continue
      </button>
    </div>
  )
}
