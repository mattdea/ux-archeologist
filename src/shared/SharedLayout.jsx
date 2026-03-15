// src/shared/SharedLayout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import styles from './SharedLayout.module.css'

// ── Level metadata ─────────────────────────────────────────────────
const LEVEL_META = {
  '/level/1': { era: '1984', title: 'The Desktop Arrives' },
  '/level/2': { era: '1995', title: 'The Hypertext Web'   },
  '/level/3': { era: '2007', title: 'Touch Arrives'       },
  '/level/4': { era: '2015', title: 'The Infinite Feed'   },
}

// Routes where the HUD is hidden entirely
const HUD_HIDDEN_PATHS = ['/', '/timeline']

// ── Progress dots ──────────────────────────────────────────────────
const DOTS = [
  { key: 'l1', state: 'active' },
  { key: 'l2', state: 'empty'  },
  { key: 'l3', state: 'empty'  },
  { key: 'l4', state: 'empty'  },
]

function dotClass(state, styles) {
  if (state === 'active') return `${styles.dot} ${styles.dotActive}`
  if (state === 'done')   return `${styles.dot} ${styles.dotDone}`
  return `${styles.dot} ${styles.dotEmpty}`
}

export default function SharedLayout() {
  const { pathname } = useLocation()
  const showHUD = !HUD_HIDDEN_PATHS.includes(pathname)
  const meta    = LEVEL_META[pathname] || {}

  return (
    <div className={styles.room}>

      {showHUD && (
        <>
          {/* Top-left — era label + level title */}
          <div className={styles.hudTopLeft}>
            <span className={styles.eraLabel}>{meta.era}</span>
            <span className={styles.levelTitle}>{meta.title}</span>
          </div>

          {/* Top-right — progress dots */}
          <div className={styles.hudTopRight}>
            {DOTS.map(d => (
              <span key={d.key} className={dotClass(d.state, styles)} />
            ))}
          </div>

          {/* Bottom-left — artifact counter */}
          <div className={styles.hudBottomLeft}>
            <span className={styles.artifactCounter}>0 of 12 artifacts collected</span>
          </div>

          {/* Bottom-right — hint area (populated by levels) */}
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
