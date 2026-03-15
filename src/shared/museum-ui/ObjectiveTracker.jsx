// src/shared/museum-ui/ObjectiveTracker.jsx
import styles from './ObjectiveTracker.module.css'

export default function ObjectiveTracker({ objectives, completedIndices = [], onContinue }) {
  const allComplete = objectives.length > 0 && completedIndices.length === objectives.length

  return (
    <div className={styles.tracker}>
      <div className={styles.accentLine} />
      <div className={styles.body}>
        <p className={styles.label}>Objectives</p>
        <ul className={styles.list}>
          {objectives.map((obj, i) => {
            const done = completedIndices.includes(i)
            return (
              <li key={i} className={`${styles.item} ${done ? styles.itemDone : ''}`}>
                <span className={`${styles.check} ${done ? styles.checkDone : ''}`}>
                  {done && '✓'}
                </span>
                <span className={styles.itemText}>{obj}</span>
              </li>
            )
          })}
        </ul>
        {allComplete && (
          <button className={styles.continueBtn} onClick={onContinue}>
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
