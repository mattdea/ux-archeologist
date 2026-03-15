// src/shared/SharedLayout.jsx
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './SharedLayout.module.css'
import { isLevelComplete } from '../state/state'

// ── Fade-navigate context ──────────────────────────────────────────
// Provides a navigate() that fades content out before switching
// routes, then fades the new content back in.
// Usage: const navigate = useFadeNavigate()
export const FadeNavCtx = createContext(null)
export function useFadeNavigate() { return useContext(FadeNavCtx) }

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
  const { pathname }        = useLocation()
  const realNavigate        = useNavigate()
  const [fading, setFading] = useState(false)
  const pendingRef          = useRef(null)   // { to, options } waiting to fire
  const showHUD             = !HUD_HIDDEN_PATHS.includes(pathname)
  const meta                = LEVEL_META[pathname] || {}
  const activeLevel         = meta.level ?? null

  // Intercept all navigation: fade content out → navigate → fade in
  const fadeNavigate = useCallback((to, options) => {
    // Skip if already on that route
    if (to === pathname && !options) return
    pendingRef.current = { to, options }
    setFading(true)
  }, [pathname])

  // Fires when the content div finishes a CSS opacity transition
  const handleTransitionEnd = useCallback((e) => {
    // Only respond to the content div's own opacity transition
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
    // Only act when fading out with a pending destination
    if (!pendingRef.current) return
    const { to, options } = pendingRef.current
    pendingRef.current = null
    // Navigate while content is invisible; new route renders at opacity 0
    realNavigate(to, options)
    // Next tick: new content is committed — trigger the fade-in
    setTimeout(() => setFading(false), 0)
  }, [realNavigate])

  return (
    <FadeNavCtx.Provider value={fadeNavigate}>
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
                  onClick={() => fadeNavigate('/timeline')}
                >
                  ← Back to timeline
                </span>
              )}
            </div>
          </>
        )}

        {/* Level / page content — fades between routes */}
        <div
          className={styles.content}
          style={{ opacity: fading ? 0 : 1 }}
          onTransitionEnd={handleTransitionEnd}
        >
          <Outlet />
        </div>

      </div>
    </FadeNavCtx.Provider>
  )
}
