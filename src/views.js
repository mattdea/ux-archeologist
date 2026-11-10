// src/views.js
// Each level (and the rarely seen pages) is its own chunk, so the title
// screen doesn't download every artifact's code. SharedLayout calls
// loadView() as a navigation starts, so the chunk arrives during the 300ms
// fade-out and the view is ready when it's swapped in. Title and timeline
// stay in the main bundle.
import { lazy } from 'react'
import monitorBezelUrl from '../assets/MonitorBezel@2x.webp'

const LOADERS = {
  level0:     () => import('./levels/Level0'),
  level1:     () => import('./levels/Level1'),
  level2:     () => import('./levels/Level2'),
  level3:     () => import('./levels/Level3'),
  level4:     () => import('./levels/Level4'),
  level5:     () => import('./levels/Level5'),
  collection: () => import('./pages/Collection'),
  test:       () => import('./pages/TestMuseumUI'),
  ...(import.meta.env.DEV ? { cardLab: () => import('./pages/CardLab') } : {}),
}

const loading = {}

/** Starts (or reuses) the download of a view's chunk. Resolves when ready. */
export function loadView(view) {
  const loader = LOADERS[view]
  if (!loader) return Promise.resolve()
  if (!loading[view]) {
    loading[view] = loader().catch((err) => { delete loading[view]; throw err })
  }
  return loading[view]
}

/** Lazy components for every split view, keyed by view. */
export const LAZY_VIEWS = Object.fromEntries(
  Object.keys(LOADERS).map((view) => [view, lazy(() => loadView(view))])
)

// The Mac's bezel (243 KB) is fetched once, when the timeline or Level 1
// is on its way, instead of preloaded for every visitor.
let bezelWarmed = false
export function warmMacBezel() {
  if (bezelWarmed || typeof Image === 'undefined') return
  bezelWarmed = true
  const img = new Image()
  img.decoding = 'async'
  img.src = monitorBezelUrl
}
