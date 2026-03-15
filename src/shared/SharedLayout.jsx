// src/shared/SharedLayout.jsx
import { Outlet, useLocation } from 'react-router-dom'
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

// Routes where the HUD is hidden (title screen and timeline act as their own nav)
const HUD_HIDDEN_PATHS = ['/', '/timeline']

export default function SharedLayout() {
  const { pathname } = useLocation()
  const showHUD = !HUD_HIDDEN_PATHS.includes(pathname)

  return (
    <div className={styles.room}>

      {showHUD && (
        <>
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

          {/* Bottom-left — artifact counter */}
          <div className={styles.hudBottomLeft}>
            <span className={styles.artifactCounter}>0 of 12 artifacts collected</span>
          </div>

          {/* Bottom-right — hint area (populated by level later) */}
          <div className={styles.hudBottomRight} />
        </>
      )}

      {/* Level / page content */}
      <div className={styles.content}>
        <Outlet />
      </div>

    </div>
  )
}
