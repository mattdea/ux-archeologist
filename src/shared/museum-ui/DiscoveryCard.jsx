// src/shared/museum-ui/DiscoveryCard.jsx
import { useEffect, useId, useRef } from 'react'
import styles from './DiscoveryCard.module.css'
import { useFadeNavigate } from '../SharedLayout'

export default function DiscoveryCard({ era, artifactName, description, nextUrl }) {
  const navigate = useFadeNavigate()
  const titleId = useId()
  const buttonRef = useRef(null)
  useEffect(() => { buttonRef.current?.focus({ preventScroll: true }) }, [])

  return (
    <div className={styles.scrim} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={styles.card}>
        <div className={styles.accentLine} />
        <div className={styles.body}>
          <span className={styles.discoveredLabel}>Artifact Discovered</span>
          <p className={styles.year}>{era}</p>
          <hr className={styles.divider} />
          <h2 id={titleId} className={styles.artifactName}>{artifactName}</h2>
          <p className={styles.description}>{description}</p>
          <button ref={buttonRef} type="button" className={styles.nextBtn} onClick={() => navigate(nextUrl)}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
