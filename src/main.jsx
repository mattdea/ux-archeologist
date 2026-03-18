import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import App from './App.jsx'

// Preload heavy level assets so they're ready before the user navigates to them.
// Module-level side effect fires before createRoot — earliest possible moment.
import monitorBezelUrl from '../assets/MonitorBezel.svg'
const _preloadMonitor = Object.assign(document.createElement('link'), {
  rel: 'preload', as: 'image', href: monitorBezelUrl,
})
document.head.appendChild(_preloadMonitor)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
