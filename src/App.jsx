// src/App.jsx
import SharedLayout, { useCurrentView } from './shared/SharedLayout'
import { Suspense } from 'react'
import TitleScreen from './pages/TitleScreen'
import Timeline from './pages/Timeline'
import { LAZY_VIEWS } from './views'

// Renders the component for the active view. Lives inside SharedLayout's
// provider tree so it can read the current view from context. Navigation is
// state-based — the URL stays at "/" no matter which view is shown.
function ViewSwitch() {
  const view = useCurrentView()
  if (view === 'timeline') return <Timeline />
  const Lazy = LAZY_VIEWS[view]
  if (!Lazy) return <TitleScreen />
  // SharedLayout waits for the chunk before swapping views, so this
  // fallback only shows if a chunk is still loading (e.g. a slow network).
  return (
    <Suspense fallback={null}>
      <Lazy />
    </Suspense>
  )
}

export default function App() {
  return (
    <SharedLayout>
      <ViewSwitch />
    </SharedLayout>
  )
}
