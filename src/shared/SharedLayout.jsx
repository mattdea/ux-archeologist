// src/shared/SharedLayout.jsx
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './SharedLayout.module.css'
import { isLevelComplete } from '../state/state'

// ── Fade-navigate context ──────────────────────────────────────────
// Provides a navigate() that fades content out before switching routes.
export const FadeNavCtx = createContext(null)
export function useFadeNavigate() { return useContext(FadeNavCtx) }

// ── Artifact-ready context ─────────────────────────────────────────
// Level components call notifyArtifactReady() once their loading
// sequence finishes. SharedLayout listens and animates the HUD in.
export const HudCtx = createContext(null)
export function useArtifactReady() { return useContext(HudCtx) }

// ── Continue-button context ────────────────────────────────────────
// Level components call setContinue(fn) when all objectives are done.
// SharedLayout renders the Continue button in the HUD bottom-right.
// Pass null to hide the button (on navigation or screen change).
export const ContinueCtx = createContext(null)
export function useSetContinue() { return useContext(ContinueCtx) }

// ── Level metadata ─────────────────────────────────────────────────
const LEVEL_META = {
  '/level/0': { era: '1971', title: 'The Command Line',   level: 0 },
  '/level/1': { era: '1984', title: 'The Desktop',        level: 1 },
  '/level/2': { era: '1995', title: 'The Hyperlink',      level: 2 },
  '/level/3': { era: '2007', title: 'The Touchscreen',    level: 3 },
  '/level/4': { era: '2015', title: 'The Feed',           level: 4 },
  '/level/5': { era: '2023', title: 'The Conversation',   level: 5 },
}

// Routes where the HUD is hidden entirely
const HUD_HIDDEN_PATHS = ['/', '/timeline']

// Level numbers for dot rendering
const LEVEL_NUMBERS = [0, 1, 2, 3, 4, 5]

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

  // ── HUD visibility state ────────────────────────────────────────
  // hudReady: artifact has finished loading, HUD should be visible
  // hudFading: user is navigating away, HUD should fade out
  const [hudReady,  setHudReady]  = useState(false)
  const [hudFading, setHudFading] = useState(false)

  // ── Continue button action ──────────────────────────────────────
  // null = hidden; fn = shown and wired to that callback
  const [continueAction, setContinueAction] = useState(null)

  const showHUD    = !HUD_HIDDEN_PATHS.includes(pathname)
  const meta       = LEVEL_META[pathname] || {}
  const activeLevel = meta.level ?? null

  // ── Called by level components when their artifact is ready ─────
  const notifyArtifactReady = useCallback(() => {
    setHudReady(true)
  }, [])

  // ── Intercept navigation: fade HUD + content out, then navigate ─
  const fadeNavigate = useCallback((to, options) => {
    if (to === pathname && !options) return
    setContinueAction(null)  // clear Continue button on navigate
    setHudFading(true)       // start HUD fade-out (200ms)
    setHudReady(false)       // mark not ready (visual driven by hudFading until nav completes)
    pendingRef.current = { to, options }
    setFading(true)          // start content fade-out (300ms)
  }, [pathname])

  // Fires when the content div finishes its CSS opacity transition
  const handleTransitionEnd = useCallback((e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
    if (!pendingRef.current) return
    const { to, options } = pendingRef.current
    pendingRef.current = null
    realNavigate(to, options)
    setTimeout(() => {
      setFading(false)
      setHudFading(false)
      // hudReady stays false — level's notifyArtifactReady will set it true
    }, 0)
  }, [realNavigate])

  // ── Inline style for each HUD element ──────────────────────────
  // direction: 'down' (slides in from above) | 'up' (slides in from below)
  // delayMs: entrance stagger delay
  const hudStyle = (direction, delayMs) => {
    const translate = direction === 'down' ? 'translateY(-20px)' : 'translateY(20px)'
    if (hudFading) {
      // Fade out on navigate — faster than entrance, no transform change
      return {
        opacity: 0,
        transform: 'translateY(0)',
        transitionDuration: '200ms',
        transitionDelay: '0ms',
      }
    }
    if (!hudReady) {
      // Hidden initial state — no transition so it doesn't animate on mount
      return { opacity: 0, transform: translate, transitionDelay: '0ms' }
    }
    // Animate in — CSS transition on the element handles the motion
    return {
      opacity: 1,
      transform: 'translateY(0)',
      transitionDelay: `${delayMs}ms`,
    }
  }

  return (
    <FadeNavCtx.Provider value={fadeNavigate}>
      <HudCtx.Provider value={notifyArtifactReady}>
        <ContinueCtx.Provider value={setContinueAction}>
          <div className={styles.room}>

            {showHUD && (
              <>
                {/* Top-left — era label + level title */}
                <div className={styles.hudTopLeft} style={hudStyle('down', 0)}>
                  <span className={styles.eraLabel}>{meta.era}</span>
                  <span className={styles.levelTitle}>{meta.title}</span>
                </div>

                {/* Top-right — progress dots */}
                <div className={styles.hudTopRight} style={hudStyle('down', 0)}>
                  {LEVEL_NUMBERS.map(n => (
                    <span key={n} className={dotClass(n, activeLevel)} onClick={() => fadeNavigate('/level/' + n)} style={{ cursor: 'pointer' }} />
                  ))}
                </div>

                {/* Bottom-right — Continue (when objectives done) + back to timeline */}
                <div className={styles.hudBottomRight} style={hudStyle('up', 200)}>
                  <div className={`${styles.hudContinueBtnWrap} ${continueAction ? styles.hudContinueBtnWrapVisible : ''}`}>
                    <button className={styles.hudContinueBtn} onClick={continueAction ?? undefined}>
                      Continue
                    </button>
                  </div>
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
        </ContinueCtx.Provider>
      </HudCtx.Provider>
    </FadeNavCtx.Provider>
  )
}
