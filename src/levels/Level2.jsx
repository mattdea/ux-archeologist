// src/levels/Level2.jsx
import { useState, useCallback, useEffect } from 'react'
import styles from './Level2.module.css'
import BrowserChrome from '../components/web/BrowserChrome'
import YahooDirectory from '../components/web/pages/YahooDirectory'
import YahooComputers from '../components/web/pages/YahooComputers'
import ValleyComputer from '../components/web/pages/ValleyComputer'
import VintageArchive from '../components/web/pages/VintageArchive'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel, isLevelComplete } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'
import { useArtifactReady, useSetContinue } from '../shared/SharedLayout'

// ── Page metadata ───────────────────────────────────────────────────
const PAGES = {
  'yahoo':           { url: 'http://www.yahoo.com/',                        title: 'Yahoo!' },
  'yahoo-computers': { url: 'http://www.yahoo.com/Computers_and_Internet/', title: 'Yahoo! - Computers and Internet' },
  'valley':          { url: 'http://www.valleycomputer.com/',               title: 'Valley Computer Repair & Sales' },
  'archive':         { url: 'http://www.geocities.com/SiliconValley/4527/', title: 'The Vintage Computer Archive' },
}

// ── Objective definitions ───────────────────────────────────────────
const OBJECTIVES = [
  'Navigate to a new page',
  'Return to a previous page',
  "Find 'A Brief History of the Web'",
]

// Maps objective key → OBJECTIVES array index
const OBJ_KEY_INDEX = { navigate: 0, goBack: 1, findPaper: 2 }

// BrowserChrome native dimensions
const BROWSER_W = 700
const BROWSER_H = 520

// Loading delay (ms) — mimics mid-90s dial-up latency (page navigation)
const LOAD_DELAY = 500

export default function Level2() {
  // ── Museum screen state ─────────────────────────────────────────
  // intro → loading → playing → discovery
  const [screen, setScreen] = useState(() => isLevelComplete(2) ? 'playing' : 'intro')

  // ── Boot-time page load sequence phase (0–6) ────────────────────
  // Only plays on first visit. Replays skip straight to 'playing'.
  // Phase meaning:
  //   0  → status bar shows "Opening page...", address bar shows URL
  //   1  → white page background appears (YahooDirectory mounts, empty)
  //   2  → Yahoo logo placeholder (broken image) appears
  //   3  → Yahoo logo image loads
  //   4  → Banner ad image loads
  //   5  → Rest of page content (search, nav, categories, footer)
  //   6  → Status bar "Done", screen transitions to 'playing'
  const [loadPhase, setLoadPhase] = useState(-1)

  // ── Completed objectives ────────────────────────────────────────
  const [completedIndices, setCompletedIndices] = useState(() => isLevelComplete(2) ? [0, 1, 2] : [])

  // ── Browser navigation state ────────────────────────────────────
  const [history, setHistory]           = useState(['yahoo'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isNavLoading, setIsNavLoading] = useState(false)
  const [hoverUrl, setHoverUrl]         = useState(null)

  // ── Responsive scaling ──────────────────────────────────────────
  // marginBottom = tracker height (~140px) + artifact→tracker gap (20px) + levelLayout padding (20px)
  const scale = useBezelScale(BROWSER_W, BROWSER_H, { marginTop: 80, marginBottom: 180 })
  const notifyArtifactReady = useArtifactReady()
  const setContinue = useSetContinue()

  // Notify SharedLayout when artifact is ready for interaction.
  // Normal flow: fires when modem load sequence completes → screen='playing'.
  // Replay flow: screen starts as 'playing', fires immediately on mount.
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

  // Status bar text varies by state
  const statusText = (() => {
    if (screen === 'loading') {
      if (loadPhase <= 0) return `Opening page ${PAGES.yahoo.url}...`
      return 'Transferring data from www.yahoo.com...'
    }
    return hoverUrl ?? (isNavLoading ? 'Loading...' : 'Done')
  })()

  // ── Objective completion ────────────────────────────────────────
  const completeObjective = useCallback((key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
    }
  }, [])

  // ── Per-page navigation loading simulation ──────────────────────
  const simulateNavLoad = () => {
    setIsNavLoading(true)
    setTimeout(() => setIsNavLoading(false), LOAD_DELAY)
  }

  // ── Boot-time 28.8k modem load sequence ────────────────────────
  // Fires once when "Begin excavation" is clicked on a fresh visit.
  const startLoadSequence = useCallback(() => {
    setLoadPhase(0)
    setTimeout(() => setLoadPhase(1), 500)
    setTimeout(() => setLoadPhase(2), 1000)
    setTimeout(() => setLoadPhase(3), 1500)
    setTimeout(() => setLoadPhase(4), 2000)
    setTimeout(() => setLoadPhase(5), 2500)
    setTimeout(() => { setLoadPhase(6); setScreen('playing') }, 3000)
  }, [])

  // ── Navigate forward to a new page ─────────────────────────────
  const navigate = useCallback((pageKey) => {
    completeObjective('navigate')
    setHistory(prev => [...prev.slice(0, historyIndex + 1), pageKey])
    setHistoryIndex(prev => prev + 1)
    simulateNavLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, completeObjective])

  // ── Go back ─────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (!canGoBack) return
    completeObjective('goBack')
    setHistoryIndex(prev => prev - 1)
    simulateNavLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoBack, completeObjective])

  // ── Go forward ──────────────────────────────────────────────────
  const goForward = useCallback(() => {
    if (!canGoForward) return
    setHistoryIndex(prev => prev + 1)
    simulateNavLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoForward])

  // ── Page renderer ───────────────────────────────────────────────
  const renderPage = () => {
    // Intro: blank white content area (browser chrome visible, no page loaded)
    if (screen === 'intro') return null

    // Navigation loading: blank while page is "downloading" between pages
    if (isNavLoading) return null

    // Boot load sequence: progressively reveal YahooDirectory
    if (screen === 'loading') {
      if (loadPhase < 1) return null  // phase 0: blank, page background not yet visible
      return (
        <YahooDirectory
          onNavigate={() => {}}
          onLinkHover={() => {}}
          loadPhase={loadPhase}
        />
      )
    }

    // Fully playing or discovery: render whichever page is current
    switch (currentPage) {
      case 'yahoo':
        return <YahooDirectory onNavigate={navigate} onLinkHover={setHoverUrl} />
      case 'yahoo-computers':
        return <YahooComputers onNavigate={navigate} onLinkHover={setHoverUrl} />
      case 'valley':
        return <ValleyComputer onNavigate={navigate} onLinkHover={setHoverUrl} />
      case 'archive':
        return <VintageArchive completeObjective={completeObjective} onLinkHover={setHoverUrl} />
      default:
        return null
    }
  }

  return (
    <>
      {/* ── Museum overlays (position: fixed) ───────────────────── */}

      {screen === 'intro' && (
        <IntroModal
          era="1995"
          title="The Hypertext Web"
          description="Information wasn't something you searched for. It was something you followed, one link at a time."
          objectives={OBJECTIVES}
          onBegin={() => {
            setScreen('loading')
            startLoadSequence()
          }}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1995"
          artifactName="Hyperlink Navigation"
          description="The early web wasn't searched. It was browsed. Every page linked to other pages, and finding what you needed meant following a trail of connections that other people had made."
          nextUrl="/timeline"
        />
      )}

      {/* ── Level layout — artifact centered in padded zone ─────── */}
      <div className={styles.levelLayout}>
        <div
          className={styles.wrap}
          style={{ width: BROWSER_W * scale, height: BROWSER_H * scale }}
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
            >
              {renderPage()}
            </BrowserChrome>
          </div>
        </div>
      </div>

      {/* ObjectiveTracker — fixed bottom-left, always rendered for stable layout */}
      <div className={`${styles.trackerWrap} ${screen === 'playing' ? styles.trackerWrapVisible : ''}`}>
        <ObjectiveTracker
          objectives={OBJECTIVES}
          completedIndices={completedIndices}
        />
      </div>
    </>
  )
}
