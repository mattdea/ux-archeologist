// src/shared/museum-ui/DiscoveryCard.jsx
import styles from './DiscoveryCard.module.css'
import { useFadeNavigate } from '../SharedLayout'

export default function DiscoveryCard({ era, artifactName, description, nextUrl }) {
  const navigate = useFadeNavigate()

  return (
    <div className={styles.scrim}>
      <div className={styles.card}>
        <div className={styles.accentLine} />
        <div className={styles.body}>
          <span className={styles.discoveredLabel}>Artifact Discovered</span>
          <p className={styles.year}>{era}</p>
          <hr className={styles.divider} />
          <h2 className={styles.artifactName}>{artifactName}</h2>
          <p className={styles.description}>{description}</p>
          <button className={styles.nextBtn} onClick={() => navigate(nextUrl)}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
