// src/App.jsx
import { useState } from 'react'
import styles from './App.module.css'
import MonitorBezel from './components/MonitorBezel'
import IntroModal from './components/IntroModal'
import DesktopScene from './components/DesktopScene'
import BootSequence from './components/BootSequence'
import ArtifactModal from './components/ArtifactModal'
import CompletionScreen from './components/CompletionScreen'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [objectives, setObjectives] = useState({
    openFolder: false,
    trashFile: false,
    useMenu: false,
  })

  const completeObjective = (key) => {
    setObjectives(prev => ({ ...prev, [key]: true }))
  }

  const handleReset = () => {
    setObjectives({ openFolder: false, trashFile: false, useMenu: false })
    setScreen('intro')
  }

  const showDesktop = screen === 'playing' || screen === 'artifact' || screen === 'intro' || screen === 'booting'

  return (
    <MonitorBezel booting={screen === 'booting'}>
      <div className={styles.app}>
        {showDesktop && (
          <DesktopScene
            objectives={objectives}
            completeObjective={completeObjective}
            active={screen === 'playing'}
            onContinue={() => setScreen('artifact')}
          />
        )}

        {screen === 'intro' && (
          <IntroModal onBegin={() => setScreen('booting')} />
        )}

        {screen === 'booting' && (
          <BootSequence onComplete={() => setScreen('playing')} />
        )}

        {screen === 'artifact' && (
          <ArtifactModal onContinue={() => setScreen('complete')} />
        )}

        {screen === 'complete' && (
          <CompletionScreen onReset={handleReset} />
        )}
      </div>
    </MonitorBezel>
  )
}
