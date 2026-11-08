// src/shared/SharedLayout.jsx
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import styles from './SharedLayout.module.css'
import { isLevelComplete } from '../state/state'

// ── Fade-navigate context ──────────────────────────────────────────
// Provides a navigate() that fades content out before swapping the view.
// Navigation is purely state-based — the URL stays at "/" the whole time.
export const FadeNavCtx = createContext(null)
export function useFadeNavigate() { return useContext(FadeNavCtx) }

// ── Current-view context ───────────────────────────────────────────
// The active view key lives in SharedLayout state. App consumes this to
// render the matching view component in place of the old <Outlet />.
export const ViewCtx = createContext('title')
export function useCurrentView() { return useContext(ViewCtx) }

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

// ── Path → view map ────────────────────────────────────────────────
// Consumers still call useFadeNavigate("/timeline"), "/level/2", etc.
// We translate those path strings into view keys here so the call sites
// (DiscoveryCard, TitleScreen, Timeline) stay unchanged.
const PATH_TO_VIEW = {
  '/':                'title',
  '/timeline':        'timeline',
  '/level/0':         'level0',
  '/level/1':         'level1',
  '/level/2':         'level2',
  '/level/3':         'level3',
  '/level/4':         'level4',
  '/level/5':         'level5',
  '/collection':      'collection',
  '/test/museum-ui':  'test',
}

// ── Level metadata (keyed by view) ─────────────────────────────────
const LEVEL_META = {
  level0: { era: '1971', title: 'The Command Line',   level: 0 },
  level1: { era: '1984', title: 'The Desktop',        level: 1 },
  level2: { era: '1995', title: 'The Hyperlink',      level: 2 },
  level3: { era: '2007', title: 'The Touchscreen',    level: 3 },
  level4: { era: '2016', title: 'The Feed',           level: 4 },
  level5: { era: '2023', title: 'The Conversation',   level: 5 },
}

// Views where the HUD is hidden entirely
const HUD_HIDDEN_VIEWS = ['title', 'timeline']

// Level numbers for dot rendering
const LEVEL_NUMBERS = [0, 1, 2, 3, 4, 5]

// Dot class: active (currently playing) > done (completed) > empty (locked)
function dotClass(dotLevel, activeLevel) {
  if (dotLevel === activeLevel) return `${styles.dot} ${styles.dotActive}`
  if (isLevelComplete(dotLevel)) return `${styles.dot} ${styles.dotDone}`
  return `${styles.dot} ${styles.dotEmpty}`
}

// Calls `cb` after two consecutive animation frames arrive within 40ms of
// each other (rendering has settled), or after `maxMs` regardless.
function whenFramesSettle(cb, maxMs = 600) {
  const t0 = performance.now()
  let last = t0, quick = 0
  const tick = (t) => {
    quick = t - last < 40 ? quick + 1 : 0
    last = t
    if (quick >= 2 || t - t0 > maxMs) cb()
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

export default function SharedLayout({ children }) {
  const [view, setView]     = useState('title')   // initial view = title screen
  const [fading, setFading] = useState(false)
  const pendingRef          = useRef(null)   // { view, options } waiting to fire

  // ── HUD visibility state ────────────────────────────────────────
  // hudReady: artifact has finished loading, HUD should be visible
  // hudFading: user is navigating away, HUD should fade out
  const [hudReady,  setHudReady]  = useState(false)
  const [hudFading, setHudFading] = useState(false)

  // ── Continue button action ──────────────────────────────────────
  // null = hidden; fn = shown and wired to that callback
  const [continueAction, setContinueAction] = useState(null)

  // Progress dot under the pointer, for the era tooltip (null = none)
  const [hoverDot, setHoverDot] = useState(null)
  const hoverMeta = hoverDot === null ? null : LEVEL_META['level' + hoverDot]

  const showHUD    = !HUD_HIDDEN_VIEWS.includes(view)
  const meta       = LEVEL_META[view] || {}
  const activeLevel = meta.level ?? null

  // ── Called by level components when their artifact is ready ─────
  const notifyArtifactReady = useCallback(() => {
    setHudReady(true)
  }, [])

  // ── Intercept navigation: fade HUD + content out, then swap view ─
  // `to` is still a path string (e.g. "/timeline", "/level/2") so existing
  // call sites work unchanged; we translate it to a view key here.
  const fadeNavigate = useCallback((to, options) => {
    const nextView = PATH_TO_VIEW[to]
    if (!nextView) return                       // unknown path — ignore
    if (nextView === view && !options) return
    setContinueAction(null)  // clear Continue button on navigate
    setHudFading(true)       // start HUD fade-out (200ms)
    setHudReady(false)       // mark not ready (visual driven by hudFading until nav completes)
    pendingRef.current = { view: nextView, options }
    setFading(true)          // start content fade-out (300ms)
  }, [view])

  // Fires when the content div finishes its CSS opacity transition
  const handleTransitionEnd = useCallback((e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
    if (!pendingRef.current) return
    const { view: nextView } = pendingRef.current
    pendingRef.current = null
    setView(nextView)
    // Fade the new view in only once the browser is painting it smoothly.
    // Mounting a heavy view (the Mac's bezel, fonts, textures) can stall
    // rendering for ~200ms after the swap; a fade started before that stall
    // is swallowed by it, and the page simply appears. Wait for two
    // consecutive quick frames (capped at 600ms) and then start the fade.
    whenFramesSettle(() => {
      setFading(false)
      setHudFading(false)
      // hudReady stays false — level's notifyArtifactReady will set it true
    })
  }, [])

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
    <ViewCtx.Provider value={view}>
    <FadeNavCtx.Provider value={fadeNavigate}>
      <HudCtx.Provider value={notifyArtifactReady}>
        <ContinueCtx.Provider value={setContinueAction}>
          <div className={styles.room}>

            {showHUD && (
              <>
                {/* Top-left — era label + level title */}
                <div className={styles.hudTopLeft} data-hud style={hudStyle('down', 0)}>
                  <span className={styles.eraLabel}>{meta.era}</span>
                  <span className={styles.levelTitle}>{meta.title}</span>
                </div>

                {/* Top-right — progress dots */}
                <div className={styles.hudTopRight} data-hud style={hudStyle('down', 0)} onMouseLeave={() => setHoverDot(null)}>
                  {LEVEL_NUMBERS.map(n => (
                    <button
                      key={n}
                      type="button"
                      className={styles.dotHit}
                      aria-label={`${LEVEL_META['level' + n].era} — ${LEVEL_META['level' + n].title}`}
                      onMouseEnter={() => setHoverDot(n)}
                      onFocus={() => setHoverDot(n)}
                      onBlur={() => setHoverDot(null)}
                      onClick={() => fadeNavigate('/level/' + n)}
                    >
                      <span className={dotClass(n, activeLevel)} />
                    </button>
                  ))}
                  {/* Era tooltip: hangs under the dot row, right-aligned, same
                      type as the top-left label. Absolute, so it adds nothing
                      to the data-hud box useArtifactFit measures. */}
                  <div className={`${styles.dotTip} ${hoverMeta ? styles.dotTipVisible : ''}`} aria-hidden="true">
                    <span className={styles.eraLabel}>{hoverMeta?.era}</span>
                    <span className={styles.levelTitle}>{hoverMeta?.title}</span>
                  </div>
                </div>

                {/* Bottom-right — Continue (when objectives done) + back to timeline */}
                <div className={styles.hudBottomRight} data-hud style={hudStyle('up', 200)}>
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

            {/* Level / page content — fades between views */}
            <div
              className={styles.content}
              style={{ opacity: fading ? 0 : 1 }}
              onTransitionEnd={handleTransitionEnd}
            >
              {children}
            </div>

          </div>
        </ContinueCtx.Provider>
      </HudCtx.Provider>
    </FadeNavCtx.Provider>
    </ViewCtx.Provider>
  )
}
