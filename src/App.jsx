// src/App.jsx
import SharedLayout, { useCurrentView } from './shared/SharedLayout'
import TitleScreen from './pages/TitleScreen'
import Level0 from './levels/Level0'
import Level1 from './levels/Level1'
import Level2 from './levels/Level2'
import Level3 from './levels/Level3'
import Level4 from './levels/Level4'
import Level5 from './levels/Level5'
import Collection from './pages/Collection'
import Timeline from './pages/Timeline'
import TestMuseumUI from './pages/TestMuseumUI'

// Renders the component for the active view. Lives inside SharedLayout's
// provider tree so it can read the current view from context. Navigation is
// state-based — the URL stays at "/" no matter which view is shown.
function ViewSwitch() {
  const view = useCurrentView()
  switch (view) {
    case 'timeline':   return <Timeline />
    case 'level0':     return <Level0 />
    case 'level1':     return <Level1 />
    case 'level2':     return <Level2 />
    case 'level3':     return <Level3 />
    case 'level4':     return <Level4 />
    case 'level5':     return <Level5 />
    case 'collection': return <Collection />
    case 'test':       return <TestMuseumUI />
    case 'title':
    default:           return <TitleScreen />
  }
}

export default function App() {
  return (
    <SharedLayout>
      <ViewSwitch />
    </SharedLayout>
  )
}
