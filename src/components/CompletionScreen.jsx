// src/components/CompletionScreen.jsx
import styles from './CompletionScreen.module.css'

export default function CompletionScreen({ onReset }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.eyebrow}>Excavation Complete</div>
        <h1 className={styles.headline}>You uncovered the first layer.</h1>
        <div className={styles.divider} />
        <div className={styles.artifactsSection}>
          <div className={styles.artifactsHeader}>Recovered Artifacts</div>
          <div className={styles.artifactCard}>
            <div className={styles.artifactName}>Direct Manipulation</div>
            <div className={styles.artifactMeta}>1984 — Macintosh Desktop</div>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={onReset}>
          Return to Archive
        </button>
      </div>
    </div>
  )
}
