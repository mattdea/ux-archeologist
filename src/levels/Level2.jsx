// src/levels/Level2.jsx
import { useState, useCallback } from 'react'
import styles from './Level2.module.css'
import BrowserChrome from '../components/web/BrowserChrome'
import YahooDirectory from '../components/web/pages/YahooDirectory'
import YahooComputers from '../components/web/pages/YahooComputers'
import ValleyComputer from '../components/web/pages/ValleyComputer'
import VintageArchive from '../components/web/pages/VintageArchive'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'

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

// Loading delay (ms) — mimics mid-90s dial-up latency
const LOAD_DELAY = 500

export default function Level2() {
  // ── Museum screen state ─────────────────────────────────────────
  const [screen, setScreen] = useState('intro')

  // ── Completed objectives ────────────────────────────────────────
  const [completedIndices, setCompletedIndices] = useState([])

  // ── Browser navigation state ────────────────────────────────────
  const [history, setHistory]           = useState(['yahoo'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isLoading, setIsLoading]       = useState(false)
  const [hoverUrl, setHoverUrl]         = useState(null)

  // ── Responsive scaling ──────────────────────────────────────────
  const scale = useBezelScale(BROWSER_W, BROWSER_H, { marginTop: 80 })

  // ── Derived browser values ──────────────────────────────────────
  const currentPage  = history[historyIndex]
  const canGoBack    = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1
  const statusText   = hoverUrl ?? (isLoading ? 'Loading...' : 'Done')
  const currentUrl   = PAGES[currentPage].url
  const pageTitle    = PAGES[currentPage].title

  // ── Objective completion ────────────────────────────────────────
  const completeObjective = useCallback((key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
    }
  }, [])

  // ── Loading simulation ──────────────────────────────────────────
  const simulateLoad = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), LOAD_DELAY)
  }

  // ── Navigate forward to a new page ─────────────────────────────
  const navigate = useCallback((pageKey) => {
    // Complete obj1 on first navigation (idempotent)
    completeObjective('navigate')

    // Truncate any forward history, push new page
    setHistory(prev => [...prev.slice(0, historyIndex + 1), pageKey])
    setHistoryIndex(prev => prev + 1)
    simulateLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, completeObjective])

  // ── Go back ─────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    if (!canGoBack) return
    completeObjective('goBack')
    setHistoryIndex(prev => prev - 1)
    simulateLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoBack, completeObjective])

  // ── Go forward ──────────────────────────────────────────────────
  const goForward = useCallback(() => {
    if (!canGoForward) return
    setHistoryIndex(prev => prev + 1)
    simulateLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoForward])

  // ── Page renderer ───────────────────────────────────────────────
  const renderPage = () => {
    // Show blank white content area during load
    if (isLoading) return null

    switch (currentPage) {
      case 'yahoo':
        return (
          <YahooDirectory
            onNavigate={navigate}
            onLinkHover={setHoverUrl}
          />
        )
      case 'yahoo-computers':
        return (
          <YahooComputers
            onNavigate={navigate}
            onLinkHover={setHoverUrl}
          />
        )
      case 'valley':
        return (
          <ValleyComputer
            onNavigate={navigate}
            onLinkHover={setHoverUrl}
          />
        )
      case 'archive':
        return (
          <VintageArchive
            completeObjective={completeObjective}
            onLinkHover={setHoverUrl}
          />
        )
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
          onBegin={() => setScreen('playing')}
        />
      )}

      {screen === 'discovery' && (
        <DiscoveryCard
          era="1995"
          artifactName="Hyperlink Navigation"
          description="Instead of searching for information or requesting it from a system, users followed connections between documents. A directory led to a shop. The shop led to a collector's page. The collector led to history. Every page was someone's door, and every link was an invitation to walk through it."
          nextUrl="/timeline"
        />
      )}

      {/* ── Browser (always visible — the artifact) ─────────────── */}
      <div
        className={styles.wrap}
        style={{ width: BROWSER_W * scale, height: BROWSER_H * scale }}
      >
        <div className={styles.scaler} style={{ transform: `scale(${scale})` }}>
          <BrowserChrome
            currentUrl={currentUrl}
            pageTitle={pageTitle}
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

      {/* ── ObjectiveTracker: fixed museum space, bottom-left ───── */}
      {screen === 'playing' && (
        <div className={styles.trackerWrap}>
          <ObjectiveTracker
            objectives={OBJECTIVES}
            completedIndices={completedIndices}
            onContinue={() => { completeLevel(2); setScreen('discovery') }}
          />
        </div>
      )}
    </>
  )
}
