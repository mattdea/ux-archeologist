// src/App.jsx
import { useState, useEffect } from 'react'
import styles from './App.module.css'
import IntroModal from './components/IntroModal'
import DesktopScene from './components/DesktopScene'
import ArtifactModal from './components/ArtifactModal'
import CompletionScreen from './components/CompletionScreen'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [objectives, setObjectives] = useState({
    openFolder: false,
    trashFile: false,
    useMenu: false,
  })

  useEffect(() => {
    if (
      screen === 'playing' &&
      objectives.openFolder &&
      objectives.trashFile &&
      objectives.useMenu
    ) {
      const timer = setTimeout(() => setScreen('artifact'), 600)
      return () => clearTimeout(timer)
    }
  }, [objectives, screen])

  const completeObjective = (key) => {
    setObjectives(prev => ({ ...prev, [key]: true }))
  }

  const handleReset = () => {
    setObjectives({ openFolder: false, trashFile: false, useMenu: false })
    setScreen('intro')
  }

  const showDesktop = screen === 'playing' || screen === 'artifact' || screen === 'intro'

  return (
    <div className={styles.app}>
      {showDesktop && (
        <DesktopScene
          objectives={objectives}
          completeObjective={completeObjective}
          active={screen === 'playing'}
        />
      )}

      {screen === 'intro' && (
        <IntroModal onBegin={() => setScreen('playing')} />
      )}

      {screen === 'artifact' && (
        <ArtifactModal onContinue={() => setScreen('complete')} />
      )}

      {screen === 'complete' && (
        <CompletionScreen onReset={handleReset} />
      )}
    </div>
  )
}
