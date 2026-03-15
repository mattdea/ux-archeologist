// src/levels/Level2.jsx
import { useState } from 'react'
import styles from './Level2.module.css'
import BrowserChrome from '../components/web/BrowserChrome'
import YahooDirectory from '../components/web/pages/YahooDirectory'
import useBezelScale from '../hooks/useBezelScale'
import { completeLevel } from '../state/state'
import IntroModal from '../shared/museum-ui/IntroModal'
import ObjectiveTracker from '../shared/museum-ui/ObjectiveTracker'
import DiscoveryCard from '../shared/museum-ui/DiscoveryCard'

const OBJECTIVES = [
  'Navigate to a new page',
  'Return to a previous page',
  "Find 'A Brief History of the Web'",
]

// Maps interaction keys → OBJECTIVES indices (wired up in interaction pass)
const OBJ_KEY_INDEX = { navigate: 0, goBack: 1, findPaper: 2 }

// BrowserChrome native dimensions
const BROWSER_W = 700
const BROWSER_H = 520

export default function Level2() {
  const [screen, setScreen] = useState('intro')
  const [completedIndices, setCompletedIndices] = useState([])
  const scale = useBezelScale(BROWSER_W, BROWSER_H, { marginTop: 80 })

  // Will be wired to page interactions in the next pass
  const completeObjective = (key) => {
    const idx = OBJ_KEY_INDEX[key]
    if (idx !== undefined) {
      setCompletedIndices(prev => prev.includes(idx) ? prev : [...prev, idx])
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
          description="Instead of searching for information or requesting it from a system, users could follow connections between documents. The web made knowledge spatial: not a destination, but a path you chose to walk."
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
            currentUrl="http://www.yahoo.com/"
            pageTitle="Yahoo!"
          >
            <YahooDirectory />
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
