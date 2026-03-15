// src/shared/museum-ui/IntroModal.jsx
import styles from './IntroModal.module.css'

export default function IntroModal({ era, title, description, objectives, onBegin }) {
  return (
    <div className={styles.scrim}>
      <div className={styles.card}>
        <div className={styles.accentLine} />
        <div className={styles.body}>
          <span className={styles.eraLabel}>{era}</span>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          <hr className={styles.divider} />
          <p className={styles.objectivesLabel}>Objectives</p>
          <ul className={styles.objectivesList}>
            {objectives.map((obj, i) => (
              <li key={i} className={styles.objectiveItem}>
                <span className={styles.checkbox} />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.beginBtn} onClick={onBegin}>
          Begin excavation
        </button>
      </div>
    </div>
  )
}
