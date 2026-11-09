// src/shared/museum-ui/IntroModal.jsx
import { useEffect, useId, useRef } from 'react'
import styles from './IntroModal.module.css'

export default function IntroModal({ era, title, description, objectives, onBegin }) {
  const titleId = useId()
  const buttonRef = useRef(null)
  useEffect(() => { buttonRef.current?.focus({ preventScroll: true }) }, [])

  return (
    <div className={styles.scrim} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={styles.card}>
        <div className={styles.accentLine} />
        <div className={styles.body}>
          <span className={styles.eraLabel}>{era}</span>
          <h1 id={titleId} className={styles.title}>{title}</h1>
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
          <button ref={buttonRef} type="button" className={styles.beginBtn} onClick={onBegin}>
            Begin excavation
          </button>
        </div>
      </div>
    </div>
  )
}
