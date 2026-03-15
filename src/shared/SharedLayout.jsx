// src/shared/SharedLayout.jsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './SharedLayout.module.css'
import { isLevelComplete } from '../state/state'

// ── Level metadata ─────────────────────────────────────────────────
const LEVEL_META = {
  '/level/1': { era: '1984', title: 'The Desktop Arrives', level: 1 },
  '/level/2': { era: '1995', title: 'The Hypertext Web',   level: 2 },
  '/level/3': { era: '2007', title: 'Touch Arrives',       level: 3 },
  '/level/4': { era: '2015', title: 'The Infinite Feed',   level: 4 },
}

// Routes where the HUD is hidden entirely
const HUD_HIDDEN_PATHS = ['/', '/timeline']

// Level numbers for dot rendering
const LEVEL_NUMBERS = [1, 2, 3, 4]

// Dot class: active (currently playing) > done (completed) > empty (locked)
function dotClass(dotLevel, activeLevel) {
  if (dotLevel === activeLevel) return `${styles.dot} ${styles.dotActive}`
  if (isLevelComplete(dotLevel)) return `${styles.dot} ${styles.dotDone}`
  return `${styles.dot} ${styles.dotEmpty}`
}

export default function SharedLayout() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const showHUD      = !HUD_HIDDEN_PATHS.includes(pathname)
  const meta         = LEVEL_META[pathname] || {}
  const activeLevel  = meta.level ?? null   // null when not on a level route

  return (
    <div className={styles.room}>

      {showHUD && (
        <>
          {/* Top-left — era label + level title */}
          <div className={styles.hudTopLeft}>
            <span className={styles.eraLabel}>{meta.era}</span>
            <span className={styles.levelTitle}>{meta.title}</span>
          </div>

          {/* Top-right — progress dots (driven by real state) */}
          <div className={styles.hudTopRight}>
            {LEVEL_NUMBERS.map(n => (
              <span key={n} className={dotClass(n, activeLevel)} />
            ))}
          </div>

          {/* Bottom-left — artifact counter */}
          <div className={styles.hudBottomLeft}>
            <span className={styles.artifactCounter}>0 of 12 artifacts collected</span>
          </div>

          {/* Bottom-right — back to timeline (level routes only) */}
          <div className={styles.hudBottomRight}>
            {activeLevel !== null && (
              <span
                className={styles.backLink}
                onClick={() => navigate('/timeline')}
              >
                ← Back to timeline
              </span>
            )}
          </div>
        </>
      )}

      {/* Level / page content */}
      <div className={styles.content}>
        <Outlet />
      </div>

    </div>
  )
}
