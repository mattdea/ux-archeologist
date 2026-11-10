// src/levels/Level2.jsx
import { useState, useCallback, useEffect } from 'react'
import styles from './Level2.module.css'
import '../components/era-cursors.css'
import BrowserChrome from '../components/web/BrowserChrome'
import YahooDirectory from '../components/web/pages/YahooDirectory'
import YahooComputers from '../components/web/pages/YahooComputers'
import ValleyComputer from '../components/web/pages/ValleyComputer'
import VintageArchive from '../components/web/pages/VintageArchive'
import ProgressiveReveal from '../components/web/ProgressiveReveal'
import useNetscapeLoad from '../components/web/useNetscapeLoad'
import * as sfx from '../audio/sfx'
import useArtifactFit from '../hooks/useArtifactFit'
import { completeLevel, isLevelComplete, addArtifact } from '../state/state'
import { ARTIFACTS } from '../data/artifacts'
import IntroModal from '../shared/museum/IntroModal'
import ObjectiveTracker from '../shared/museum/ObjectiveTracker'
import DiscoveryCard from '../shared/museum/DiscoveryCard'
import HintPill from '../shared/museum/HintPill'
import useHint from '../shared/museum-ui/useHint'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

const { name: ARTIFACT_NAME, description: DISCOVERY_DESCRIPTION } = ARTIFACTS[2]

// ── Page metadata ───────────────────────────────────────────────────
// kb: fake document size for the status bar's "47% of 23K" line.
const PAGES = {
  'yahoo':           { url: 'http://www.yahoo.com/',                        title: 'Yahoo!',                          kb: 23 },
  'yahoo-computers': { url: 'http://www.yahoo.com/Computers_and_Internet/', title: 'Yahoo! - Computers and Internet', kb: 11 },
  'valley':          { url: 'http://www.valleycomputer.com/',               title: 'Valley Computer Repair & Sales',  kb: 8 },
  'archive':         { url: 'http://www.geocities.com/SiliconValley/4527/', title: 'The Vintage Computer Archive',    kb: 16 },
}
const hostOf = url => new URL(url).host

// ── Objective definitions ───────────────────────────────────────────
const OBJECTIVES = [
  'Navigate to a new page',
  'Go back a page',
  'Find "A Brief History of the Web"',
]

// One nudge per objective, shown only after the player has stalled
const HINTS = [
  'Click any underlined link',
  'Click Back in the toolbar',
  'On Yahoo!, click Computers and Internet and look for an archive of old computers',
]

// Maps objective key → OBJECTIVES array index
const OBJ_KEY_INDEX = { navigate: 0, goBack: 1, findPaper: 2 }

// BrowserChrome native dimensions
const BROWSER_W = 700
const BROWSER_H = 580 // must match BrowserChrome.module.css

// Matches --bottom-zone-height in Level2.module.css

export default function Level2() {
  // ── Museum screen state ─────────────────────────────────────────
  // intro → loading → playing → discovery
  // Replay (level already complete): skip the intro card, replay the load.
  const [screen, setScreen] = useState(() => isLevelComplete(2) ? 'loading' : 'intro')

  // ── Page loading (1995 modem feel) ──────────────────────────────
  // useNetscapeLoad runs the contact → reply → transfer → done stages and
  // the status bar text; `shownPage` is what the viewport is drawing. The
  // old page stays up until the new one's first bytes arrive (transfer), as
  // Netscape did, then the new page fills in block by block.
  const netLoad = useNetscapeLoad()
  const [shownPage, setShownPage] = useState(null)

  // ── Completed objectives ────────────────────────────────────────
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(2) ? [0, 1, 2] : [])
  const hint = useHint(HINTS, { active: screen === 'playing', completedIndices })

  // ── Browser navigation state ────────────────────────────────────
  const [history, setHistory]           = useState(['yahoo'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [hoverUrl, setHoverUrl]         = useState(null)

  // ── Responsive scaling ──────────────────────────────────────────
  // Fits the artifact around the HUD corners, as large as the viewport allows
  const fit = useArtifactFit(BROWSER_W, BROWSER_H)
  const scale = fit.scale
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Notify SharedLayout when artifact is ready for interaction: fires when
  // the first page's load completes → screen='playing' (first visit or replay).
  useEffect(() => {
    if (screen === 'playing') notifyArtifactReady()
  }, [screen, notifyArtifactReady])

  // Wire / unwire the HUD Continue button based on play state + completion.
  const allComplete = completedIndices.length === OBJECTIVES.length
  useEffect(() => {
    if (screen === 'playing' && allComplete) {
      setContinue(() => () => { completeLevel(2); setScreen('discovery') })
    } else {
      setContinue(null)
    }
  }, [screen, allComplete, setContinue])

  // Record artifact when discovery card appears
  useEffect(() => {
    if (screen === 'discovery') {
      addArtifact({ name: ARTIFACT_NAME, era: '1995', description: DISCOVERY_DESCRIPTION })
    }
  }, [screen])

  // ── Derived browser values ──────────────────────────────────────
  const currentPage  = history[historyIndex]
  const canGoBack    = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1
  const currentUrl   = PAGES[currentPage].url
  const pageTitle    = PAGES[currentPage].title

  // During intro: show 'about:blank' until page starts loading
  const displayUrl   = screen === 'intro' ? 'about:blank' : currentUrl
  // During intro: blank title bar (no page loaded)
  const displayTitle = screen === 'intro' ? '' : pageTitle

  // Status bar: a hovered link's URL wins while idle; otherwise the loader's line
  const statusText = (!netLoad.loading && hoverUrl) ? hoverUrl : netLoad.status

  // ── Objective completion ────────────────────────────────────────
  const completeObjective = useCallback((key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
    }
  }, [])

  // ── Fetch a page ────────────────────────────────────────────────
  // `slow` is the first load of the session: a longer handshake and a
  // slower trickle, as if the modem had just connected. On the first visit
  // it also ends the 'loading' screen.
  const fetchPage = useCallback((pageKey, { slow = false, boot = false } = {}) => {
    if (slow) sfx.dialup()   // real recording if one is in assets/web/, else silent
    netLoad.start(pageKey, {
      host: hostOf(PAGES[pageKey].url),
      kb: PAGES[pageKey].kb,
      slow,
      onDone: boot ? () => setScreen('playing') : undefined,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netLoad.start])

  // Replay: no intro card, so start the first (dial-up) load on mount
  useEffect(() => {
    if (isLevelComplete(2)) fetchPage('yahoo', { slow: true, boot: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The viewport switches to the new page when its transfer begins
  useEffect(() => {
    if (netLoad.load && netLoad.load.stage !== 'contact' && netLoad.load.stage !== 'reply') {
      setShownPage(netLoad.load.page)
    }
  }, [netLoad.load])

  // ── Navigate forward to a new page ─────────────────────────────
  const navigate = useCallback((pageKey) => {
    completeObjective('navigate')
    setHistory(prev => [...prev.slice(0, historyIndex + 1), pageKey])
    setHistoryIndex(prev => prev + 1)
    fetchPage(pageKey)
  }, [historyIndex, completeObjective, fetchPage])

  // ── Go back ─────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (!canGoBack) return
    completeObjective('goBack')
    setHistoryIndex(prev => prev - 1)
    fetchPage(history[historyIndex - 1])
  }, [canGoBack, completeObjective, history, historyIndex, fetchPage])

  // ── Go forward ──────────────────────────────────────────────────
  const goForward = useCallback(() => {
    if (!canGoForward) return
    setHistoryIndex(prev => prev + 1)
    fetchPage(history[historyIndex + 1])
  }, [canGoForward, history, historyIndex, fetchPage])

  // ── Page renderer ───────────────────────────────────────────────
  const renderPage = () => {
    // Nothing drawn yet: intro, or the first page's bytes haven't arrived
    if (screen === 'intro' || !shownPage) return null

    // How much of the drawn page has arrived (1 = all of it). While a new
    // page is still connecting, the old one stays fully drawn.
    const progress = netLoad.load && netLoad.load.page === shownPage && netLoad.progress !== null
      ? netLoad.progress : 1
    // Yahoo's own image staging: broken logo → logo → banner → the rest
    const yahooPhase = progress >= 1 ? Infinity
      : progress < 0.2 ? 1 : progress < 0.45 ? 2 : progress < 0.65 ? 3 : progress < 0.85 ? 4 : 5
    const live = screen !== 'loading'

    const page = (() => {
      switch (shownPage) {
        case 'yahoo':
          return <YahooDirectory onNavigate={live ? navigate : () => {}} onLinkHover={live ? setHoverUrl : () => {}} loadPhase={yahooPhase} />
        case 'yahoo-computers':
          return <YahooComputers onNavigate={navigate} onLinkHover={setHoverUrl} />
        case 'valley':
          return <ValleyComputer onNavigate={navigate} onLinkHover={setHoverUrl} />
        case 'archive':
          return <VintageArchive completeObjective={completeObjective} onLinkHover={setHoverUrl} />
        default:
          return null
      }
    })()
    return <ProgressiveReveal progress={progress}>{page}</ProgressiveReveal>
  }

  return (
    <>
      {/* ── Museum overlays (position: fixed, centered in full viewport) ── */}

      {screen === 'intro' && (
        <IntroModal
          era="1995"
          title="The Hyperlink"
          description="It's 1995, and this is Netscape Navigator, the browser most people use to get on the web. The web has no map, and no good way to search it yet. Every link was put there by a person, and following them is the only way around, so where you end up depends on whose pages you happen to find."
          objectives={OBJECTIVES}
          onBegin={() => {
            setScreen('loading')
            fetchPage('yahoo', { slow: true, boot: true })
          }}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1995"
          artifactName={ARTIFACT_NAME}
          description={DISCOVERY_DESCRIPTION}
          nextUrl="/level/3"
        />
      )}

      {/* ── Three-zone layout ─────────────────────────────────────── */}
      <div className={styles.levelPage}>

        {/* Zone 1 — mirrors Zone 3 height so artifact centers vertically */}
        <div className={styles.topSpacer} />

        {/* Zone 2 — artifact, fills remaining height */}
        <div className={styles.artifactZone}>
          <div
            className={`${styles.wrap} ${netLoad.loading ? styles.wrapBusy : ''}`}
            style={{ width: BROWSER_W * scale, height: BROWSER_H * scale, left: fit.left, top: fit.top }}
          >
            <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
              <BrowserChrome
                currentUrl={displayUrl}
                pageTitle={displayTitle}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onBack={goBack}
                onForward={goForward}
                statusText={statusText}
                loading={netLoad.loading}
              >
                {renderPage()}
              </BrowserChrome>
            </div>
          </div>
        </div>

        {/* Zone 3 — ObjectiveTracker; always rendered for stable layout */}
        <HintPill docked text={hint} />
        <div data-hud className={`${styles.bottomZone} ${screen === 'playing' ? styles.bottomZoneVisible : ''}`}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
          />
        </div>

      </div>
    </>
  )
}
