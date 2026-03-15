// src/shared/SharedLayout.jsx
import { Outlet } from 'react-router-dom'
import styles from './SharedLayout.module.css'

const DOTS = [
  { key: 'l1', state: 'active' },   // Level 1 — current
  { key: 'l2', state: 'empty' },
  { key: 'l3', state: 'empty' },
  { key: 'l4', state: 'empty' },
]

function dotClass(state) {
  if (state === 'active') return `${styles.dot} ${styles.dotActive}`
  if (state === 'done')   return `${styles.dot} ${styles.dotDone}`
  return `${styles.dot} ${styles.dotEmpty}`
}

export default function SharedLayout() {
  return (
    <div className={styles.room}>

      {/* Top-left — era label + level title */}
      <div className={styles.hudTopLeft}>
        <span className={styles.eraLabel}>1984</span>
        <span className={styles.levelTitle}>The Desktop Arrives</span>
      </div>

      {/* Top-right — progress dots */}
      <div className={styles.hudTopRight}>
        {DOTS.map(d => (
          <span key={d.key} className={dotClass(d.state)} />
        ))}
      </div>

      {/* Level content */}
      <div className={styles.content}>
        <Outlet />
      </div>

      {/* Bottom-left — artifact counter */}
      <div className={styles.hudBottomLeft}>
        <span className={styles.artifactCounter}>0 of 12 artifacts collected</span>
      </div>

      {/* Bottom-right — hint area (populated by level later) */}
      <div className={styles.hudBottomRight} />

    </div>
  )
}
