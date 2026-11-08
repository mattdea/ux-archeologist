// src/shared/museum-ui/ObjectiveTracker.jsx
import styles from './ObjectiveTracker.module.css'

export default function ObjectiveTracker({ objectives, completedIndices = [] }) {
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
                  {done && (
                    // Mounts when the objective completes, so the tick draws
                    // itself once (stroke-dashoffset) and the strike follows.
                    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                      <path className={styles.tick} d="M2 6.2 L4.8 9 L10 3.4" />
                    </svg>
                  )}
                </span>
                <span className={styles.itemText}>{obj}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
