import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import App from './App.jsx'
import { applyDevLooks } from './shared/devLooks'

if (import.meta.env.DEV) applyDevLooks()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
