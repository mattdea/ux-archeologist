// src/components/ArtifactModal.jsx
import styles from './ArtifactModal.module.css'

export default function ArtifactModal({ onContinue }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.eyebrow}>Artifact Discovered</div>
        <div className={styles.year}>1984</div>
        <div className={styles.artifactTitle}>Direct Manipulation</div>
        <p className={styles.body}>
          Instead of typing abstract commands, users could act directly on
          visible objects: open folders, move files, and choose commands from
          menus. This made personal computing dramatically more legible to
          ordinary people.
        </p>
        <button className={styles.continueBtn} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}
